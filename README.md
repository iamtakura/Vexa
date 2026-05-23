# Vexa 🟣

**Real talk. Real bodies. Real sex ed.**

Vexa is a free, gamified, shame-free sex education web app inspired by Duolingo. It teaches teens (13–17) and young adults (18–25) everything they weren't taught in school — with a heavy emphasis on myth-busting, particularly dispelling misconceptions created by pornography and social media.

---

## What Is Vexa?

Most people learn about sex from porn, friends, or nowhere at all. Vexa fills that gap with medically accurate, inclusive, shame-free education delivered in short, engaging lessons — just like learning a language, but for your body and relationships.

### Core Features

- 🗺️ **World Map** — 7 worlds, 47+ lessons across anatomy, consent, sexual health, relationships, identity and more
- ⚡ **Reality Check** — daily myth-busting, with a dedicated world dismantling what porn teaches vs. what's real
- 💬 **Ask Vexa** — AI-powered chat assistant (Groq) that answers any sex ed question with zero judgment
- 🏆 **XP & Badges** — gamified progression system with streaks, levels, and milestone achievements
- 👤 **Accounts** — Supabase-powered authentication with cross-device progress sync
- 📱 **Responsive** — works on mobile, tablet, and desktop

---

## The 7 Worlds

| World | Title | Focus |
|---|---|---|
| 1 | Know Your Body | Anatomy, puberty, hormones |
| 2 | Consent & Communication | Boundaries, signals, saying no |
| 3 | Reality Check ⭐ | Porn vs. reality, media myths |
| 4 | Sexual Health | STIs, contraception, testing |
| 5 | Relationships | Healthy dynamics, red flags |
| 6 | Identity & Pleasure | Orientation, self-discovery |
| 7 | The Cycle Deep Dive | Menstrual phases, PCOS, tracking |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Routing | React Router v7 |
| State | Zustand v5 + localStorage |
| Styling | Tailwind CSS v4 + CSS variables |
| Animations | Framer Motion v12 |
| Icons | Lucide React |
| Fonts | Fredoka + Nunito (Google Fonts) |
| Auth & DB | Supabase |
| AI Chat | Groq API (llama-3.1-8b-instant) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account
- A free [Groq](https://console.groq.com) API key

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/vexa.git
cd vexa
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example env file:
```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GROQ_API_KEY=your_groq_api_key
```

**Getting your keys:**
- **Supabase:** Go to [supabase.com](https://supabase.com) → your project → Settings → API
- **Groq:** Go to [console.groq.com](https://console.groq.com) → API Keys → Create API Key (free, no payment required)

### 4. Set up the Supabase database

In your Supabase project, go to **SQL Editor** and run:

```sql
create extension if not exists "uuid-ossp";

create table public.vexa_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  username text default '',
  age_group text default '',
  motivations text[] default '{}',
  sex_ed_source text default '',
  onboarding_complete boolean default false,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_active_date text default '',
  completed_lessons text[] default '{}',
  completed_worlds text[] default '{}',
  earned_badges text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

alter table public.vexa_progress enable row level security;

create policy "Users can view own progress" on public.vexa_progress
  for select using (auth.uid() = user_id);

create policy "Users can insert own progress" on public.vexa_progress
  for insert with check (auth.uid() = user_id);

create policy "Users can update own progress" on public.vexa_progress
  for update using (auth.uid() = user_id);
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # PhoneFrame, TopBar, BottomNav, OnboardingLayout
│   ├── lesson/          # Slide components, LessonComplete, ErrorBoundary
│   ├── myths/           # MythCard
│   └── ui/              # Button
├── contexts/
│   └── AuthContext.jsx  # Supabase auth provider
├── data/
│   ├── worlds/          # 7 world data files with lesson content
│   ├── worlds.js        # Dynamic world loader
│   ├── myths.js         # 47 myth cards
│   └── badges.js        # 8 achievement badges
├── lib/
│   ├── supabase.js      # Supabase client
│   └── progressSync.js  # Cloud sync utilities
├── pages/
│   ├── auth/            # Login, Signup
│   ├── onboarding/      # 5-screen onboarding flow
│   ├── Home.jsx         # World map
│   ├── Lesson.jsx       # Lesson slide engine
│   ├── Myths.jsx        # Myth browser
│   ├── Ask.jsx          # AI chat assistant
│   └── Profile.jsx      # User profile & badges
├── store/
│   └── useVexaStore.js  # Zustand global state
└── styles/
    └── globals.css      # CSS variables, Tailwind theme
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |
| `VITE_GROQ_API_KEY` | Optional | Your Groq API key for the AI chat feature |

If `VITE_GROQ_API_KEY` is not set, users will be prompted to enter their own key when they visit the Ask tab. Keys entered by users are stored only in their browser's localStorage and are never transmitted anywhere except directly to Groq's API.

---

## Deploying to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables in the Vercel project settings
4. Deploy — Vercel auto-detects Vite and configures everything

---

## Contributing

Vexa is a passion project built to give young people the sex education they deserve. Contributions are welcome — especially:

- Additional lesson content (medically reviewed)
- Translations and localisation
- Accessibility improvements
- UI/UX refinements

Please open an issue before submitting a pull request.

---

## Content Philosophy

All content in Vexa is:
- **Medically accurate** — sourced from WHO, CDC, NHS, and peer-reviewed research
- **Shame-free** — no topic is treated as taboo or embarrassing
- **Inclusive** — covers all genders, body types, and sexual orientations
- **Age-aware** — tone adjusts based on whether the user is a teen or young adult

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgements

Content research powered by Google Gemini Deep Research. Clinical references include WHO, CDC, NHS, Planned Parenthood, and peer-reviewed publications cited within lesson content.

---

*Vexa — Everything they didn't teach you.*
