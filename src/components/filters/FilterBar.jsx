import React from 'react';
import { Tag, Hash } from 'lucide-react';

const FilterBar = ({
  stories,
  allTags,
  allKeywords,
  activeTagFilter,
  activeKeywordFilter,
  onTagFilterChange,
  onKeywordFilterChange,
  onClearFilters
}) => {
  if (allTags.length === 0 && allKeywords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b shadow-sm p-3 overflow-x-auto">
      <div className="flex items-center gap-4 min-w-max">
        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tags:</span>
            <button
              onClick={() => onTagFilterChange(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                !activeTagFilter
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Alle
            </button>
            {allTags.map(tag => {
              const count = stories.filter(s => s.selectedTags && s.selectedTags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => onTagFilterChange(activeTagFilter === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    activeTagFilter === tag
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md transform scale-105'
                      : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
                  }`}
                >
                  {tag} <span className="opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Keyword Filters */}
        {allKeywords.length > 0 && (
          <div className="flex items-center gap-2 ml-4 pl-4 border-l">
            <Hash size={18} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Keywords:</span>
            {allKeywords.slice(0, 8).map(keyword => {
              const count = stories.filter(s =>
                s.keywords && s.keywords.toLowerCase().includes(keyword.toLowerCase())
              ).length;
              return (
                <button
                  key={keyword}
                  onClick={() => onKeywordFilterChange(activeKeywordFilter === keyword ? null : keyword)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeKeywordFilter === keyword
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                  }`}
                >
                  #{keyword} <span className="opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Clear filters */}
        {(activeTagFilter || activeKeywordFilter) && (
          <button
            onClick={onClearFilters}
            className="ml-auto px-4 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium hover:bg-primary-100 transition-colors"
          >
            Ryd filtre
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
