import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { API_URL } from '../../config/api';
import StoryFormFields from './StoryFormFields';

const initialFormData = {
  title: '',
  content: '',
  images: [],
  videos: [],
  documents: [],
  imageFiles: [],
  videoFiles: [],
  documentFiles: [],
  keywords: '',
  selectedTags: []
};

const StoryForm = ({
  selectedGrid,
  onClose,
  onSave,
  onViewStory,
  hideGhostMarkers
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [authData, setAuthData] = useState({ groupNumber: '', hashcode: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    hideGhostMarkers();
    setFormData(initialFormData);
    setAuthData({ groupNumber: '', hashcode: '' });
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation
    if (!authData.groupNumber) {
      setError('Udfyld gruppe nummer!');
      return;
    }

    if (!authData.hashcode) {
      setError('Udfyld hashkode!');
      return;
    }

    if (!formData.title) {
      setError('Udfyld titel!');
      return;
    }

    if (!formData.content) {
      setError('Udfyld indhold!');
      return;
    }

    if (formData.selectedTags.length === 0) {
      setError('Vælg mindst 1 tag!');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Determine story type based on files
      let storyType = 'text';
      if (formData.imageFiles.length > 0) storyType = 'image';
      if (formData.videoFiles.length > 0) storyType = 'video';
      if (formData.imageFiles.length > 0 && formData.videoFiles.length > 0) storyType = 'mixed';

      // Build FormData with all story data and files in one request
      const submitFormData = new FormData();

      // Add story data
      submitFormData.append('gridId', selectedGrid.id);
      submitFormData.append('lat', selectedGrid.clickCoords.lat);
      submitFormData.append('lng', selectedGrid.clickCoords.lng);
      submitFormData.append('title', formData.title);
      submitFormData.append('content', formData.content);
      submitFormData.append('type', storyType);
      submitFormData.append('groupNumber', authData.groupNumber);
      submitFormData.append('hashcode', authData.hashcode);
      submitFormData.append('keywords', formData.keywords);
      submitFormData.append('selectedTags', JSON.stringify(formData.selectedTags));

      // Add files
      formData.imageFiles.forEach(file => {
        submitFormData.append('images', file);
      });

      formData.videoFiles.forEach(file => {
        submitFormData.append('videos', file);
      });

      formData.documentFiles.forEach(file => {
        submitFormData.append('documents', file);
      });

      console.log('Creating story with files...');

      const response = await fetch(`${API_URL}/api/stories/upload`, {
        method: 'POST',
        body: submitFormData
      });

      if (response.ok) {
        const savedStory = await response.json();
        console.log('Story saved successfully!', savedStory);

        if (savedStory.warning) {
          alert(savedStory.warning);
        }

        hideGhostMarkers();
        onSave(savedStory);
        setFormData(initialFormData);
        setAuthData({ groupNumber: '', hashcode: '' });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Ukendt fejl' }));
        console.error('Error saving story:', errorData);
        setError(errorData.error || 'Kunne ikke gemme story');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Kunne ikke forbinde til serveren');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="absolute top-4 right-4 bottom-4 w-96 bg-white rounded-lg shadow-2xl flex flex-col" style={{ zIndex: 1000 }}>
      <div className="p-6 border-b flex-shrink-0 bg-primary-700">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Ny Data Story</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-700"
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
          showCoordinates={true}
          selectedGrid={selectedGrid}
          existingStories={selectedGrid.existingStories}
          isExactLocation={selectedGrid.isExactLocation}
          onViewStory={(story) => {
            hideGhostMarkers();
            onViewStory(story);
          }}
          error={error}
        />
      </div>

      {/* Submit button */}
      <div className="p-6 border-t flex-shrink-0">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || !authData.groupNumber || !authData.hashcode || !formData.title || !formData.content || formData.selectedTags.length === 0}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {uploading ? 'Gemmer...' : 'Gem Story'}
        </button>
      </div>
    </div>
  );
};

export default StoryForm;
