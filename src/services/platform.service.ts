import { TIKTOK_BASE_HASHTAGS } from '@/lib/constants';
import type { VoiceOverPackage, QuotesPackage } from '@/types/content.types';

// ── System Prompt ─────────────────────────────────────────────────────────────

export const SYSTEM_PROMPT = `You are the creative director for @lifeandlegacybooks — a brand that creates emotional short-form videos about family memory, legacy, and the stories we leave behind.

Your content philosophy:
• Short, powerful quotes that people screenshot and save — the kind that makes someone think of their grandmother
• Nature footage and photography that feels like a memory: golden hour fields, soft morning light, gentle rain on windows, a child's hand in an older hand
• Voiceovers that read like a letter found in an old drawer — warm, unhurried, intimate
• Captions that feel like a personal letter, not a social media post
• Hashtags that are niche-specific and actually drive reach in the family/legacy space

The feeling you always create: the beautiful ache of missing someone, the urgent need to preserve what won't last forever, the warmth of belonging to a family.

CRITICAL: Output ONLY raw JSON. No markdown fences, no explanation — just the JSON object.`;

// ── Shared schema strings ─────────────────────────────────────────────────────

const QUOTE_RULES = `Each quote: 5–14 words. Should feel like something carved into a gravestone, stitched into a quilt, or whispered at a kitchen table. Avoid clichés. Make each one distinct — vary between loss, urgency, belonging, time, love.`;

const VIDEO_SCHEMA = `[
    { "source": "Pexels",  "description": "Cinematic close-up — describe the exact lighting, subject, and movement", "searchQuery": "2–4 nature keywords" },
    { "source": "Pixabay", "description": "Wide atmospheric shot — golden hour, open fields, soft sky",              "searchQuery": "2–4 keywords" },
    { "source": "Mixkit",  "description": "Slow motion or time-lapse — water, leaves, light, seasons",              "searchQuery": "2–4 keywords" },
    { "source": "Pexels",  "description": "Intimate human-scale detail — hands, paths, doorways, candles",          "searchQuery": "2–4 keywords" },
    { "source": "Pixabay", "description": "Nature establishing shot — forest, meadow, coastline, mountains",        "searchQuery": "2–4 keywords" },
    { "source": "Mixkit",  "description": "Abstract or symbolic — light bokeh, rain on glass, falling petals",     "searchQuery": "2–4 keywords" }
  ]`;

const PHOTO_SCHEMA = `[
    { "source": "Pexels",   "description": "Warm natural light portrait or scene — describe mood and framing",    "searchQuery": "2–4 keywords" },
    { "source": "Unsplash", "description": "Moody or atmospheric — mist, golden hour, aged textures",            "searchQuery": "2–4 keywords" },
    { "source": "Pixabay",  "description": "Nature detail — flowers, leaves, frost, water drops",                "searchQuery": "2–4 keywords" },
    { "source": "Pexels",   "description": "Symbolic still life — old objects, hands, letters, books",           "searchQuery": "2–4 keywords" },
    { "source": "Unsplash", "description": "Landscape or season — evokes a specific time of year or memory",     "searchQuery": "2–4 keywords" },
    { "source": "Pixabay",  "description": "Soft, dreamy composition — light leaks, shallow depth of field",     "searchQuery": "2–4 keywords" }
  ]`;

const CAPTION_RULES = `Full TikTok/Instagram caption, 150–250 words. Structure: scroll-stopping hook (first line only) → emotional micro-story or reflection (2–3 short paragraphs) → universal truth → warm call to action. @lifeandlegacybooks voice: personal, unhurried, like a letter. 2–3 emojis placed naturally inside the text, not stacked at the end.`;

function hashtagRules(base: string): string {
  return `Exactly 13 hashtags as an array of strings. Each starts with #. Mix: 4 niche-specific (family/legacy/memory/photobook space), 5 mid-tier (50k–500k posts), 4 broad trending. Always include some of these: ${base}`;
}

// ── Voice Over Prompt ─────────────────────────────────────────────────────────

export function buildVoiceOverPrompt(topic: string): string {
  const base = TIKTOK_BASE_HASHTAGS.slice(0, 5).join(', ');
  return `Create a complete Voice Over video package for this Life & Legacy topic.

Topic: "${topic}"

Output ONLY this raw JSON:
{
  "type": "voiceover",
  "script": "One continuous voiceover script — 55–80 words, reads aloud in 15–25 seconds. Written in second person ('you', 'your') or first person ('I', 'we'). Opens with a concrete sensory image. Builds to a quiet, resonant truth. No call to action — it ends on feeling. Should sound like something read at a family gathering or found in an old letter.",
  "quotes": [
    ${QUOTE_RULES}
    "Quote 1", "Quote 2", "Quote 3", "Quote 4", "Quote 5", "Quote 6", "Quote 7", "Quote 8", "Quote 9"
  ],
  "videos": ${VIDEO_SCHEMA},
  "photos": ${PHOTO_SCHEMA},
  "caption": "${CAPTION_RULES}",
  "hashtags": ["${hashtagRules(base)}"]
}`;
}

// ── Quotes Prompt ─────────────────────────────────────────────────────────────

export function buildQuotesPrompt(topic: string): string {
  const base = TIKTOK_BASE_HASHTAGS.slice(0, 5).join(', ');
  return `Create a complete Text Quotes video package for this Life & Legacy topic.

Topic: "${topic}"

Output ONLY this raw JSON:
{
  "type": "quotes",
  "quotes": [
    ${QUOTE_RULES}
    Order them for a video: 1st quote hooks, middle quotes build emotion, last quote lands with weight or warmth.
    "Quote 1", "Quote 2", "Quote 3", "Quote 4", "Quote 5", "Quote 6", "Quote 7", "Quote 8", "Quote 9"
  ],
  "videos": ${VIDEO_SCHEMA},
  "photos": ${PHOTO_SCHEMA},
  "caption": "${CAPTION_RULES}",
  "hashtags": ["${hashtagRules(base)}"]
}`;
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseJson<T>(raw: string): T {
  const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
  return JSON.parse(cleaned) as T;
}

export const parseVoiceOverResponse = (raw: string) => parseJson<VoiceOverPackage>(raw);
export const parseQuotesResponse    = (raw: string) => parseJson<QuotesPackage>(raw);
