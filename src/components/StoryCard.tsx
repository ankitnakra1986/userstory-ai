'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { UserStory, AcceptanceCriteria } from '@/lib/types';

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

function EditableText({
  value,
  onSave,
  className,
  tag: Tag = 'span',
}: {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  tag?: 'span' | 'p' | 'li';
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setDraft(value);
    }
    setEditing(false);
  }, [draft, value, onSave]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
    if (e.key === 'Escape') {
      setDraft(value);
      setEditing(false);
    }
  };

  if (editing) {
    const isLong = value.length > 80;
    return isLong ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        rows={2}
        className={`w-full px-2 py-1 border border-blue-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none resize-y ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={`w-full px-2 py-0.5 border border-blue-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none ${className || ''}`}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <Tag
      className={`${className || ''} cursor-text hover:bg-blue-50 hover:ring-1 hover:ring-blue-200 rounded px-0.5 -mx-0.5 transition-all`}
      onClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
      title="Click to edit"
    >
      {value}
    </Tag>
  );
}

interface StoryCardProps {
  story: UserStory;
  defaultOpen?: boolean;
  onUpdate?: (updated: UserStory) => void;
}

export default function StoryCard({ story, defaultOpen = false, onUpdate }: StoryCardProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(defaultOpen);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(storyToMarkdown(story));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateField = useCallback(<K extends keyof UserStory>(field: K, value: UserStory[K]) => {
    if (!onUpdate) return;
    onUpdate({ ...story, [field]: value });
  }, [story, onUpdate]);

  const updateAC = useCallback((
    category: keyof AcceptanceCriteria,
    index: number,
    newValue: string
  ) => {
    if (!onUpdate) return;
    const updatedAC = { ...story.acceptanceCriteria };
    const items = [...updatedAC[category]];
    items[index] = newValue;
    updatedAC[category] = items;
    onUpdate({ ...story, acceptanceCriteria: updatedAC });
  }, [story, onUpdate]);

  const editable = !!onUpdate;

  return (
    <div
      className="border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer active:bg-blue-50/50"
      onClick={() => setOpen(!open)}
    >
      {/* Summary row */}
      <div className="flex items-center justify-between px-4 py-3.5 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <span className="text-xs font-mono font-bold text-blue-600 shrink-0">{story.id}</span>
          {editable && open ? (
            <EditableText
              value={story.title}
              onSave={(v) => updateField('title', v)}
              className="text-sm font-medium text-gray-900 flex-1"
            />
          ) : (
            <span className="text-sm font-medium text-gray-900 truncate">{story.title}</span>
          )}
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
          {editable ? (
            <EditableText
              value={story.description}
              onSave={(v) => updateField('description', v)}
              className="text-sm text-gray-700 mb-2"
              tag="p"
            />
          ) : (
            <p className="text-sm text-gray-700 mb-2">{story.description}</p>
          )}
          <p className="text-xs text-gray-500 font-medium mb-3">{story.epic}</p>

          {story.flags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {story.flags.map((flag, i) => (
                <span key={i} className="text-xs text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium">{flag}</span>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {([
              { label: 'Functional', category: 'functional' as const, dot: 'bg-blue-500' },
              { label: 'Accessibility', category: 'accessibility' as const, dot: 'bg-purple-500' },
              { label: 'Performance', category: 'performance' as const, dot: 'bg-green-500' },
              { label: 'Error Handling', category: 'errorHandling' as const, dot: 'bg-orange-500' },
            ])
              .filter(c => story.acceptanceCriteria[c.category].length > 0)
              .map(c => (
                <div key={c.label}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className="text-xs font-semibold text-gray-700">{c.label}</span>
                  </div>
                  <ul className="ml-4 space-y-1">
                    {story.acceptanceCriteria[c.category].map((item, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed">
                        {editable ? (
                          <EditableText
                            value={item}
                            onSave={(v) => updateAC(c.category, i, v)}
                            className="text-sm text-gray-700"
                          />
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {story.techNotes && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-700">Tech note: </span>
                {editable ? (
                  <EditableText
                    value={story.techNotes}
                    onSave={(v) => updateField('techNotes', v)}
                    className="text-sm text-gray-600"
                  />
                ) : (
                  story.techNotes
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { storyToMarkdown };
