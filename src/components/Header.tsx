'use client';

export default function Header() {
  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">
            UserStory<span className="text-blue-600">.ai</span>
          </h1>
        </div>
        <a
          href="https://github.com/ankitnakra/userstory-ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
