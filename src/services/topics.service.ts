import { callClaude } from './claude.service';
import type { TopicIdea } from '@/types/content.types';

const SYSTEM_PROMPT = `You are a content strategist for @lifeandlegacybooks — a social media brand about family memory preservation, photo books, and legacy storytelling. You know exactly what stops a scroll and makes someone feel something in their chest.`;

const USER_PROMPT = `Generate 10 scroll-stopping content topic ideas for the Life & Legacy brand.

Spread across these theme categories:
- Family relationships (grandparents, parents, siblings, children)
- Time & seasons (childhood, growing old, the passage of time)
- Objects & places that hold memory (old photos, family homes, handwriting, recipes)
- Fears & urgency (stories never told, people we're losing, regret)
- Nature as metaphor (seasons, light, trees, water reflecting memory)
- Legacy & continuation (what we pass down, how we want to be remembered)

Each topic must:
- Be emotionally specific, not generic ("The voicemail I almost deleted" — not "Family memories matter")
- Tap into a real, universal family moment, fear, or longing
- Work immediately as a TikTok or Instagram hook
- Feel like it could stop someone mid-scroll

Output ONLY this raw JSON — no markdown, no explanation:
{
  "topics": [
    {
      "title": "Compelling topic title, 6–12 words, hooks immediately",
      "description": "One sentence: the specific emotional angle or core story to explore",
      "emotion": "one of exactly: nostalgia | urgency | gratitude | love | bittersweet"
    }
  ]
}

Generate exactly 10 topics. Distribute all 5 emotions. Make every title feel like it could go viral.`;

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
