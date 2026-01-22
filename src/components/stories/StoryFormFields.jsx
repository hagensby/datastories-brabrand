import React, { useState } from 'react';
import { availableTags } from '../../config/gridCells';
import ImageUpload from '../media/ImageUpload';
import VideoUpload from '../media/VideoUpload';
import DocumentUpload from '../media/DocumentUpload';

const StoryFormFields = ({
  formData,
  setFormData,
  authData,
  setAuthData,
  showAuth = true,
  showCoordinates = false,
  selectedGrid = null,
  existingFiles = null,
  existingStories = null,
  isExactLocation = false,
  onViewStory = null,
  error = null
}) => {
  const [showHashcode, setShowHashcode] = useState(false);

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.imageFiles.length);
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: [...formData.images, ...previewUrls],
      imageFiles: [...formData.imageFiles, ...files]
    });
  };

  const handleVideosUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.videoFiles.length);
    const videoPreviews = files.map(file => ({
      name: file.name,
      size: file.size,
      data: URL.createObjectURL(file)
    }));
    setFormData({
      ...formData,
      videos: [...formData.videos, ...videoPreviews],
      videoFiles: [...formData.videoFiles, ...files]
    });
  };

  const handleDocumentsUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - formData.documentFiles.length);
    const docPreviews = files.map(file => ({
      name: file.name,
      size: file.size
    }));
    setFormData({
      ...formData,
      documents: [...formData.documents, ...docPreviews],
      documentFiles: [...formData.documentFiles, ...files]
    });
  };

  const toggleTag = (tag) => {
    const current = formData.selectedTags;
    if (current.includes(tag)) {
      setFormData({ ...formData, selectedTags: current.filter(t => t !== tag) });
    } else if (formData.selectedTags.length < 3) {
      setFormData({ ...formData, selectedTags: [...formData.selectedTags, tag] });
    }
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, idx) => idx !== index),
      imageFiles: formData.imageFiles.filter((_, idx) => idx !== index)
    });
  };

  const removeVideo = (index) => {
    setFormData({
      ...formData,
      videos: formData.videos.filter((_, idx) => idx !== index),
      videoFiles: formData.videoFiles.filter((_, idx) => idx !== index)
    });
  };

  const removeDocument = (index) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, idx) => idx !== index),
      documentFiles: formData.documentFiles.filter((_, idx) => idx !== index)
    });
  };

  const totalFiles = formData.imageFiles.length + formData.videoFiles.length + formData.documentFiles.length;

  return (
    <div className="space-y-4">
      {/* Coordinates info */}
      {showCoordinates && selectedGrid && (
        <div className="bg-primary-50 p-3 rounded-lg text-sm space-y-1">
          <div><strong className="text-primary-900">Grid ID:</strong> <span className="text-primary-700">{selectedGrid.id}</span></div>
          <div><strong className="text-primary-900">Latitude:</strong> <span className="text-primary-700">{selectedGrid.clickCoords.lat.toFixed(6)}</span></div>
          <div><strong className="text-primary-900">Longitude:</strong> <span className="text-primary-700">{selectedGrid.clickCoords.lng.toFixed(6)}</span></div>
        </div>
      )}

      {/* Existing stories info */}
      {existingStories && existingStories.length > 0 && (
        <div className={`border p-3 rounded-lg text-sm ${
          isExactLocation
            ? 'bg-orange-50 border-orange-300'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <strong className={isExactLocation ? 'text-orange-900' : 'text-amber-900'}>
              {isExactLocation
                ? `Dette sted har allerede ${existingStories.length} ${existingStories.length === 1 ? 'story' : 'stories'}`
                : `Dette grid har allerede ${existingStories.length} ${existingStories.length === 1 ? 'story' : 'stories'}`
              }
            </strong>
          </div>
          <div className="space-y-1">
            {existingStories.map((story, i) => (
              <div key={i} className={`text-xs flex items-center gap-2 ${
                isExactLocation ? 'text-orange-700' : 'text-amber-700'
              }`}>
                <span>-</span>
                {onViewStory ? (
                  <button
                    onClick={() => onViewStory(story)}
                    className="hover:underline text-left font-medium"
                  >
                    {story.title}
                  </button>
                ) : (
                  <span className="font-medium">{story.title}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Data Story Titel *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Indtast titel..."
          required
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Encounter *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="4"
          placeholder="Beskriv din energy encounter..."
          required
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Vælg tags (mindst 1, maks 3) *</label>
        <div className="flex gap-2 flex-wrap">
          {availableTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                formData.selectedTags.includes(tag)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">{formData.selectedTags.length}/3 tags valgt (minimum 1)</p>
      </div>

      {/* Existing files info (for edit mode) */}
      {existingFiles && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 space-y-1">
          <p className="font-medium">Eksisterende filer:</p>
          <p>Billede(r): {existingFiles.images || 0}</p>
          <p>Video(er): {existingFiles.videos || 0}</p>
          <p>Dokument(er): {existingFiles.documents || 0}</p>
        </div>
      )}

      {/* File uploads section */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          {existingFiles ? 'Tilføj nye filer' : 'Vedhæft filer (valgfrit)'}
        </h3>

        {/* Images */}
        <div className="mb-4">
          <ImageUpload
            images={formData.images}
            onUpload={handleImagesUpload}
            onRemove={removeImage}
          />
        </div>

        {/* Videos */}
        <div className="mb-4">
          <VideoUpload
            videos={formData.videos}
            onUpload={handleVideosUpload}
            onRemove={removeVideo}
          />
        </div>

        {/* Documents */}
        <div>
          <DocumentUpload
            documents={formData.documents}
            onUpload={handleDocumentsUpload}
            onRemove={removeDocument}
          />
        </div>

        {totalFiles > 0 && (
          <p className="text-xs text-primary-600 mt-3 font-medium">
            {totalFiles} fil(er) klar til upload
          </p>
        )}
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (adskilt med ;)</label>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="F.eks. natur;parkering;sikkerhed"
        />
      </div>

         {/* Auth section */}
      {showAuth && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-sm font-semibold">Bekræft din identitet</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gruppe nummer *</label>
            <input
              type="text"
              value={authData.groupNumber}
              onChange={(e) => setAuthData({ ...authData, groupNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="F.eks. Gruppe 1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hashkode *</label>
            <div className="relative">
              <input
                type={showHashcode ? "text" : "password"}
                value={authData.hashcode}
                onChange={(e) => setAuthData({ ...authData, hashcode: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Indtast hashkode"
                required
              />
              <button
                type="button"
                onClick={() => setShowHashcode(!showHashcode)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                aria-label={showHashcode ? "Skjul hashkode" : "Vis hashkode"}
              >
                {showHashcode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryFormFields;
