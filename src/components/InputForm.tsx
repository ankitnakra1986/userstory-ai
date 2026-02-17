'use client';

import { useState, useEffect } from 'react';
import { GenerationConfig } from '@/lib/types';

interface InputFormProps {
  onGenerate: (prd: string, config: GenerationConfig, apiKey?: string) => void;
  isLoading: boolean;
  needsKey: boolean;
}

export default function InputForm({ onGenerate, isLoading, needsKey }: InputFormProps) {
  const [prd, setPrd] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({
    detailLevel: 'detailed',
    pointScale: 'fibonacci',
    crossCutting: {
      accessibility: true,
      security: true,
      performance: true,
      errorHandling: true,
      compliance: false,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem('userstory-api-key');
    if (saved) setApiKey(saved);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prd.trim() || prd.trim().length < 50) return;
    onGenerate(prd, config, apiKey.trim() || undefined);
  };

  const saveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('userstory-api-key', apiKey);
    }
  };

  const charCount = prd.trim().length;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prd}
          onChange={(e) => setPrd(e.target.value)}
          placeholder="Paste your PRD, feature description, or meeting notes here..."
          rows={6}
          maxLength={15000}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-[15px] text-gray-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all resize-y leading-relaxed placeholder:text-gray-400"
        />

        <div className="flex items-center justify-between mt-1.5">
          {charCount > 0 && charCount < 50 ? (
            <p className="text-xs text-amber-600 font-medium">{50 - charCount} more characters needed</p>
          ) : (
            <span />
          )}
          {charCount > 0 && (
            <p className={`text-xs ${charCount > 14000 ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
              {charCount.toLocaleString()} / 15,000
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showSettings ? 'Hide settings' : 'Settings'}
          </button>
          <button
            type="submit"
            disabled={charCount < 50 || isLoading}
            className={`px-7 py-3 rounded-full text-sm font-semibold transition-all ${
              charCount >= 50 && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate Stories'}
          </button>
        </div>
      </form>

      {/* Key prompt */}
      {needsKey && (
        <div className="p-4 bg-blue-50 rounded-2xl space-y-3 animate-fadeIn">
          <p className="text-sm text-gray-800 font-medium">Add your AI key to keep generating</p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
            />
            <button
              onClick={saveKey}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Free to create.{' '}
            <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
              Get your key here
            </a>
          </p>
        </div>
      )}

      {/* Settings */}
      {showSettings && (
        <div className="p-4 bg-gray-50 rounded-2xl space-y-4 animate-fadeIn">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Detail level</label>
              <select
                value={config.detailLevel}
                onChange={(e) => setConfig({ ...config, detailLevel: e.target.value as 'light' | 'detailed' })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none"
              >
                <option value="detailed">Detailed</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">Story points</label>
              <select
                value={config.pointScale}
                onChange={(e) => setConfig({ ...config, pointScale: e.target.value as 'fibonacci' | 'tshirt' | 'none' })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none"
              >
                <option value="fibonacci">Fibonacci</option>
                <option value="tshirt">T-shirt</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-2">Include in stories</label>
            <div className="flex flex-wrap gap-2">
              {[
              { key: 'accessibility', label: 'Accessibility' },
              { key: 'security', label: 'Security' },
              { key: 'performance', label: 'Performance' },
              { key: 'errorHandling', label: 'Error Handling' },
              { key: 'compliance', label: 'Compliance' },
              ].map(({ key, label }) => {
                const isOn = config.crossCutting[key as keyof typeof config.crossCutting];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setConfig({ ...config, crossCutting: { ...config.crossCutting, [key]: !isOn } })}
                    className={`text-sm px-4 py-1.5 rounded-full transition-all font-medium ${isOn ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* API Key */}
          <div className="pt-3 border-t border-gray-200">
            <label className="block text-sm text-gray-700 font-medium mb-1">Claude API key</label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-... (optional — 3 free tries included)"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
              />
              <button
                type="button"
                onClick={saveKey}
                disabled={!apiKey.trim()}
                className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  apiKey.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Save
              </button>
            </div>
            {apiKey.trim() && (
              <p className="text-xs text-green-600 mt-1 font-medium">Key saved locally — never sent to our servers</p>
            )}
            {!apiKey.trim() && (
              <p className="text-xs text-gray-400 mt-1">
                Free to create at{' '}
                <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  console.anthropic.com
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
