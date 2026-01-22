import { useState, useCallback } from 'react';

export const useFilters = (stories) => {
  const [activeTagFilter, setActiveTagFilter] = useState(null);
  const [activeKeywordFilter, setActiveKeywordFilter] = useState(null);

  // Filter stories based on active filters
  const getFilteredStories = useCallback(() => {
    let filtered = stories;

    if (activeTagFilter) {
      filtered = filtered.filter(s =>
        s.selectedTags && s.selectedTags.includes(activeTagFilter)
      );
    }

    if (activeKeywordFilter) {
      filtered = filtered.filter(s =>
        s.keywords && s.keywords.toLowerCase().includes(activeKeywordFilter.toLowerCase())
      );
    }

    return filtered;
  }, [stories, activeTagFilter, activeKeywordFilter]);

  const clearFilters = useCallback(() => {
    setActiveTagFilter(null);
    setActiveKeywordFilter(null);
  }, []);

  const toggleTagFilter = useCallback((tag) => {
    setActiveTagFilter(prev => prev === tag ? null : tag);
  }, []);

  const toggleKeywordFilter = useCallback((keyword) => {
    setActiveKeywordFilter(prev => prev === keyword ? null : keyword);
  }, []);

  return {
    activeTagFilter,
    activeKeywordFilter,
    setActiveTagFilter,
    setActiveKeywordFilter,
    getFilteredStories,
    clearFilters,
    toggleTagFilter,
    toggleKeywordFilter
  };
};
