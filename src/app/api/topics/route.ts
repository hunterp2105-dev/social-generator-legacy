import { NextResponse } from 'next/server';
import { generateTopicIdeas } from '@/services/topics.service';

export async function GET() {
  try {
    const topics = await generateTopicIdeas();
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('[/api/topics]', error);
    const message = error instanceof Error ? error.message : 'Failed to generate topics';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
