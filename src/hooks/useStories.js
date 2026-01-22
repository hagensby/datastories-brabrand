import { useState, useEffect } from 'react';
import { API_URL } from '../config/api';

export const useStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stories from backend on mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        console.log('Fetching stories from backend...');
        const response = await fetch(`${API_URL}/api/stories`);
        if (response.ok) {
          const data = await response.json();
          console.log('Stories fetched:', data);
          setStories(data);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Add a new story
  const addStory = (story) => {
    setStories(prev => [...prev, story]);
  };

  // Get all unique tags from stories
  const getAllTags = () => {
    const tags = new Set();
    stories.forEach(story => {
      if (story.selectedTags) {
        story.selectedTags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  // Get all unique keywords from stories
  const getAllKeywords = () => {
    const keywords = new Set();
    stories.forEach(story => {
      if (story.keywords) {
        story.keywords.split(';').forEach(kw => keywords.add(kw.trim()));
      }
    });
    return Array.from(keywords).filter(k => k.length > 0);
  };

  return {
    stories,
    setStories,
    loading,
    error,
    addStory,
    getAllTags,
    getAllKeywords
  };
};
