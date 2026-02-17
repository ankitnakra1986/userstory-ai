'use client';

import { useState, useCallback } from 'react';
import { GenerationResponse, UserStory } from '@/lib/types';
import StoryCard, { storyToMarkdown } from './StoryCard';

export default function StoryOutput({ data, isDemo }: { data: GenerationResponse; isDemo?: boolean }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [expandKey, setExpandKey] = useState(0);
  const [allExpanded, setAllExpanded] = useState(false);
  const [editedStories, setEditedStories] = useState<UserStory[]>(data.stories);

  const handleStoryUpdate = useCallback((index: number, updated: UserStory) => {
    setEditedStories(prev => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const handleCopyAll = async () => {
    const all = editedStories.map(s => storyToMarkdown(s)).join('\n---\n\n');
    await navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const toggleAll = useCallback(() => {
    setAllExpanded(prev => !prev);
    setExpandKey(prev => prev + 1);
  }, []);

  return (
    <div className="space-y-3">
      {/* Summary + copy all */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          <strong>{data.summary.totalStories}</strong> stories · <strong>{data.summary.totalPoints}</strong> pts
          {isDemo && <span className="text-blue-600 font-medium ml-2">demo</span>}
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAll}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
          <button
            onClick={handleCopyAll}
            className={`text-sm px-5 py-2.5 rounded-full font-semibold transition-all ${
              copiedAll
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
            }`}
          >
            {copiedAll ? 'Copied to clipboard!' : 'Copy all to JIRA'}
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="space-y-2">
        {editedStories.map((story, i) => (
          <StoryCard
            key={`${story.id}-${expandKey}`}
            story={story}
            defaultOpen={allExpanded || i === 0}
            onUpdate={isDemo ? undefined : (updated) => handleStoryUpdate(i, updated)}
          />
        ))}
      </div>
    </div>
  );
}
