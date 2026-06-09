import { callClaude } from './claude.service';
import type { TopicIdea } from '@/types/content.types';

const SYSTEM_PROMPT = `You are a content strategist for @lifeandlegacybooks — a social media brand about family memory preservation, photo books, and legacy storytelling. You know exactly what stops a scroll and makes someone feel something.`;

const USER_PROMPT = `Generate 9 scroll-stopping content topic ideas for the Life & Legacy brand.

Each topic should:
- Be emotionally specific, not generic ("The voicemail I almost deleted" not "Family memories matter")
- Tap into a real, recognizable family moment or fear
- Be immediately usable as a TikTok or Instagram post
- Cover a range of emotions

Output ONLY this raw JSON — no markdown, no explanation:
{
  "topics": [
    {
      "title": "Compelling topic title, 6–12 words, hooks immediately",
      "description": "One sentence: the emotional angle or core story to explore",
      "emotion": "one of exactly: nostalgia | urgency | gratitude | love | bittersweet"
    }
  ]
}

Distribute emotions across all 9 topics. Make each title feel like it could go viral.`;

export async function generateTopicIdeas(): Promise<TopicIdea[]> {
  const raw = await callClaude(USER_PROMPT, SYSTEM_PROMPT);
  try {
    const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
    const parsed = JSON.parse(cleaned) as { topics: TopicIdea[] };
    return parsed.topics;
  } catch {
    throw new Error('Failed to parse topic ideas — model returned invalid JSON');
  }
}
