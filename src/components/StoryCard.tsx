'use client';

import { useState } from 'react';
import { UserStory } from '@/lib/types';

function storyToMarkdown(story: UserStory): string {
  let md = `## ${story.id}: ${story.title}\n\n`;
  md += `**${story.description}**\n\n`;
  md += `**Epic:** ${story.epic} | **Points:** ${story.storyPoints}\n\n`;
  md += `### Acceptance Criteria\n\n`;

  const cats = [
    { label: 'Functional', items: story.acceptanceCriteria.functional },
    { label: 'Accessibility', items: story.acceptanceCriteria.accessibility },
    { label: 'Performance', items: story.acceptanceCriteria.performance },
    { label: 'Error Handling', items: story.acceptanceCriteria.errorHandling },
  ];

  cats.forEach(({ label, items }) => {
    if (items.length > 0) {
      md += `**${label}:**\n`;
      items.forEach(ac => { md += `- ${ac}\n`; });
      md += `\n`;
    }
  });

  if (story.flags.length > 0) md += `**Flags:** ${story.flags.join(', ')}\n\n`;
  if (story.techNotes) md += `**Tech Notes:** ${story.techNotes}\n`;

  return md;
}

export default function StoryCard({ story }: { story: UserStory }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(storyToMarkdown(story));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer active:bg-blue-50/50"
      onClick={() => setOpen(!open)}
    >
      {/* Summary row */}
      <div className="flex items-center justify-between px-4 py-3.5 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-xs font-mono font-bold text-blue-600 shrink-0">{story.id}</span>
          <span className="text-sm font-medium text-gray-900 truncate">{story.title}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-medium text-gray-500">{story.storyPoints} pts</span>
          <button
            onClick={handleCopy}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg transition-all -mr-1 ${
              copied ? 'bg-green-50 text-green-600' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded */}
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 animate-fadeIn">
          <p className="text-sm text-gray-700 mb-2">{story.description}</p>
          <p className="text-xs text-gray-500 font-medium mb-3">{story.epic}</p>

          {story.flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {story.flags.map((flag, i) => (
                <span key={i} className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium">{flag}</span>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {[
              { label: 'Functional', items: story.acceptanceCriteria.functional, dot: 'bg-blue-500' },
              { label: 'Accessibility', items: story.acceptanceCriteria.accessibility, dot: 'bg-purple-500' },
              { label: 'Performance', items: story.acceptanceCriteria.performance, dot: 'bg-green-500' },
              { label: 'Error Handling', items: story.acceptanceCriteria.errorHandling, dot: 'bg-orange-500' },
            ]
              .filter(c => c.items.length > 0)
              .map(c => (
                <div key={c.label}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className="text-xs font-semibold text-gray-700">{c.label}</span>
                  </div>
                  <ul className="ml-4 space-y-1">
                    {c.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {story.techNotes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600"><span className="font-semibold text-gray-700">Tech note:</span> {story.techNotes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { storyToMarkdown };
