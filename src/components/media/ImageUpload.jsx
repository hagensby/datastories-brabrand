import React from 'react';

const ImageUpload = ({ images, onUpload, onRemove }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload billeder (maks 5)</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      {images.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {images.map((img, i) => (
            <div key={i} className="relative">
              <img src={img} alt={`Upload ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">{images.length}/5 billeder</p>
    </div>
  );
};

export default ImageUpload;
