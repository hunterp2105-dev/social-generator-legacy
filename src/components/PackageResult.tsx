'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Film, Hash, Image, Layers, MessageSquare, Mic, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContentPackage, VideoSource, PhotoSource, VideoSuggestion, PhotoSuggestion } from '@/types/content.types';

// ── URL builders ──────────────────────────────────────────────────────────────

function videoUrl(source: VideoSource, query: string): string {
  const q = encodeURIComponent(query);
  if (source === 'Pixabay') return `https://pixabay.com/videos/search/${q}/`;
  if (source === 'Mixkit')  return `https://mixkit.co/free-stock-video/${q}/`;
  return `https://www.pexels.com/search/videos/${q}/`;
}

function photoUrl(source: PhotoSource, query: string): string {
  const q = encodeURIComponent(query);
  if (source === 'Pixabay')  return `https://pixabay.com/images/search/${q}/`;
  if (source === 'Unsplash') return `https://unsplash.com/s/photos/${q}`;
  return `https://www.pexels.com/search/${q}/`;
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyBtn({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  function handle() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handle}
      title="Copy"
      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
        copied
          ? 'bg-green-50 text-green-600'
          : `text-stone-400 hover:text-stone-700 hover:bg-stone-100 ${className}`
      }`}
    >
      {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
    </button>
  );
}

function SectionHeader({ icon, label, copyText }: { icon: React.ReactNode; label: string; copyText?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <span className="text-stone-400">{icon}</span>
        <h3 className="text-xs font-bold text-stone-600 uppercase tracking-widest">{label}</h3>
      </div>
      {copyText && <CopyBtn text={copyText} />}
    </div>
  );
}

// ── Script ────────────────────────────────────────────────────────────────────

function ScriptSection({ script }: { script: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50/30 border border-violet-100 p-5">
      <SectionHeader icon={<Mic className="h-3.5 w-3.5" />} label="Voice Over Script" copyText={script} />
      <blockquote className="bg-white rounded-xl border border-violet-100 px-5 py-4">
        <p className="text-sm font-medium text-stone-800 leading-loose italic">&ldquo;{script}&rdquo;</p>
      </blockquote>
      <p className="text-[11px] text-stone-400 mt-2 text-right">~15–25 seconds read aloud</p>
    </div>
  );
}

// ── Quotes ────────────────────────────────────────────────────────────────────

function QuotesSection({ quotes, label }: { quotes: string[]; label: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-100 p-5">
      <SectionHeader
        icon={<Quote className="h-3.5 w-3.5" />}
        label={label}
        copyText={quotes.map((q, i) => `${i + 1}. "${q}"`).join('\n')}
      />
      <div className="grid gap-2">
        {quotes.map((q, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-amber-100/80 px-4 py-3 group">
            <span className="text-[11px] font-bold text-amber-300 mt-0.5 shrink-0 w-4 tabular-nums">{i + 1}</span>
            <p className="text-sm font-medium text-stone-800 leading-snug flex-1 italic">&ldquo;{q}&rdquo;</p>
            <CopyBtn text={q} className="opacity-0 group-hover:opacity-100 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Media (Videos + Photos with toggle) ──────────────────────────────────────

type MediaTab = 'videos' | 'photos';

const VIDEO_SOURCE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Pexels:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Pixabay: { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-400' },
  Mixkit:  { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500' },
};

const PHOTO_SOURCE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Pexels:   { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Pixabay:  { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-400' },
  Unsplash: { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-400' },
};

function VideoRow({ item }: { item: VideoSuggestion }) {
  const style = VIDEO_SOURCE_STYLES[item.source] ?? VIDEO_SOURCE_STYLES.Pexels;
  const url = videoUrl(item.source, item.searchQuery);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
    >
      <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-700 leading-snug truncate">{item.description}</p>
        <p className="text-[11px] text-stone-400 mt-0.5">&ldquo;{item.searchQuery}&rdquo;</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${style.bg} ${style.text}`}>{item.source}</span>
      <ExternalLink className="h-3.5 w-3.5 text-stone-300 group-hover:text-amber-500 transition-colors shrink-0" />
    </a>
  );
}

