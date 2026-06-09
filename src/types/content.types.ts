export type PackageType = 'voiceover' | 'quotes';

export interface GenerateRequest {
  topic: string;
  type: PackageType;
}

// ── Shared ───────────────────────────────────────────────────────────────────

export type FootageSource = 'Pexels' | 'Pixabay';

export interface FootageSuggestion {
  source: FootageSource;
  description: string;
  searchQuery: string;
}

// ── Voice Over Package ───────────────────────────────────────────────────────

export interface VoiceOverPackage {
  type: 'voiceover';
  script: string;
  footage: FootageSuggestion[];
  caption: string;
  hashtags: string[];
}

// ── Quotes Package ───────────────────────────────────────────────────────────

export interface QuotesPackage {
  type: 'quotes';
  quotes: string[];
  footage: FootageSuggestion[];
  caption: string;
  hashtags: string[];
}

export type ContentPackage = VoiceOverPackage | QuotesPackage;

// ── Topic Ideas ──────────────────────────────────────────────────────────────

export type TopicEmotion = 'nostalgia' | 'urgency' | 'gratitude' | 'love' | 'bittersweet';

export interface TopicIdea {
  title: string;
  description: string;
  emotion: TopicEmotion;
}

// ── Saved ────────────────────────────────────────────────────────────────────

export interface SavedPost {
  id: string;
  topic: string;
  pkg: ContentPackage;
  createdAt: string;
}
