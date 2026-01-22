/**
 * Geo Data Stories - App.jsx
 * Version: 5.0.0 (Refactored)
 * Last Updated: 2026-01-18
 *
 * CHANGELOG:
 * v5.0.0 (2026-01-18) - MAJOR REFACTOR
 * - Refactored: Split 1500+ line file into modular components
 * - Added: Custom hooks (useStories, useLightbox, useFilters)
 * - Added: Separate config files (api.js, gridCells.js)
 * - Added: Reusable components (StoryForm, StoryDetailView, FilterBar, etc.)
 * - Improved: Code organization and maintainability
 * - Preserved: All original functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

// Config
import { brabrandCenter, gridCells } from './config/gridCells';

// Hooks
import { useStories } from './hooks/useStories';
import { useLightbox } from './hooks/useLightbox';
import { useFilters } from './hooks/useFilters';

// Components
import StoryForm from './components/stories/StoryForm';
import StoryDetailView from './components/stories/StoryDetailView';
import FilterBar from './components/filters/FilterBar';
import ImageLightbox from './components/media/ImageLightbox';

const DataStoriesMap = () => {
  // Custom hooks
  const { stories, setStories, getAllTags, getAllKeywords } = useStories();
  const {
    lightboxOpen,
    lightboxImages,
    currentImageIndex,
    setCurrentImageIndex,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage
  } = useLightbox();
  const {
    activeTagFilter,
    activeKeywordFilter,
    setActiveTagFilter,
    setActiveKeywordFilter,
    getFilteredStories,
    clearFilters
  } = useFilters(stories);

  // Local state
  const [selectedStory, setSelectedStory] = useState(null);
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const gridRectanglesRef = useRef([]);
  const markersRef = useRef([]);
  const prevStoriesRef = useRef([]);
  const ghostMarkersRef = useRef([]);

  // Computed values
  const allTags = getAllTags();
  const allKeywords = getAllKeywords();

  // Initialize map
  useEffect(() => {
    const loadLeaflet = async () => {
      if (window.L && window.L.map && mapRef.current && !mapInstanceRef.current) {
        initMap();
      }
    };

    const timer = setTimeout(loadLeaflet, 100);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!window.L || !window.L.map) return;

    try {
      const map = window.L.map(mapRef.current, {
        preferCanvas: true
      }).setView([brabrandCenter.lat, brabrandCenter.lng], 15);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
        setMapReady(true);
      }, 300);
    } catch (error) {
      console.error('Map init error:', error);
    }
  };

  // Grid drawing and click handling
  const handleGridClick = (e, cell) => {
    const clickLat = e.latlng.lat;
    const clickLng = e.latlng.lng;

    const existingStoriesInGrid = stories.filter(s => s.gridId === cell.id);

    if (existingStoriesInGrid.length > 0) {
      showGhostMarkers(existingStoriesInGrid);
    }

    setSelectedGrid({
      ...cell,
      clickCoords: { lat: clickLat, lng: clickLng },
      existingStories: existingStoriesInGrid
    });
    setIsAddingStory(true);
    setSelectedStory(null);
  };

  const drawGrid = () => {
    if (!mapInstanceRef.current || !window.L) return;

    if (gridRectanglesRef.current.length > 0) {
      gridRectanglesRef.current.forEach((rect, index) => {
        const cell = gridCells[index];
        rect.off('click');
        rect.on('click', (e) => handleGridClick(e, cell));
      });
      return;
    }

    gridCells.forEach(cell => {
      const hasStory = stories.some(s => s.gridId === cell.id);

      const rect = window.L.rectangle(cell.bounds, {
        color: hasStory ? '#10b981' : '#3b82f6',
        fillColor: hasStory ? '#10b981' : '#3b82f6',
        fillOpacity: 0.05,
        weight: 1,
        dashArray: '3 6',
      }).addTo(mapInstanceRef.current);

      rect.on('click', (e) => handleGridClick(e, cell));
      rect.on('mouseover', function () { this.setStyle({ fillOpacity: 0.4 }); });
      rect.on('mouseout', function () { this.setStyle({ fillOpacity: 0.05 }); });

      gridRectanglesRef.current.push(rect);
    });
  };

  const updateGridColors = () => {
    if (!mapInstanceRef.current || gridRectanglesRef.current.length === 0) return;

    gridRectanglesRef.current.forEach((rect, index) => {
      const cell = gridCells[index];
      const hasStory = stories.some(s => s.gridId === cell.id);
      rect.setStyle({
        color: hasStory ? '#10b981' : '#3b82f6',
        fillColor: hasStory ? '#10b981' : '#3b82f6'
      });
    });
  };

  // Ghost markers
  const showGhostMarkers = (existingStories) => {
    if (!mapInstanceRef.current || !window.L) return;

    hideGhostMarkers();

    existingStories.forEach((story) => {
      const ghostHtml = `
        <div style="
          background: rgba(156, 163, 175, 0.4);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px dashed #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          font-size: 16px;
          pointer-events: none;
        ">👻</div>
      `;

      const ghostMarker = window.L.marker([story.lat, story.lng], {
        icon: window.L.divIcon({
          html: ghostHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: ''
        }),
        interactive: false
      }).addTo(mapInstanceRef.current);

      ghostMarkersRef.current.push(ghostMarker);
    });
  };

  const hideGhostMarkers = () => {
    ghostMarkersRef.current.forEach(m => m.remove());
    ghostMarkersRef.current = [];
  };

  // Marker clustering
  const addMarkersWithClustering = (storiesToShow) => {
    if (!mapInstanceRef.current || !window.L) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    if (storiesToShow.length === 0) return;

    const storiesByLocation = {};
    storiesToShow.forEach(story => {
      const key = `${story.lat.toFixed(6)},${story.lng.toFixed(6)}`;
      if (!storiesByLocation[key]) {
        storiesByLocation[key] = [];
      }
      storiesByLocation[key].push(story);
    });

    Object.entries(storiesByLocation).forEach(([, locationStories]) => {
      const count = locationStories.length;
      const story = locationStories[0];

      if (count === 1) {
        createGreenMarker(story);
      } else {
        createCountMarker(locationStories);
      }
    });
  };

  const createGreenMarker = (story) => {
    const markerHtml = `
      <div style="
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.3s ease;
      "
      onmouseenter="this.style.transform='scale(1.15)'"
      onmouseleave="this.style.transform='scale(1)'">📍</div>
    `;

    const marker = window.L.marker([story.lat, story.lng], {
      icon: window.L.divIcon({
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        className: ''
      })
    }).addTo(mapInstanceRef.current);

    marker.on('click', () => showAddStoryFormWithExisting([story]));
    markersRef.current.push(marker);
  };

  const createCountMarker = (locationStories) => {
    const story = locationStories[0];
    const count = locationStories.length;

    const markerHtml = `
      <div style="
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 16px rgba(16, 185, 129, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.3s ease;
        position: relative;
      "
      onmouseenter="this.style.transform='scale(1.15)'"
      onmouseleave="this.style.transform='scale(1)'">
        <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${count}</span>
      </div>
    `;

    const marker = window.L.marker([story.lat, story.lng], {
      icon: window.L.divIcon({
        html: markerHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        className: ''
      })
    }).addTo(mapInstanceRef.current);

    marker.on('click', () => showAddStoryFormWithExisting(locationStories));
    markersRef.current.push(marker);
  };

  const showAddStoryFormWithExisting = (existingStories) => {
    const story = existingStories[0];
    const cell = gridCells.find(c => c.id === story.gridId);

    if (!cell) return;

    setSelectedGrid({
      ...cell,
      clickCoords: { lat: story.lat, lng: story.lng },
      existingStories: existingStories,
      isExactLocation: true
    });
    setIsAddingStory(true);
    setSelectedStory(null);
  };

  // Effects for map updates
  useEffect(() => {
    if (mapReady && mapInstanceRef.current && gridRectanglesRef.current.length === 0) {
      drawGrid();
    }
  }, [mapReady]);

  useEffect(() => {
    if (mapReady && gridRectanglesRef.current.length > 0) {
      drawGrid();
    }
  }, [stories]);

  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    const storiesChanged = JSON.stringify(prevStoriesRef.current) !== JSON.stringify(stories);

    let filtered = stories;
    if (activeTagFilter) {
      filtered = filtered.filter(s => s.selectedTags && s.selectedTags.includes(activeTagFilter));
    }
    if (activeKeywordFilter) {
      filtered = filtered.filter(s => s.keywords && s.keywords.toLowerCase().includes(activeKeywordFilter.toLowerCase()));
    }

    if (storiesChanged) {
      updateGridColors();
      addMarkersWithClustering(filtered);
      prevStoriesRef.current = stories;
    } else {
      addMarkersWithClustering(filtered);
    }
  }, [stories, activeTagFilter, activeKeywordFilter, mapReady]);

  // Event handlers
  const handleStorySave = (savedStory) => {
    setStories(prev => [...prev, savedStory]);
    setIsAddingStory(false);
    setSelectedGrid(null);
  };

  const handleFormClose = () => {
    setIsAddingStory(false);
    setSelectedGrid(null);
  };

  const handleViewStory = (story) => {
    setSelectedStory(story);
    setIsAddingStory(false);
  };

  const handleStoryUpdate = (updatedStory) => {
    setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
    setSelectedStory(updatedStory);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapPin size={28} />
          Enery Encounters in Brabrand
        </h1>
      </div>

      {/* Filter Bar */}
      <FilterBar
        stories={stories}
        allTags={allTags}
        allKeywords={allKeywords}
        activeTagFilter={activeTagFilter}
        activeKeywordFilter={activeKeywordFilter}
        onTagFilterChange={setActiveTagFilter}
        onKeywordFilterChange={setActiveKeywordFilter}
        onClearFilters={clearFilters}
      />

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={mapRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: '#e5e7eb' }}
        />

        {/* Loading spinner */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{ zIndex: 1000 }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Indlæser kort over Brabrand...</p>
            </div>
          </div>
        )}

        {/* Story Form */}
        {isAddingStory && selectedGrid && (
          <StoryForm
            selectedGrid={selectedGrid}
            onClose={handleFormClose}
            onSave={handleStorySave}
            onViewStory={handleViewStory}
            hideGhostMarkers={hideGhostMarkers}
          />
        )}

        {/* Story Detail View */}
        {selectedStory && !isAddingStory && (
          <StoryDetailView
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
            onTagClick={setActiveTagFilter}
            onKeywordClick={setActiveKeywordFilter}
            openLightbox={openLightbox}
            onUpdate={handleStoryUpdate}
          />
        )}

        {/* Stats Display */}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg" style={{ zIndex: 1000 }}>
          <span className="text-sm font-medium text-gray-700">
            {getFilteredStories().length} / {stories.length} stories
            {(activeTagFilter || activeKeywordFilter) && ' (filtreret)'}
          </span>
        </div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
        onIndexChange={setCurrentImageIndex}
      />
    </div>
  );
};

export default DataStoriesMap;
