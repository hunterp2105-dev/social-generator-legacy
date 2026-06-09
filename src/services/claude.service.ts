import Anthropic from '@anthropic-ai/sdk';
import { DEFAULT_MODEL, MAX_TOKENS } from '@/lib/constants';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callClaude(userPrompt: string, systemPrompt: string): Promise<string> {
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
    max_tokens: MAX_TOKENS,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const block = response.content[0];
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude');
  return block.text;
}
