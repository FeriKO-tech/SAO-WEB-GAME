# SAO Web Game — Next Level Rewrite Plan (2026)

> Paste this into Antigravity IDE as context before starting any phase.
> Work phase by phase — never skip ahead.

---

## Current Stack (what we have)

| Layer | Current |
|-------|---------|
| Framework | Vanilla HTML + TypeScript + Vite MPA |
| Styling | Custom CSS + CSS Variables |
| i18n | Custom engine (`src/lib/i18n.ts`) |
| Validation | Custom (`src/lib/validators.ts`) |
| Auth | Firebase Auth ✅ |
| Database | Cloud Firestore ✅ |
| Functions | Firebase Cloud Functions ✅ |
| Hosting | Firebase Hosting |
| Testing | Playwright |

---

## New Stack (where we're going)

| Layer | New | Status |
|-------|-----|--------|
| Framework | **Next.js 15** (App Router, SSR/SSG) | 🆕 new |
| Language | TypeScript 5 strict | ✅ keep |
| Styling | **Tailwind CSS v4** | 🆕 new |
| Components | **shadcn/ui** | 🆕 new |
| i18n | **next-intl** (8 locales) | 🆕 new |
| Validation | **React Hook Form + Zod** | 🆕 new |
| Server state | **TanStack Query v5** | 🆕 new |
| Auth | Firebase Auth | ✅ keep |
| Database | Cloud Firestore | ✅ keep |
| Functions | Firebase Cloud Functions | ✅ keep |
| Hosting | **Vercel** (free tier) | 🆕 new |
| Testing | Playwright | ✅ keep |

---

## Architecture — Data Flow

```
Browser
  └── Next.js App Router
        ├── Server Component (SSR/SSG) ──→ Firestore (server-side read)
        ├── Client Component ──→ TanStack Query ──→ Firebase SDK ──→ Firestore realtime
        └── API Route ──→ Firebase Cloud Function ──→ Discord / Email
```

---

## Project Structure

```
sao-web-next/
├── app/
│   ├── [locale]/                    # next-intl — ru/en/de/fr/pl/es/cz/it
│   │   ├── page.tsx                 # / homepage (SSG)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forum/
│   │   │   ├── page.tsx             # Forum list (SSR)
│   │   │   └── [threadId]/page.tsx  # Thread page (SSR + SEO)
│   │   ├── news/page.tsx            # News (ISR revalidate: 300)
│   │   ├── support/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── my-tickets/page.tsx
│   │   ├── admin-tickets/page.tsx
│   │   ├── auth-action/page.tsx
│   │   ├── terms/page.tsx
│   │   └── privacy/page.tsx
│   ├── api/
│   │   ├── tickets/route.ts         # POST → Firestore supportTickets/
│   │   └── waitlist/route.ts        # POST → Firestore waitlist/
│   ├── layout.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/                          # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── EntryOverlay.tsx
│   └── features/
│       ├── auth/
│       ├── forum/
│       ├── support/
│       └── news/
├── lib/
│   ├── firebase.ts                  # copy from old project unchanged
│   ├── auth.ts                      # copy from old project unchanged
│   └── schemas.ts                   # Zod validation schemas
├── messages/                        # next-intl translation files
│   ├── ru.json
│   ├── en.json
│   ├── de.json
│   ├── fr.json
│   ├── pl.json
│   ├── es.json
│   ├── cz.json
│   └── it.json
├── public/                          # keep as-is (hero video, images, favicon)
├── functions/                       # keep as-is (Firebase Cloud Functions)
├── tests/                           # keep as-is (Playwright)
├── middleware.ts                     # next-intl locale routing
├── i18n.ts                          # next-intl config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                       # VITE_ vars → NEXT_PUBLIC_
```

---

## Environment Variables

Rename all `VITE_*` variables to `NEXT_PUBLIC_*`:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Known Bugs to Fix During Migration

### P0 — Fix immediately (blocking users)

1. **Support tickets go nowhere** — currently saved only to `localStorage`.
   - Fix: Write to Firestore `supportTickets/` via `/api/tickets` route.
   - Add Cloud Function on-create → Discord webhook + email to support inbox + auto-reply to user.

2. **Play Now button leads nowhere** — users bounce.
   - Fix: Open modal "Game coming soon — leave your email" → write to Firestore `waitlist/`.
   - Add micro-copy to hero: "Open Beta — 2026" to set expectations.

### P1 — Quick wins (do during relevant phase)

3. **No `returnTo` after login** — users lose context (e.g. came from a forum thread).
   - Fix: Add `?returnTo=/forum/thread/ID` to all login links. Handle redirect on success.

4. **No welcome toast after login** — feels cold.
   - Fix: Show `"Welcome back, {displayName}!"` toast after successful sign-in (all 8 languages).

5. **Entry overlay can't be skipped by returning users**.
   - Fix: Add "Don't show again" checkbox → `localStorage.setItem('skipOverlay', 'true')`.

### P2 — Plan separately

