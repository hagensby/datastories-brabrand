import React from 'react';

const MAX_VIDEO_SIZE_MB = 50;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

const VideoUpload = ({ videos, onUpload, onRemove }) => {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > MAX_VIDEO_SIZE_BYTES);
    if (oversizedFiles.length > 0) {
      const names = oversizedFiles.map(f => f.name).join(', ');
      alert(`Følgende filer er over ${MAX_VIDEO_SIZE_MB} MB og kan ikke uploades:\n${names}`);

      // Filter out oversized files
      const validFiles = files.filter(file => file.size <= MAX_VIDEO_SIZE_BYTES);
      if (validFiles.length === 0) {
        e.target.value = '';
        return;
      }

      // Create a new event-like object with only valid files
      const modifiedEvent = {
        target: {
          files: validFiles
        }
      };
      onUpload(modifiedEvent);
    } else {
      onUpload(e);
    }

    e.target.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload videoer (maks 5, hver maks {MAX_VIDEO_SIZE_MB} MB)
      </label>
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleUpload}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      {videos.length > 0 && (
        <div className="mt-2 space-y-2">
          {videos.map((video, i) => (
            <div key={i} className="relative bg-gray-100 p-2 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <span className="text-xs truncate block">{video.name}</span>
                  {video.size && (
                    <span className="text-xs text-gray-400">{formatFileSize(video.size)}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ml-2 flex-shrink-0"
                >
                  ×
                </button>
              </div>
              <video src={video.data} className="w-full mt-2 rounded" controls style={{ maxHeight: '150px' }} />
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">{videos.length}/5 videoer</p>
    </div>
  );
};

export default VideoUpload;
