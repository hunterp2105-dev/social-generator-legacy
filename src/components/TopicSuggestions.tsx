'use client';

import { useState } from 'react';
import { Lightbulb, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TopicIdea, TopicEmotion } from '@/types/content.types';

const EMOTION_STYLES: Record<TopicEmotion, { badge: string; card: string; dot: string }> = {
  nostalgia:   { badge: 'bg-amber-100 text-amber-700',   card: 'border-amber-100 hover:border-amber-300',   dot: 'bg-amber-400' },
  urgency:     { badge: 'bg-rose-100 text-rose-700',     card: 'border-rose-100 hover:border-rose-300',     dot: 'bg-rose-400' },
  gratitude:   { badge: 'bg-emerald-100 text-emerald-700', card: 'border-emerald-100 hover:border-emerald-300', dot: 'bg-emerald-400' },
  love:        { badge: 'bg-pink-100 text-pink-700',     card: 'border-pink-100 hover:border-pink-300',     dot: 'bg-pink-400' },
  bittersweet: { badge: 'bg-violet-100 text-violet-700', card: 'border-violet-100 hover:border-violet-300', dot: 'bg-violet-400' },
};

interface Props {
  onSelect: (topic: string) => void;
}

export function TopicSuggestions({ onSelect }: Props) {
  const [topics, setTopics] = useState<TopicIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  async function fetchTopics() {
    setLoading(true);
    setError('');
    setSelected(null);
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load ideas');
      setTopics(data.topics as TopicIdea[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(topic: TopicIdea) {
    setSelected(topic.title);
    onSelect(topic.title);
    setTimeout(() => {
      document.getElementById('generator-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    <div className="space-y-4">
      {/* Button row */}
      <div className="flex items-center gap-3">
        <Button
          onClick={fetchTopics}
          disabled={loading}
          variant={topics.length ? 'outline' : 'default'}
          className={topics.length ? '' : 'shadow-md'}
          size={topics.length ? 'sm' : 'default'}
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating ideas…</>
          ) : topics.length ? (
            <><RefreshCw className="h-4 w-4" /> Refresh ideas</>
          ) : (
            <><Lightbulb className="h-4 w-4" /> Generate Topic Ideas</>
          )}
        </Button>
        {topics.length > 0 && !loading && (
          <p className="text-xs text-stone-400">Click any idea to use it in the generator</p>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="h-[88px] rounded-xl border border-stone-100 bg-stone-50 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Topic cards */}
      {!loading && topics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topics.map((topic, i) => {
            const style = EMOTION_STYLES[topic.emotion] ?? EMOTION_STYLES.nostalgia;
            const isSelected = selected === topic.title;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(topic)}
                className={`text-left p-4 rounded-xl border-2 bg-white transition-all group ${
                  isSelected
                    ? 'border-amber-400 shadow-md ring-2 ring-amber-100'
                    : `${style.card} hover:shadow-sm hover:bg-stone-50/50`
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 leading-snug group-hover:text-amber-700 transition-colors">
                      {topic.title}
                    </p>
                    <p className="text-xs text-stone-500 leading-snug">{topic.description}</p>
                    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                      {topic.emotion}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