6. No shop / donations page.
7. Forum thread routing — confirm threads open correctly.
8. No inline "Login to reply" CTA in forum threads for guests.
9. Delete account has no cooldown / grace period.

---

## Migration Phases

### Phase 0 — Bootstrap (1–2h)

**Goal:** Working Next.js project deployed to Vercel. Nothing visible yet.

**Tasks:**
- `npx create-next-app@latest sao-web-next --typescript --app`
- Install Tailwind CSS v4
- Install and init shadcn/ui — add: Button, Input, Dialog, Toast, Form
- Install next-intl, configure middleware.ts for 8 locales
- Install TanStack Query v5, React Hook Form, Zod
- Copy `lib/firebase.ts` and `lib/auth.ts` from old project unchanged
- Rename env vars from `VITE_*` to `NEXT_PUBLIC_*`
- Deploy to Vercel — confirm CI pipeline works

**Prompt:**
```
Bootstrap a Next.js 15 project (App Router, TypeScript strict) named sao-web-next.
Install and configure:
- Tailwind CSS v4
- shadcn/ui (components: Button, Input, Dialog, Toast, Form, Badge)
- next-intl with locales [ru, en, de, fr, pl, es, cz, it], default locale ru
- TanStack Query v5
- React Hook Form + Zod
Copy lib/firebase.ts and lib/auth.ts from the existing project unchanged.
Rename all VITE_* env vars to NEXT_PUBLIC_* in the config.
Create the full folder structure as specified in the architecture doc.
Deploy to Vercel. Show the final folder structure.
```

---

### Phase 1 — Homepage (3–5h)

**Goal:** index.html fully migrated. Play Now modal working (P0 fix).

