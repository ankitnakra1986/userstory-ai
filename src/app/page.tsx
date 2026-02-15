'use client';

import { useState, useRef, useEffect } from 'react';
import InputForm from '@/components/InputForm';
import StoryOutput from '@/components/StoryOutput';
import { GenerationConfig, GenerationResponse } from '@/lib/types';
import { DEMO_OUTPUT } from '@/data/demo';

const LOADING_STEPS = [
  { text: 'Reading your requirements...', delay: 0 },
  { text: 'Identifying features and epics...', delay: 3000 },
  { text: 'Applying INVEST framework...', delay: 7000 },
  { text: 'Adding acceptance criteria...', delay: 11000 },
  { text: 'Checking cross-cutting concerns...', delay: 16000 },
  { text: 'Almost there — finalizing stories...', delay: 22000 },
];

function LoadingSteps() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers = LOADING_STEPS.map((step, i) =>
      setTimeout(() => setCurrentStep(i), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mt-8 space-y-3">
      {LOADING_STEPS.map((step, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 transition-all duration-500 ${
            i <= currentStep ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
          }`}
        >
          {i < currentStep ? (
            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : i === currentStep ? (
            <div className="w-5 h-5 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin shrink-0" />
          ) : null}
          <span className={`text-sm ${i < currentStep ? 'text-gray-400' : 'text-gray-700 font-medium'}`}>
            {step.text}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [needsKey, setNeedsKey] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const handleGenerate = async (prd: string, config: GenerationConfig, apiKey?: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setShowDemo(false);
    setNeedsKey(false);
    setGenerationTime(null);

    const startTime = Date.now();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prd, config, apiKey: apiKey || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.needsKey) setNeedsKey(true);
        setError(data.error || 'Something went wrong.');
        return;
      }

      setGenerationTime(Math.round((Date.now() - startTime) / 1000));
      setResult(data as GenerationResponse);
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-5 pt-10 sm:pt-16 pb-16">
        {/* Brand */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            UserStory<span className="text-blue-600">.ai</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">by Ankit Nakra</p>
        </div>

        {/* Tagline */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight mb-3">
          Paste any PRD.<br />Get sprint-ready user stories.
        </h2>
        <p className="text-base text-gray-600 mb-8">
          PMs save hours. Developers get clarity. Nothing falls through the cracks.
        </p>

        {/* Form */}
        {!result && (
          <InputForm
            onGenerate={handleGenerate}
            isLoading={isLoading}
            needsKey={needsKey}
          />
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-xl text-sm text-red-700 font-medium">
            {error}
          </div>
        )}

        {/* Loading — multi-step progress */}
        {isLoading && <LoadingSteps />}

        {/* Output */}
        {result && !isLoading && (
          <div ref={outputRef} className="mt-2 animate-fadeIn">
            {/* Impact banner */}
            {generationTime && (
              <div className="mb-4 p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-green-800 font-semibold">
                  {result.summary.totalStories} stories generated in {generationTime} seconds
                </p>
                <p className="text-sm text-green-700 mt-0.5">
                  Estimated manual effort: 3-4 hours. You just saved an afternoon.
                </p>
              </div>
            )}
            <StoryOutput data={result} />
            <button
              onClick={() => setResult(null)}
              className="mt-6 text-sm text-blue-600 font-medium hover:underline"
            >
              Generate new stories
            </button>
          </div>
        )}

        {/* Demo */}
        {!result && !isLoading && (
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="mt-5 text-sm text-blue-600 font-medium hover:underline"
          >
            {showDemo ? 'Hide example' : 'See example output'}
          </button>
        )}

        {showDemo && !isLoading && !result && (
          <div className="mt-5 animate-fadeIn">
            <StoryOutput data={DEMO_OUTPUT} isDemo />
          </div>
        )}
      </main>

      {/* Privacy notice */}
      <div className="max-w-2xl mx-auto px-5 mt-12">
        <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-2">
          <p className="font-semibold text-gray-700">Privacy and data</p>
          <p>Your text is processed by Claude AI (Anthropic) and is <strong>not stored</strong> on our servers. Anthropic does not train on API data. No logs are kept. Your API key, if provided, stays in your browser only.</p>
          <p className="text-gray-500">Please use your discretion when pasting sensitive or confidential information. This tool is provided as-is, without warranties.</p>
        </div>
      </div>

      <footer className="max-w-2xl mx-auto px-5 py-8 text-sm text-gray-400 flex items-center justify-between">
        <a href="https://linkedin.com/in/ankitnakra" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">LinkedIn</a>
        <span>Free to use</span>
        <span className="text-gray-300">Open source</span>
      </footer>
    </div>
  );
}
