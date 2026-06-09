import { TIKTOK_BASE_HASHTAGS } from '@/lib/constants';
import type { VoiceOverPackage, QuotesPackage } from '@/types/content.types';

// ── System Prompt ─────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are the creative director for @lifeandlegacybooks — a brand that creates emotional short-form videos about family memory, legacy, and the stories we leave behind.

Your content style:
• Voiceovers that feel like a letter read aloud — warm, unhurried, intimate
• Quotes that hit like a wave — words people screenshot and save
• Nature footage that feels like a memory: golden hour, soft rain, open fields, gentle water
• Captions that read like a personal letter, not a social media post
• Hashtags that are niche-specific and actually drive reach

The feeling you always create: the beautiful ache of missing someone, the urgency to preserve what won't last, the warmth of family.

CRITICAL: Output ONLY raw JSON. No markdown, no explanation — just the JSON.`;

// ── Shared helpers ────────────────────────────────────────────────────────────

function baseHashtags(): string {
  return TIKTOK_BASE_HASHTAGS.slice(0, 6).join(', ');
}

const FOOTAGE_SCHEMA = `[
    { "source": "Pexels",  "description": "Specific visual — lighting, subject, movement, mood", "searchQuery": "2–4 keyword search terms" },
    { "source": "Pixabay", "description": "Different scene — vary the feel across all 6",           "searchQuery": "2–4 keywords" },
    { "source": "Pexels",  "description": "Another emotionally resonant scene",                      "searchQuery": "2–4 keywords" },
    { "source": "Pixabay", "description": "Nature or atmospheric — soft light, water, sky",          "searchQuery": "2–4 keywords" },
    { "source": "Pexels",  "description": "Abstract or symbolic — hands, doors, paths, candles",     "searchQuery": "2–4 keywords" },
    { "source": "Pixabay", "description": "Final clip — creates a sense of stillness or longing",    "searchQuery": "2–4 keywords" }
  ]`;

const CAPTION_INSTRUCTIONS = `Full TikTok/Instagram caption, 150–250 words. Structure: hook first line (stops the scroll) → micro-story or reflection (2–3 short paragraphs) → universal truth → warm call to action. @lifeandlegacybooks voice: personal, unhurried, like a letter. 2–3 emojis placed naturally. Do NOT stack emojis at the end.`;

const HASHTAG_INSTRUCTIONS = (base: string) =>
  `12–15 hashtags. Mix: 3–4 niche-specific, 5–6 mid-tier, 3–4 broad trending. Always include these base tags: ${base}. Each hashtag starts with #.`;

// ── Voice Over Prompt ─────────────────────────────────────────────────────────

export function buildVoiceOverPrompt(topic: string): string {
  return `Create a Voice Over video package for this Life & Legacy topic.

Topic: "${topic}"

Output ONLY this raw JSON:
{
  "type": "voiceover",
  "script": "A warm, emotional voiceover script — exactly 50–80 words. Reads aloud in 15–25 seconds. Written in second person ('you', 'your') or first person ('I', 'we'). Opens with a scene or a feeling. Ends with a quiet, resonant truth — not a question, not a call to action. Should feel like something read at a funeral, a family reunion, or a quiet night looking at old photos.",
  "footage": ${FOOTAGE_SCHEMA},
  "caption": "${CAPTION_INSTRUCTIONS}",
  "hashtags": ["${HASHTAG_INSTRUCTIONS(baseHashtags())}"]
}`;
}

// ── Quotes Prompt ─────────────────────────────────────────────────────────────

export function buildQuotesPrompt(topic: string): string {
  return `Create a Text Quotes video package for this Life & Legacy topic.

Topic: "${topic}"

Output ONLY this raw JSON:
{
  "type": "quotes",
  "quotes": [
    "Quote 1 — 6–12 words. Something a grandmother might say, or something you wish you'd told someone. Perfect for slow text fade-in on screen.",
    "Quote 2 — A different emotional angle: urgency, loss, or gratitude. Short enough to read in 3 seconds.",
    "Quote 3 — The most shareable quote. Something that makes someone think of their own family.",
    "Quote 4 — Ends the video with warmth or hope. The last thing someone sees before the caption."
  ],
  "footage": ${FOOTAGE_SCHEMA},
  "caption": "${CAPTION_INSTRUCTIONS}",
  "hashtags": ["${HASHTAG_INSTRUCTIONS(baseHashtags())}"]
}`;
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  return JSON.parse(cleaned) as T;
}

export const parseVoiceOverResponse = (raw: string) => parseJson<VoiceOverPackage>(raw);
export const parseQuotesResponse    = (raw: string) => parseJson<QuotesPackage>(raw);