**Tasks:**
- Migrate `index.html` + `src/pages/home.ts` → `app/[locale]/page.tsx` (static generation)
- Rebuild hero section with Tailwind — keep cinematic video background
- **Fix P0:** Play Now → Dialog component with email input → POST `/api/waitlist` → Firestore `waitlist/`
- Add micro-copy "Open Beta — 2026" in hero
- Features section (6 cards), footer — all localized via next-intl
- Mobile-lite: disable video + snap-scroll on ≤768px (same logic as before)
- Entry overlay with "Don't show again" checkbox → localStorage (**Fix P1 #5**)
- Add `next/image` for all images, `next/font` for fonts

**Prompt:**
```
Migrate the homepage (index.html + src/pages/home.ts) to app/[locale]/page.tsx as a Next.js static page (generateStaticParams for all 8 locales).

Rebuild with Tailwind CSS and shadcn/ui:
- Cinematic hero section with background video (disable on mobile ≤768px)
- Entry overlay with "Don't show again" checkbox that sets localStorage skipOverlay=true
- Play Now button opens a shadcn Dialog with email input field
  → on submit: POST to /api/waitlist → write to Firestore `waitlist/` collection
  → show success toast "You're on the list!"
- Add hero subtitle "Open Beta — 2026" below the main CTA
- 6 feature cards section
- Footer with navigation links

All text must use next-intl useTranslations hook.
Add og:title, og:description metadata using Next.js metadata API.
```

---

### Phase 2 — Auth pages (2–4h)

**Goal:** Login + Register fully working with returnTo support (P1 fix).

**Tasks:**
- Migrate `login.html` → `app/[locale]/login/page.tsx`
- Migrate `register.html` → `app/[locale]/register/page.tsx`
- Replace custom `validators.ts` with Zod schemas in `lib/schemas.ts`
- Use React Hook Form for all form state
- **Fix P1 #3:** Read `?returnTo` query param → redirect after successful login
- **Fix P1 #4:** Show welcome toast `"Welcome back, {displayName}!"` after sign-in
- Google sign-in button
- Forgot password flow
- Migrate `auth-action.html` → `app/[locale]/auth-action/page.tsx`

**Prompt:**
```
Migrate login.html and register.html to Next.js pages.

Requirements:
- Use React Hook Form + Zod for all form validation (replace old validators.ts)
- Read ?returnTo= query param on login page — after successful login redirect to that URL
- After successful sign-in show shadcn Toast: "Welcome back, {displayName}!" (localized)
- Include Google sign-in button using Firebase Auth signInWithPopup
- Forgot password link → sendPasswordResetEmail
- Migrate auth-action.html to app/[locale]/auth-action/page.tsx
  (handles ?mode=resetPassword|verifyEmail|recoverEmail with Firebase oobCode)
- All text via next-intl, all 8 languages
```

---

### Phase 3 — Support system (4–6h)

**Goal:** Tickets actually reach support. P0 critical bug fixed.

**Tasks:**
- Migrate `support.html` → `app/[locale]/support/page.tsx`
- Create `app/api/tickets/route.ts` — validate with Zod, write to Firestore `supportTickets/`
- Firebase Cloud Function `onTicketCreate`:
  - Send Discord webhook with ticket details
  - Send email to support inbox
  - Send auto-reply email to user: "We received your ticket #{id}"
- Migrate `my-tickets.html` → `app/[locale]/my-tickets/page.tsx`
- Migrate `admin-tickets.html` → `app/[locale]/admin-tickets/page.tsx`

**Prompt:**
```
Migrate the support system — this is a P0 bug fix (tickets currently only save to localStorage).

Tasks:
1. Migrate support.html to app/[locale]/support/page.tsx with FAQ accordion + ticket form
2. Create API route app/api/tickets/route.ts:
   - Validate request body with Zod
   - Write ticket to Firestore `supportTickets/` with fields: userId, email, category, subject, message, attachmentUrl, status: 'open', createdAt
3. Add Firebase Cloud Function `onTicketCreate` (onCreate trigger on supportTickets):
   - POST to Discord webhook with ticket summary
   - Send email to support inbox with full ticket details
   - Send auto-reply email to ticket submitter: "We received your ticket #ID, we'll respond within 24h"
4. Migrate my-tickets.html → shows current user's tickets with real-time Firestore subscription
5. Migrate admin-tickets.html → staff view, update ticket status, internal notes

All forms use React Hook Form + Zod. All text via next-intl.
```

---

### Phase 4 — Forum + News (4–6h)

**Goal:** Forum SEO-friendly, thread context preserved on login.

**Tasks:**
- Migrate `forum.html` → `app/[locale]/forum/page.tsx` (SSR)
- Create `app/[locale]/forum/[threadId]/page.tsx` — server-rendered for SEO
- **Fix P2:** Add inline "Login to reply" CTA → `/login?returnTo=/forum/thread/{id}`
- Migrate `news.html` → `app/[locale]/news/page.tsx` with ISR (revalidate: 300)
- Add Open Graph meta tags to forum threads and news articles
- Add `next/link` prefetching for navigation

**Prompt:**
```
Migrate forum and news pages.

Forum:
- app/[locale]/forum/page.tsx — SSR, loads categories + recent threads from Firestore
- app/[locale]/forum/[threadId]/page.tsx — SSR, renders thread + replies
  - Add metadata: og:title, og:description per thread
  - For guests: show inline "Login to reply →" banner linking to /login?returnTo=/forum/[threadId]
  - For logged-in users: show reply form (React Hook Form + Zod)
- Keep staff controls: publicVisible and postingEnabled flags from Firestore settings

News:
- app/[locale]/news/page.tsx — ISR with revalidate: 300 seconds
- Each article has og:title, og:description, og:image metadata
- Structured data (JSON-LD) for articles (improves Google Search appearance)

All text via next-intl.
```

---

### Phase 5 — Remaining pages + Go Live (3–5h)

**Goal:** 100% migrated. Custom domain on Vercel. Firebase Hosting off.

**Tasks:**
- Migrate `settings.html` → `app/[locale]/settings/page.tsx`
- Migrate `terms.html`, `privacy.html` → static pages
- Create `app/not-found.tsx` (replaces 404.html)
- Final Lighthouse audit — target 95+ on all metrics
- Switch custom domain from Firebase Hosting to Vercel
- Disable Firebase Hosting
- Update AGENTS.md with new stack

**Prompt:**
```
Finalize the migration:

1. Migrate settings.html to app/[locale]/settings/page.tsx
   - Profile section: update displayName, photoURL (Firebase Storage upload)
   - Account section: change email, change password, delete account (with confirmation dialog)
   - Preferences: language switcher (next-intl locale change)

2. Migrate terms.html and privacy.html as static Next.js pages with metadata

3. Create app/not-found.tsx with a styled 404 page and link back to homepage

4. Run a full Lighthouse audit in incognito mode. Fix any score below 90.
   Focus on: LCP < 2.5s, TBT < 200ms, CLS = 0

5. Configure the custom domain on Vercel:
   - Show me the DNS records to update
   - Confirm HTTPS + HSTS headers are set in next.config.ts

6. After domain switch confirmed working — help me disable Firebase Hosting.
```

---

## Performance Targets

| Metric | Current | Target |
|--------|---------|--------|
| Performance | 88 | 95+ |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |
| LCP | 0.8s | < 1.2s |
| TBT | 490ms | < 150ms |
| CLS | 0 | 0 |

---

## Rules for Antigravity During Migration

- Never import Firebase SDK directly in page components — always use `lib/firebase.ts` and `lib/auth.ts`
- Never hardcode colors — use Tailwind classes only
- Never hardcode UI text — always use `useTranslations()` from next-intl
- Never use `console.log` — use toast notifications for user feedback
- Always use `next/image` for images (automatic optimization)
- Always use `next/link` for internal navigation (prefetching)
- Server Components by default — add `"use client"` only when needed (event handlers, hooks, Firebase realtime)
- All form validation through Zod schemas in `lib/schemas.ts`
- All Firestore writes from client go through `/api/` routes for security
- Run `npm run typecheck` before marking any phase as done

---

*Last updated: May 2026. Keep this file in the repo root as MIGRATION.md.*
