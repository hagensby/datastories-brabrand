import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const ImageLightbox = ({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onIndexChange
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X size={40} />
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75"
        disabled={images.length <= 1}
      >
        <ChevronLeft size={40} />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-75"
        disabled={images.length <= 1}
      >
        <ChevronRight size={40} />
      </button>

      {/* Image container */}
      <div
        className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Billede ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(i);
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentIndex
                ? 'bg-white w-8'
                : 'bg-gray-500 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageLightbox;
