export type Platform = 'tiktok' | 'instagram';

export interface PlatformConfig {
  name: string;
  icon: string;
  maxCaptionChars: number;
  supportsVideo: boolean;
}

export const PLATFORM_CONFIGS: Record<Platform, PlatformConfig> = {
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    maxCaptionChars: 2200,
    supportsVideo: true,
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    maxCaptionChars: 2200,
    supportsVideo: true,
  },
};
