# CLAUDE.md — Perspective Coach (memo)

## Project Overview

A reflective journaling web app ("視点生成日記") that helps users articulate thoughts through a structured process: write diary entries (fact/feeling/thought/draft), receive AI-generated perspective questions, deep-dive into core questions, and collect discovered values in a personal dictionary.

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript 5 (strict mode)
- **Styling:** TailwindCSS 4
- **Backend:** Supabase (PostgreSQL, auth)
- **Deployment:** Vercel
- **Node.js:** >= 20.0.0

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config, core-web-vitals + typescript rules)
```

There is no test runner configured. No CI/CD pipeline (GitHub Actions) exists — deployment is handled by Vercel.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Root layout (metadata, BottomNav, lang="ja")
│   ├── page.tsx          # Home — recent entries list, write CTA
│   ├── globals.css       # TailwindCSS imports, CSS variables, theme
│   ├── write/page.tsx    # 4-field diary form (fact/feeling/thought/draft)
│   ├── perspective/page.tsx  # AI perspective suggestions (currently mock)
│   ├── deep-dive/page.tsx    # Extended question interaction
│   └── dictionary/page.tsx   # Values dictionary with detail modal
├── components/
│   └── BottomNav.tsx     # Fixed bottom navigation (Home, Write, Dictionary)
├── lib/
│   └── supabase.ts       # Supabase client initialization
└── types/
    └── index.ts          # Shared interfaces (DiaryEntry, PerspectiveResponse, ValueTag) and constants
```

## Code Conventions

### Naming
- **Components:** PascalCase (`BottomNav`, `WritePage`)
- **Functions:** camelCase (`handleSubmit`, `fetchEntries`)
- **Constants:** SCREAMING_SNAKE_CASE (`INPUT_LABELS`, `PERSPECTIVE_CARDS`)
- **Types/Interfaces:** PascalCase (`DiaryEntry`, `ValueTag`)

### Imports
- Use the `@/*` path alias for all imports from `src/` (configured in tsconfig.json)
- Client components must include `"use client"` directive at the top

### Styling
- TailwindCSS utility classes only — no component-specific CSS files
- Color palette: indigo (fact), rose (feeling), emerald (thought), amber (draft), slate (neutral)
- Dark mode via `dark:` prefix utilities and `prefers-color-scheme`
- Mobile-first design with safe-area insets

### Patterns
- React hooks (`useState`, `useEffect`) for local component state
- Supabase for persistent diary entries (`diary_entries` table)
- `localStorage` for workflow state between route transitions and values dictionary
- No external state management library

## Architecture Notes

- The perspective generation is currently mocked (`generateMockPerspective` in `perspective/page.tsx`). It is intended to be replaced with real AI API calls.
- The app's UI text is in Japanese. The `<html lang="ja">` attribute is set in the root layout.
- Pages follow a linear user flow: Home → Write → Perspective → Deep-Dive → Dictionary.
- The 11 perspective card types (A–K) are defined as constants in `src/types/index.ts`.

## Environment Variables

Required in `.env.local` (not committed):
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous/public API key
