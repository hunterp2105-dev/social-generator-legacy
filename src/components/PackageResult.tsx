'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink, Film, Hash, MessageSquare, Mic, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ContentPackage, FootageSource } from '@/types/content.types';

// ── Utilities ─────────────────────────────────────────────────────────────────

function footageUrl(source: FootageSource, query: string): string {
  const q = encodeURIComponent(query);
  return source === 'Pixabay'
    ? `https://pixabay.com/videos/search/${q}/`
    : `https://www.pexels.com/search/videos/${q}/`;
}

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
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className="text-stone-500">{icon}</span>
        <h3 className="text-sm font-bold text-stone-700 uppercase tracking-wider">{label}</h3>
      </div>
      {copyText && <CopyBtn text={copyText} />}
    </div>
  );
}

// ── Sections ──────────────────────────────────────────────────────────────────

function ScriptSection({ script }: { script: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100 p-5">
      <SectionHeader icon={<Mic className="h-4 w-4" />} label="Voice Over Script" copyText={script} />
      <div className="bg-white rounded-xl border border-amber-100 px-5 py-4">
        <p className="text-sm font-medium text-stone-800 leading-loose italic">&ldquo;{script}&rdquo;</p>
      </div>
      <p className="text-xs text-stone-400 mt-2 text-right">~15–25 seconds when read aloud</p>
    </div>
  );
}

function QuotesSection({ quotes }: { quotes: string[] }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border border-amber-100 p-5">
      <SectionHeader icon={<Quote className="h-4 w-4" />} label="Text Overlay Quotes" copyText={quotes.join('\n\n')} />
      <div className="space-y-3">
        {quotes.map((q, i) => (
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-amber-100 px-4 py-3 group">
            <span className="text-xs font-bold text-amber-400 mt-0.5 shrink-0 w-4">{i + 1}</span>
            <p className="text-sm font-medium text-stone-800 leading-snug flex-1 italic">&ldquo;{q}&rdquo;</p>
            <CopyBtn text={q} className="opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

const SOURCE_STYLES: Record<FootageSource, { bg: string; text: string; dot: string }> = {
  Pexels:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  Pixabay: { bg: 'bg-sky-100',     text: 'text-sky-700',     dot: 'bg-sky-400' },
};

function FootageSection({ footage }: { footage: ContentPackage['footage'] }) {
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-5">
      <SectionHeader icon={<Film className="h-4 w-4" />} label="Royalty-Free Footage" />
      <div className="space-y-2.5">
        {footage.map((f, i) => {
          const style = SOURCE_STYLES[f.source] ?? SOURCE_STYLES.Pexels;
          const url = footageUrl(f.source, f.searchQuery);
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all group"
            >
              <span className={`h-2 w-2 rounded-full shrink-0 ${style.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-700 leading-snug truncate">{f.description}</p>
                <p className="text-xs text-stone-400 mt-0.5">Search: &ldquo;{f.searchQuery}&rdquo;</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${style.bg} ${style.text}`}>
                {f.source}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-stone-300 group-hover:text-amber-500 transition-colors shrink-0" />
            </a>
          );
        })}
      </div>
      <p className="text-xs text-stone-400 mt-3 text-center">Click any row to open a filtered search — all footage is free to use</p>
    </div>
  );
}

function CaptionSection({ caption }: { caption: string }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-50/50 to-amber-50/30 border border-rose-100 p-5">
      <SectionHeader icon={<MessageSquare className="h-4 w-4" />} label="TikTok / Instagram Caption" copyText={caption} />
      <div className="bg-white border border-rose-100 rounded-xl p-4">
        <p className="text-sm text-stone-700 whitespace-pre-wrap leading-7">{caption}</p>
      </div>
    </div>
  );
}

function HashtagsSection({ hashtags }: { hashtags: string[] }) {
  const text = hashtags.join(' ');
  return (
    <div className="rounded-2xl bg-white border border-stone-200 p-5">
      <SectionHeader icon={<Hash className="h-4 w-4" />} label={`Hashtags (${hashtags.length})`} copyText={text} />
      <div className="flex flex-wrap gap-1.5">
        {hashtags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-normal cursor-default">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function PackageResult({ pkg, topic }: { pkg: ContentPackage; topic: string }) {
  const isVoiceOver = pkg.type === 'voiceover';

  const allText = isVoiceOver
    ? [
        `Script:\n"${pkg.script}"`,
        `\nCaption:\n${pkg.caption}`,
        `\nHashtags:\n${pkg.hashtags.join(' ')}`,
      ].join('\n')
    : [
        pkg.quotes.map((q, i) => `Quote ${i + 1}: "${q}"`).join('\n'),
        `\nCaption:\n${pkg.caption}`,
        `\nHashtags:\n${pkg.hashtags.join(' ')}`,
      ].join('\n');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-800">
              {isVoiceOver ? 'Voice Over Package' : 'Quotes Package'}
            </h2>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isVoiceOver ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-700'
            }`}>
              {isVoiceOver ? 'VOICE OVER' : 'TEXT QUOTES'}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">&ldquo;{topic}&rdquo;</p>
        </div>
        <CopyBtn text={allText} className="border border-stone-200" />
      </div>

      {isVoiceOver
        ? <ScriptSection script={pkg.script} />
        : <QuotesSection quotes={pkg.quotes} />
      }
      <FootageSection footage={pkg.footage} />
      <CaptionSection caption={pkg.caption} />
      <HashtagsSection hashtags={pkg.hashtags} />
    </div>
  );
}
