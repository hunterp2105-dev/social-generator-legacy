'use client';

import { useState } from 'react';
import { BookHeart } from 'lucide-react';
import { GeneratorForm } from '@/components/GeneratorForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { TopicSuggestions } from '@/components/TopicSuggestions';
import type { ContentPackage } from '@/types/content.types';

interface Result {
  topic: string;
  pkg: ContentPackage;
}

export default function HomePage() {
  const [result, setResult] = useState<Result | null>(null);
  const [presetTopic, setPresetTopic] = useState('');

  function handleGenerate(pkg: ContentPackage, topic: string) {
    setResult({ pkg, topic });
    setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #fef9f5 60%, #fdf5f0 100%)' }}>

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-amber-100/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 h-13 flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookHeart className="h-4 w-4 text-amber-600" />
            </div>
            <span className="font-bold text-stone-800 text-sm">Life &amp; Legacy</span>
            <span className="text-stone-300 text-sm">·</span>
            <span className="text-stone-400 text-xs">Content Studio</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">

        {/* Hero + Generator — always visible */}
        <div className="space-y-5">
          {!result && (
            <div className="text-center space-y-2 pt-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
                Ready-to-Post Package Generator
              </h1>
              <p className="text-stone-500 text-sm max-w-sm mx-auto">
                Type a topic, then choose your format — a warm voiceover script or text overlay quotes.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-4 sm:p-5">
            <GeneratorForm onGenerate={handleGenerate} presetTopic={presetTopic} />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div id="results">
            <ResultsDisplay
              topic={result.topic}
              pkg={result.pkg}
              onReset={() => { setResult(null); setPresetTopic(''); }}
            />
          </div>
        )}

        {/* Topic ideas */}
        <div className="bg-white/60 rounded-2xl border border-stone-100 p-4 sm:p-5">
          <p className="text-xs font-semibold text-stone-500 mb-4">
            {result ? '✨ Try another idea' : '✨ Need inspiration? Pick a topic below'}
          </p>
          <TopicSuggestions onSelect={(t) => { setPresetTopic(t); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>

      </main>

      <footer className="pb-10 text-center text-xs text-stone-300">
        Life &amp; Legacy Content Studio · Every story deserves to be told.
      </footer>
    </div>
  );
}
