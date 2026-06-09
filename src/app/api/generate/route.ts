import { NextRequest, NextResponse } from 'next/server';
import { generateVoiceOverPackage, generateQuotesPackage } from '@/services/content.service';
import type { GenerateRequest } from '@/types/content.types';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateRequest;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }
    if (body.type !== 'voiceover' && body.type !== 'quotes') {
      return NextResponse.json({ error: 'Invalid type — must be "voiceover" or "quotes"' }, { status: 400 });
    }

    const request: GenerateRequest = { topic: body.topic.trim(), type: body.type };
    const pkg = body.type === 'voiceover'
      ? await generateVoiceOverPackage(request)
      : await generateQuotesPackage(request);

    return NextResponse.json({ pkg });
  } catch (error) {
    console.error('[/api/generate]', error);
    const message = error instanceof Error ? error.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
