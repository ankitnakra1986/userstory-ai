'use client';

import { useState } from 'react';
import { GenerationResponse } from '@/lib/types';
import StoryCard, { storyToMarkdown } from './StoryCard';

export default function StoryOutput({ data, isDemo }: { data: GenerationResponse; isDemo?: boolean }) {
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = async () => {
    const all = data.stories.map(s => storyToMarkdown(s)).join('\n---\n\n');
    await navigator.clipboard.writeText(all);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* Summary + copy all */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          <strong>{data.summary.totalStories}</strong> stories · <strong>{data.summary.totalPoints}</strong> pts
          {isDemo && <span className="text-blue-600 font-medium ml-2">demo</span>}
        </span>
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

      {/* Stories */}
      <div className="space-y-2">
        {data.stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
