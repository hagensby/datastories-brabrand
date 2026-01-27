import React, { useState } from 'react';
import { X, Tag, Hash, Image, ZoomIn, BookOpen, Edit3, Save, XCircle, FileText, Video, FileJson, File, Download } from 'lucide-react';
import { API_URL } from '../../config/api';
import StoryFormFields from './StoryFormFields';

const StoryDetailView = ({
  story,
  onClose,
  onTagClick,
  onKeywordClick,
  openLightbox,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [authData, setAuthData] = useState({ groupNumber: '', hashcode: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!story) return null;

  const getDocumentIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'json' || ext === 'geojson') {
      return <FileJson size={16} className="text-yellow-600" />;
    }
    if (ext === 'pdf') {
      return <File size={16} className="text-red-600" />;
    }
    return <FileText size={16} className="text-blue-600" />;
  };

  const startEditing = () => {
    setFormData({
      title: story.title || '',
      content: story.content || '',
      keywords: story.keywords || '',
      selectedTags: story.selectedTags || [],
      images: [],
      videos: [],
      documents: [],
      imageFiles: [],
      videoFiles: [],
      documentFiles: []
    });
    setAuthData({ groupNumber: '', hashcode: '' });
    setError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData(null);
    setAuthData({ groupNumber: '', hashcode: '' });
    setError(null);
  };

  const handleSave = async () => {
    // Validation
    if (!authData.groupNumber) {
      setError('Indtast gruppe nummer for at gemme ændringer');
      return;
    }
    if (!authData.hashcode) {
      setError('Indtast hashkode for at gemme ændringer');
      return;
    }
    if (!formData.title) {
      setError('Titel må ikke være tom');
      return;
    }
    if (!formData.content) {
      setError('Indhold må ikke være tomt');
      return;
    }
    if (formData.selectedTags.length === 0) {
      setError('Vælg mindst 1 tag');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Build FormData for combined upload + update
      const submitFormData = new FormData();

      // Add story data
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('keywords', formData.keywords);
      submitFormData.append('selectedTags', JSON.stringify(formData.selectedTags));
      submitFormData.append('groupNumber', authData.groupNumber);
      submitFormData.append('hashcode', authData.hashcode);

      // Include existing file paths
      submitFormData.append('existingImages', JSON.stringify(story.images || []));
      submitFormData.append('existingVideos', JSON.stringify(story.videos || []));
      submitFormData.append('existingTextFiles', JSON.stringify(story.textFiles || []));

      // Add new files
      formData.imageFiles.forEach(file => {
        submitFormData.append('images', file);
      });

      formData.videoFiles.forEach(file => {
        submitFormData.append('videos', file);
      });

      formData.documentFiles.forEach(file => {
        submitFormData.append('textfiles', file);
      });

      console.log('Updating story with files...');

      const response = await fetch(`${API_URL}/api/stories/${story.id}/upload`, {
        method: 'PUT',
        body: submitFormData
      });

      if (response.ok) {
        const savedStory = await response.json();
        console.log('Story updated successfully!', savedStory);

        if (savedStory.warning) {
          alert(savedStory.warning);
        }

        if (onUpdate) {
          onUpdate(savedStory);
        }

        cancelEditing();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Ukendt fejl' }));
        console.error('Error updating story:', errorData);
        setError(errorData.error || 'Kunne ikke gemme ændringer. Tjek gruppe nummer og hashkode.');
      }
    } catch (err) {
      console.error('Error updating story:', err);
      setError(err.message || 'Kunne ikke forbinde til serveren. Prøv igen senere.');
    } finally {
      setSaving(false);
    }
  };

  // Edit Mode
  if (isEditing && formData) {
    const existingFiles = {
      images: story.images?.length || 0,
      videos: story.videos?.length || 0,
      documents: story.textFiles?.length || 0
    };

    return (
      <div className="absolute top-4 right-4 bottom-4 w-96 bg-white rounded-lg shadow-2xl flex flex-col" style={{ zIndex: 1000 }}>
        <div className="p-6 border-b flex-shrink-0 bg-amber-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Edit3 size={20} className="text-amber-600" />
              <h2 className="text-xl font-bold text-gray-800">Rediger Story</h2>
            </div>
            <button
              onClick={cancelEditing}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <StoryFormFields
            formData={formData}
            setFormData={setFormData}
            authData={authData}
            setAuthData={setAuthData}
            showAuth={true}
            showCoordinates={false}
            existingFiles={existingFiles}
            error={error}
          />
        </div>

        {/* Action buttons */}
        <div className="p-6 border-t flex-shrink-0 space-y-2">
          <button
            onClick={handleSave}
            disabled={saving || !authData.groupNumber || !authData.hashcode}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {saving ? 'Gemmer...' : 'Gem ændringer'}
          </button>
          <button
            onClick={cancelEditing}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 flex items-center justify-center gap-2"
          >
            <XCircle size={20} />
            Annuller
          </button>
        </div>
      </div>
    );
  }

  // View Mode
  return (
    <div className="absolute top-4 right-4 bottom-4 w-96 bg-white rounded-lg shadow-2xl flex flex-col" style={{ zIndex: 1000 }}>
      <div className="p-6 border-b flex-shrink-0 bg-primary-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{story.title}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={startEditing}
              className="text-white hover:text-primary-700 p-1 rounded hover:bg-primary-50 transition-colors"
              title="Rediger story"
            >
              <Edit3 size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {/* Metadata badges */}
           <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-2"></div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <p>Data story reated by   {story.groupNumber && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700">
                {story.groupNumber}
              </span>
            )} in <span className="px-2 py-1 bg-primary-100 text-primary-700  text-xs font-medium">
              {story.gridId}
            </span> as a   
            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium">
              {story.type}
            </span> data story type on the 
            <span className="bg-primary-100 text-primary-700"> {new Date(story.timestamp).toLocaleDateString('da-DK')} at {new Date(story.timestamp).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            </p>
      
          </div> 
 </div>
          {/* Story Content */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 rounded-xl border border-amber-200/50 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-amber-100 rounded-lg">
                <BookOpen size={16} className="text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Energy Encounter</span>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-400 rounded-full"></div>
              <p className="pl-4 text-gray-700 leading-relaxed italic">
                "{story.content}"
              </p>
            </div>
          </div>

          {/* Tags Display */}
          {story.selectedTags && story.selectedTags.length > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                <Tag size={14} className="text-primary-600" />
                <span className="text-xs font-semibold text-primary-900 uppercase tracking-wide">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.selectedTags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all cursor-pointer"
                    onClick={() => onTagClick(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keywords Display */}
          {story.keywords && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                <Hash size={14} className="text-purple-600" />
                <span className="text-xs font-semibold text-purple-900 uppercase tracking-wide">Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {story.keywords.split(';').map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-white text-purple-700 rounded-md text-xs font-medium border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
                    onClick={() => onKeywordClick(keyword.trim())}
                  >
                    #{keyword.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Image Gallery with Lightbox */}
          {story.images && story.images.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Billeder ({story.images.length})</span>
                <Image size={16} className="text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {story.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all bg-gray-100"
                    onClick={() => openLightbox(story.images.map(im => `${API_URL}${im}`), i)}
                  >
                    <img
                      src={`${API_URL}${img}`}
                      alt={`Billede ${i + 1}`}
                      className="w-full h-32 object-cover transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.error('Image failed to load:', `${API_URL}${img}`);
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center pointer-events-none">
                      <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {story.videos && story.videos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Video size={16} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Videoer ({story.videos.length})</span>
              </div>
              {story.videos.map((video, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">{video.name}</p>
                  <video
                    src={video.path ? `${API_URL}${video.path}` : (video.url ? `${API_URL}${video.url}` : video.data)}
                    className="w-full rounded"
                    controls
                  />
                </div>
              ))}
            </div>
          )}

          {/* Documents / Text Files */}
          {story.textFiles && story.textFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Dokumenter ({story.textFiles.length})</span>
              </div>
              {story.textFiles.map((doc, i) => (
                <a
                  key={i}
                  href={`${API_URL}${doc.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.name)}
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </div>
                  <Download size={16} className="text-gray-400" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetailView;
