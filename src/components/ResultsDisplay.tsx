'use client';

import { useState } from 'react';
import { BookmarkPlus, Check, RotateCcw } from 'lucide-react';
import { PackageResult } from '@/components/PackageResult';
import type { ContentPackage } from '@/types/content.types';

interface Props {
  topic: string;
  pkg: ContentPackage;
  onReset: () => void;
}

export function ResultsDisplay({ topic, pkg, onReset }: Props) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    try {
      const existing = JSON.parse(localStorage.getItem('life_legacy_posts') ?? '[]');
      localStorage.setItem('life_legacy_posts', JSON.stringify([
        { id: crypto.randomUUID(), topic, pkg, createdAt: new Date().toISOString() },
        ...existing,
      ]));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* localStorage unavailable */ }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={handleSave}
          disabled={saved}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-colors"
        >
          {saved ? <><Check className="h-3.5 w-3.5 text-green-500" /> Saved</> : <><BookmarkPlus className="h-3.5 w-3.5" /> Save</>}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> New topic
        </button>
      </div>
      <PackageResult pkg={pkg} topic={topic} />
    </div>
  );
}
