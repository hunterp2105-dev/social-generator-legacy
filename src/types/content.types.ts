export type PackageType = 'voiceover' | 'quotes';

export interface GenerateRequest {
  topic: string;
  type: PackageType;
}

// ── Media ─────────────────────────────────────────────────────────────────────

export type VideoSource = 'Pexels' | 'Pixabay' | 'Mixkit';
export type PhotoSource = 'Pexels' | 'Pixabay' | 'Unsplash';

export interface VideoSuggestion {
  source: VideoSource;
  description: string;
  searchQuery: string;
}

export interface PhotoSuggestion {
  source: PhotoSource;
  description: string;
  searchQuery: string;
}

// ── Packages ──────────────────────────────────────────────────────────────────

export interface VoiceOverPackage {
  type: 'voiceover';
  script: string;
  quotes: string[];
  videos: VideoSuggestion[];
  photos: PhotoSuggestion[];
  caption: string;
  hashtags: string[];
}

export interface QuotesPackage {
  type: 'quotes';
  quotes: string[];
  videos: VideoSuggestion[];
  photos: PhotoSuggestion[];
  caption: string;
  hashtags: string[];
}

export type ContentPackage = VoiceOverPackage | QuotesPackage;

// ── Topic Ideas ───────────────────────────────────────────────────────────────

export type TopicEmotion = 'nostalgia' | 'urgency' | 'gratitude' | 'love' | 'bittersweet';

export interface TopicIdea {
  title: string;
  description: string;
  emotion: TopicEmotion;
}

// ── Saved ─────────────────────────────────────────────────────────────────────

export interface SavedPost {
  id: string;
  topic: string;
  pkg: ContentPackage;
  createdAt: string;
}
