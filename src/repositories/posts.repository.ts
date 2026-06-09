import type { SavedPost, ContentPackage } from '@/types/content.types';

const STORAGE_KEY = 'life_legacy_posts';

export function getAllPosts(): SavedPost[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedPost[]) : [];
  } catch {
    return [];
  }
}

export function savePost(topic: string, pkg: ContentPackage): SavedPost {
  const entry: SavedPost = {
    id: crypto.randomUUID(),
    topic,
    pkg,
    createdAt: new Date().toISOString(),
  };
  const existing = getAllPosts();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing]));
  return entry;
}

export function deletePost(id: string): void {
  const posts = getAllPosts().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}
