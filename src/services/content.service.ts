import { callClaude } from './claude.service';
import {
  SYSTEM_PROMPT,
  buildVoiceOverPrompt,
  buildQuotesPrompt,
  parseVoiceOverResponse,
  parseQuotesResponse,
} from './platform.service';
import type { GenerateRequest, VoiceOverPackage, QuotesPackage } from '@/types/content.types';

export async function generateVoiceOverPackage(request: GenerateRequest): Promise<VoiceOverPackage> {
  const raw = await callClaude(buildVoiceOverPrompt(request.topic), SYSTEM_PROMPT);
  return parseVoiceOverResponse(raw);
}

export async function generateQuotesPackage(request: GenerateRequest): Promise<QuotesPackage> {
  const raw = await callClaude(buildQuotesPrompt(request.topic), SYSTEM_PROMPT);
  return parseQuotesResponse(raw);
}
