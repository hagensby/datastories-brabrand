import React from 'react';

const TextFileUpload = ({ textFiles, onUpload, onRemove }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload tekstfiler (maks 5)</label>
      <input
        type="file"
        accept=".txt,.md,.doc,.docx"
        multiple
        onChange={onUpload}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      {textFiles.length > 0 && (
        <div className="mt-2 space-y-1">
          {textFiles.map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-500 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">{textFiles.length}/5 filer</p>
    </div>
  );
};

export default TextFileUpload;
