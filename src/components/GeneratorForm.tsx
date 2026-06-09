'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, Mic, Quote } from 'lucide-react';
import type { ContentPackage, PackageType } from '@/types/content.types';

interface Props {
  onGenerate: (pkg: ContentPackage, topic: string) => void;
  presetTopic?: string;
}

export function GeneratorForm({ onGenerate, presetTopic }: Props) {
  const [topic, setTopic] = useState(presetTopic ?? '');
  const [loading, setLoading] = useState<PackageType | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (presetTopic) {
      setTopic(presetTopic);
      inputRef.current?.focus();
    }
  }, [presetTopic]);

  async function generate(type: PackageType) {
    if (!topic.trim()) { setError('Enter a topic first.'); return; }
    setError('');
    setLoading(type);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      onGenerate(data.pkg as ContentPackage, topic.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="text"
        value={topic}
        onChange={(e) => { setTopic(e.target.value); setError(''); }}
        onKeyDown={(e) => { if (e.key === 'Enter') generate('voiceover'); }}
        placeholder={`"grandma's garden" · "family lake trip" · "first day of school"`}
        className="w-full h-12 px-4 rounded-xl border border-stone-200 bg-white text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
      />

      <div className="grid grid-cols-2 gap-2.5">
        {/* Voice Over button */}
        <button
          onClick={() => generate('voiceover')}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 transition-colors disabled:opacity-60 disabled:pointer-events-none shadow-sm shadow-violet-200"
        >
          {loading === 'voiceover' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
          ) : (
            <><Mic className="h-4 w-4" /> Voice Over</>
          )}
        </button>

        {/* Quotes button */}
        <button
          onClick={() => generate('quotes')}
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 active:bg-amber-800 transition-colors disabled:opacity-60 disabled:pointer-events-none shadow-sm shadow-amber-200"
        >
          {loading === 'quotes' ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
          ) : (
            <><Quote className="h-4 w-4" /> Text Quotes</>
          )}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 px-1">{error}</p>
      )}

      {loading && (
        <p className="text-xs text-stone-400 px-1 animate-pulse">
          {loading === 'voiceover'
            ? 'Crafting your voiceover script, footage links, caption, and hashtags…'
            : 'Writing your quotes, footage links, caption, and hashtags…'}
        </p>
      )}
    </div>
  );
}