function PhotoRow({ item }: { item: PhotoSuggestion }) {
  const style = PHOTO_SOURCE_STYLES[item.source] ?? PHOTO_SOURCE_STYLES.Pexels;
  const url = photoUrl(item.source, item.searchQuery);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-rose-200 hover:bg-rose-50/20 transition-all group"
    >
      <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-stone-700 leading-snug truncate">{item.description}</p>
        <p className="text-[11px] text-stone-400 mt-0.5">&ldquo;{item.searchQuery}&rdquo;</p>
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${style.bg} ${style.text}`}>{item.source}</span>
      <ExternalLink className="h-3.5 w-3.5 text-stone-300 group-hover:text-rose-400 transition-colors shrink-0" />
    </a>
  );
}

function MediaSection({ videos, photos }: { videos: VideoSuggestion[]; photos: PhotoSuggestion[] }) {
  const [tab, setTab] = useState<MediaTab>('videos');

  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-stone-400">
            {tab === 'videos' ? <Film className="h-3.5 w-3.5" /> : <Image className="h-3.5 w-3.5" />}
          </span>
          <h3 className="text-xs font-bold text-stone-600 uppercase tracking-widest">
            Royalty-Free Media
          </h3>
        </div>
        {/* Tab toggle */}
        <div className="flex items-center bg-stone-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setTab('videos')}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
              tab === 'videos' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Film className="h-3 w-3" /> Videos
          </button>
          <button
            onClick={() => setTab('photos')}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md transition-all ${
              tab === 'photos' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <Image className="h-3 w-3" /> Photos
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {tab === 'videos'
          ? videos.map((v, i) => <VideoRow key={i} item={v} />)
          : photos.map((p, i) => <PhotoRow key={i} item={p} />)
        }
      </div>

      <p className="text-[11px] text-stone-400 mt-3 text-center">
        Click any row to search — all media is free to use commercially
      </p>
    </div>
  );
}

// ── Caption ───────────────────────────────────────────────────────────────────

function CaptionSection({ caption }: { caption: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-50/50 to-amber-50/30 border border-rose-100 p-5">
      <SectionHeader
        icon={<MessageSquare className="h-3.5 w-3.5" />}
        label="TikTok / Instagram Caption"
        copyText={caption}
      />
      <div className="bg-white border border-rose-100 rounded-xl p-4">
        <p className="text-sm text-stone-700 whitespace-pre-wrap leading-7">{caption}</p>
      </div>
    </div>
  );
}

// ── Hashtags ──────────────────────────────────────────────────────────────────

function HashtagsSection({ hashtags }: { hashtags: string[] }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-5">
      <SectionHeader
        icon={<Hash className="h-3.5 w-3.5" />}
        label={`Hashtags (${hashtags.length})`}
        copyText={hashtags.join(' ')}
      />
      <div className="flex flex-wrap gap-1.5">
        {hashtags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-normal cursor-default">{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function PackageResult({ pkg, topic }: { pkg: ContentPackage; topic: string }) {
  const isVoiceOver = pkg.type === 'voiceover';

  const allText = [
    isVoiceOver
      ? `VOICE OVER SCRIPT:\n"${pkg.script}"\n`
      : '',
    `QUOTES:\n${pkg.quotes.map((q, i) => `${i + 1}. "${q}"`).join('\n')}`,
    `\nCAPTION:\n${pkg.caption}`,
    `\nHASHTAGS:\n${pkg.hashtags.join(' ')}`,
  ].join('\n');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-800">
                {isVoiceOver ? 'Voice Over Package' : 'Quotes Package'}
              </h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isVoiceOver
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {isVoiceOver ? <><Mic className="inline h-2.5 w-2.5 mr-0.5" />VOICE OVER</> : <><Quote className="inline h-2.5 w-2.5 mr-0.5" />TEXT QUOTES</>}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">&ldquo;{topic}&rdquo;</p>
          </div>
        </div>
        <CopyBtn text={allText} className="border border-stone-200 !px-3 !py-1.5" />
      </div>

      {/* Content sections */}
      {isVoiceOver && <ScriptSection script={pkg.script} />}

      <QuotesSection
        quotes={pkg.quotes}
        label={isVoiceOver ? 'Bonus Quotes & Text Overlays' : 'Quotes for On-Screen Text'}
      />

      <MediaSection videos={pkg.videos} photos={pkg.photos} />
      <CaptionSection caption={pkg.caption} />
      <HashtagsSection hashtags={pkg.hashtags} />
    </div>
  );
}
