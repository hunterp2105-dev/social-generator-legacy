# Life & Legacy Content Studio

AI-powered social media content generator for the Life & Legacy niche (family memories, photo books, legacy storytelling — @lifeandlegacybooks).

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** + manual shadcn-style components
- **Anthropic SDK** (`@anthropic-ai/sdk`) for Claude content generation (claude-3-5-sonnet-20240620)
- **localStorage** for post persistence (Supabase-ready)
- Package manager: **pnpm**

## 3-Layer Architecture

```
src/
├── app/                          # LAYER 1 — Presentation
│   ├── api/generate/route.ts     # POST /api/generate (thin controller)
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard (client component)
│
├── components/                   # LAYER 1 — UI
│   ├── ui/                       # Primitive components (button, card, etc.)
│   ├── GeneratorForm.tsx         # Topic input + platform toggles
│   ├── PlatformResult.tsx        # TikTokResult + InstagramResult cards
│   └── ResultsDisplay.tsx        # Results wrapper with save/reset
│
├── services/                     # LAYER 2 — Business Logic
│   ├── claude.service.ts         # Anthropic SDK wrapper (callClaude)
│   ├── platform.service.ts       # Prompt builders + JSON parsers per platform
│   └── content.service.ts        # Orchestrates parallel Claude calls
│
├── repositories/                 # LAYER 3 — Data
│   └── posts.repository.ts       # getAllPosts / savePost / deletePost (localStorage)
│
├── types/
│   ├── platform.types.ts         # Platform = 'tiktok' | 'instagram'
│   └── content.types.ts          # TikTokContent, InstagramContent, GeneratedPost
│
└── lib/
    ├── utils.ts                  # cn() helper
    └── constants.ts              # NICHE config, base hashtags, model defaults
```

## Key Rules

- **Services are server-only** — never import `services/` into client components. Always go through an API route.
- **Repositories are client-only** — they use `localStorage`. Import directly in client components only.
- **Prompt logic lives in `platform.service.ts`** — do not scatter prompts across routes or components.
- **Types are the source of truth** — when adding a new platform, start with `platform.types.ts` and `content.types.ts` first.

## Running Locally

```bash
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local (console.anthropic.com/settings/keys)
pnpm dev
```

## Adding a New Platform

1. Add to `Platform` type in `src/types/platform.types.ts`
2. Add content type interface in `src/types/content.types.ts`
3. Add prompt builder + parser in `src/services/platform.service.ts`
4. Add generation call in `src/services/content.service.ts`
5. Add result component in `src/components/PlatformResult.tsx`
6. Add toggle in `src/components/GeneratorForm.tsx`

## Future: Supabase Integration

Replace `src/repositories/posts.repository.ts` with a Supabase implementation.
Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
