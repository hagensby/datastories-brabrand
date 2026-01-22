import React from 'react';
import { FileText, FileJson, File } from 'lucide-react';

const ACCEPTED_TYPES = '.pdf,.json,.geojson,.txt,.docx,.doc,.md,.csv';

const DocumentUpload = ({ documents, onUpload, onRemove }) => {
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'json' || ext === 'geojson') {
      return <FileJson size={16} className="text-yellow-600" />;
    }
    if (ext === 'pdf') {
      return <File size={16} className="text-red-600" />;
    }
    return <FileText size={16} className="text-blue-600" />;
  };

  const getFileTypeLabel = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    const labels = {
      'pdf': 'PDF',
      'json': 'JSON',
      'geojson': 'GeoJSON',
      'txt': 'Tekst',
      'docx': 'Word',
      'doc': 'Word'
    };
    return labels[ext] || ext.toUpperCase();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload dokumenter (maks 5)
      </label>
      <p className="text-xs text-gray-500 mb-2">
        Understøttede formater: PDF, JSON, GeoJSON, TXT, DOCX, MD, CSV
      </p>
      <input
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        onChange={onUpload}
        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
      />
      {documents.length > 0 && (
        <div className="mt-2 space-y-1">
          {documents.map((doc, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {getFileIcon(doc.name)}
                <span className="text-xs truncate">{doc.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  ({getFileTypeLabel(doc.name)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-500 ml-2 flex-shrink-0 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">{documents.length}/5 dokumenter</p>
    </div>
  );
};

export default DocumentUpload;
