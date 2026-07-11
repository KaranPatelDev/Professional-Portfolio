# Implementation Plan — Karan Patel Portfolio

Concrete build plan derived from `karan-patel-portfolio-plan.md` (strategy doc), with all previously-open facts resolved.

## Confirmed facts (was Section 38 in strategy doc)

- **Stack decision:** FastAPI backend from day one (not deferred to v2) — user's explicit call.
- **Availability:** Open to full-time roles + freelance work.
- **Contact email:** `mpkaranpatel001018@gmail.com`
- **Domain:** `karanpateldev.indevs.in` (subdomain on your existing indevs.in domain).
- **D&D Purchase stack:** React + TS frontend, Node.js + Express + TS backend, MongoDB, Firebase Auth, Firebase hosting. Under NDA — only general purpose, role, high-level architecture, and tech stack may be shown publicly; no client-confidential info, source code, DB structure, credentials, or unsanitized screenshots.

Still genuinely open (not blocking the build, just content to fill in later): Magenta Connects confidentiality boundaries, PayGuard AI status, professional photo, contact-form response-time commitment, contact-data retention window, any extra freelance projects.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | FastAPI (Python) — contact form, availability status, resume-download tracking, projects/case-studies API |
| Database | PostgreSQL (Neon free tier) |
| Content | Fully DB-backed (Postgres) — no MDX. All project/case-study/homepage copy is editable via the admin panel (see below); rich-text fields store sanitized HTML from TipTap |
| Auth (admin) | Session-based auth, single hardcoded admin user — full custom admin panel built from day one (see "Admin Panel (CMS)" below) |
| Email | Resend (contact-form notification emails to `mpkaranpatel001018@gmail.com`) |
| Hosting | Vercel (frontend) + Railway or Render (FastAPI backend) |
| Analytics | Vercel Analytics (privacy-friendly, zero setup) |
| Fonts/Icons | Space Grotesk + Inter + JetBrains Mono (`next/font`), Lucide icons |
| Rich text editor | TipTap (React) — used only in the admin panel for case-study/copy editing |
| Image uploads | Cloudinary free tier — admin-panel image uploads for project thumbnails/screenshots |

No Redis, Celery, Sentry, or third-party headless CMS in MVP — the custom admin panel below replaces the need for one.

## Repo layout

```
E:\Portfolio
├── frontend/          # Next.js app
│   ├── app/
│   │   ├── admin/       # protected admin panel route group (login, projects, experience, testimonials, services, content, availability, resume, contact-requests)
│   │   └── ...          # public site routes
│   ├── components/
│   └── ...
└── backend/            # FastAPI app
    ├── app/
    │   ├── main.py
    │   ├── routers/     # contact, availability, resume, projects, experience, testimonials, services, content, admin_auth
    │   ├── models.py    # SQLAlchemy models
    │   └── schemas.py   # Pydantic schemas
    └── ...
```

## Data Model (expanded for admin-editable content)

Builds on the strategy doc's Section 25 tables, expanded so everything the admin panel needs to edit has a place to live — no per-feature schema surprises later:

| Table | Key fields | Notes |
|---|---|---|
| `projects` | slug, title, category, tags (Client Work/Personal/AI Experiment), status, summary, role, stack[], thumbnail_url, gallery_urls[], live_url, github_url, featured (bool), display_order, body_html, metrics (jsonb) | `body_html` is TipTap output, sanitized server-side (DOMPurify) before save |
| `experience` | company, role, start_date, end_date, summary, metrics[], tools[], body_html | body_html is the free-form narrative part |
| `testimonials` | project_id, quote, author, permission_granted | unchanged from strategy doc |
| `services` | name, client_problem, deliverable, stack, proof, public (bool), display_order | new table, mirrors strategy doc Section 15 |
| `site_content` | key (unique), label, value_html, page | new generic key/value table for homepage/about copy (hero headline, supporting copy, bio, freelance pitch, social bio) — avoids a schema migration every time a new copy block needs to be editable |
| `availability` | status_text, updated_at | unchanged — dedicated table since it has its own API endpoint |
| `resume` | file_url, updated_at | single row, file_url comes from Cloudinary/admin upload |
| `contact_requests` | unchanged from strategy doc | private, admin-viewable only |

All rich-text (`body_html`, `value_html`) is sanitized on save even though it's single-user input — cheap insurance, non-negotiable per the security rules already in the strategy doc (Section 34).

## Admin Panel (CMS)

**Why:** the user adds projects frequently and wants zero code changes/redeploys for content updates — everything on the site (projects, experience, homepage copy, services, testimonials, availability, resume) is editable from `/admin`.

**Where it lives:** inside the same Next.js app as a protected `/admin` route group, calling the same FastAPI backend for all CRUD — not a separate app/deployment.

**Auth:** single hardcoded admin user (credentials in env vars, hashed password). FastAPI issues an httpOnly secure session cookie on `POST /api/admin/login`. Next.js middleware checks the session before rendering any `/admin/*` route. Login is rate-limited with lockout after repeated failures (already planned in Section 34 of the strategy doc). `/admin` is disallowed in `robots.txt` and marked `noindex`.

**Admin routes:**
- `/admin/login`
- `/admin` — dashboard (quick links, recent contact-request count)
- `/admin/projects` — list, create, edit, delete, toggle featured, reorder
- `/admin/experience` — edit entries
- `/admin/testimonials` — list/create/edit, toggle permission_granted
- `/admin/services` — list/edit/reorder
- `/admin/content` — edit each `site_content` key (hero headline, bio, freelance pitch, social bio, etc.)
- `/admin/availability` — edit status text
- `/admin/resume` — upload a new resume PDF (replaces current)
- `/admin/contact-requests` — view/delete submissions

**Editor:** TipTap (React) for every rich-text field — toolbar limited to bold/italic/links/headings/lists/images, not a full page-builder.

**Images:** admin picks a file → uploaded client-side to Cloudinary (unsigned upload preset, free tier) → the returned `secure_url` is saved on the relevant record via the FastAPI CRUD endpoint. No separate media-library table — Cloudinary's own dashboard is the asset library.

**Instant updates, no webhook needed (as built):** every public page fetches from the FastAPI API with `cache: "no-store"` — pages are server-rendered on each request rather than cached at all. At a portfolio's traffic volume this is simpler than wiring `revalidatePath()`/Server Actions and gives the same result: an admin save is visible on the very next page load, with zero extra plumbing.

**Cross-origin session cookie:** since the admin panel (Next.js, one domain) and the API (FastAPI, a different domain) are separate deployments, the session cookie is issued with `SameSite=None; Secure` rather than the usual `Lax` — required for the browser to send it on cross-origin fetches. A consequence: Next.js Server Components/Proxy (middleware) running on the frontend's own domain can never see this cookie (cookies are domain-scoped), so admin auth is enforced by a client-side `AdminGuard` component (`components/admin/AdminGuard.tsx`) that calls `GET /api/admin/me` on mount and redirects to `/admin/login` on 401 — not by Next.js middleware/proxy. All `/admin/*` pages are client components for this reason.

## Build order (maps to Section 35 roadmap, backend pulled forward)

1. **Scaffold** — `git init`, Next.js app in `frontend/`, FastAPI app in `backend/`, Tailwind config with the Section 6 design tokens, base layout/nav/footer.
2. **Backend core** — Postgres schema (the expanded Data Model above: projects, experience, testimonials, services, site_content, availability, resume, contact_requests), FastAPI routers matching Section 26's API plan plus admin CRUD routes, deployed to Railway/Render early so the frontend can hit a real API from the start.
3. **Admin panel** — `/admin` login + auth middleware, CRUD screens for projects/experience/testimonials/services/content/availability/resume, TipTap editor, Cloudinary upload flow, Server-Action-based instant revalidation. Built early so every public page below is populated through it, not hardcoded and migrated later.
4. **Homepage** — Hero, proof strip, experience preview, featured work, stack, freelance CTA, footer (Section 8–9), reading from `/api/availability` and `site_content`.
5. **Experience page** — Magenta Connects section (Section 10), placeholder-marked pending confidentiality confirmation, editable via `/admin/experience`.
6. **Projects** — index + D&D Purchase full case study (Section 12, now with confirmed stack/NDA boundaries) + 2 more full case studies (AI Product Manager, Rapid Code Insight or Invoice Recovery) + remaining project cards — all populated via `/admin/projects`.
7. **Freelance / Work-With-Me** — Services (from `/admin/services`), process, inquiry form posting to `/api/contact`.
8. **Contact + Resume** — contact form (honeypot + rate limit), resume download tracked via `/api/resume/track`, resume file managed via `/admin/resume`.
9. **Polish pass** — responsive check, accessibility pass, Lighthouse 90+, SEO metadata/schema, verify all links.
10. **Domain hookup** — add `karanpateldev.indevs.in` as a custom domain in Vercel, add the CNAME record it gives you in wherever `indevs.in`'s DNS is managed.

Command palette, About page, and everything else in Section 36's "Later" bucket (Engineering Lab, System Design, Build Log, AI assistant) stay deferred — the admin dashboard item in that list is now superseded and pulled into the MVP per this plan.

## Status (as of this build session)

Steps 1–8 are built and smoke-tested against the real Neon/Cloudinary/Gmail credentials:
- Backend: all tables live on Neon, full CRUD + admin auth + contact form (SMTP) + Cloudinary uploads, verified via curl (login/logout/401 cases, CORS, cookie flags).
- Seed script (`backend/scripts/seed.py`) populates real confirmed content: D&D Purchase case study, Magenta Connects experience, homepage copy blocks, services — safe to re-run.
- Frontend: `npm run build` passes clean; homepage, experience, projects index + `[slug]` case study, work-with-me, contact, resume all render against live data end-to-end (verified via `curl` against the dev server).
- Admin panel: login, dashboard, and full CRUD screens for projects/experience/testimonials/services/site content/availability/resume/contact-requests, with TipTap rich-text editing and Cloudinary image upload.

**Not yet done:** step 9 (polish pass — Lighthouse, full accessibility/responsive pass) and step 10 (deployment + domain hookup), since deployment requires the user's own Vercel/Railway/Render account login. See `README.md` for the deployment steps once those accounts are connected.

**Not verified:** the admin login flow through an actual browser (cross-origin cookie behavior was verified via `curl` with `Origin` headers + checking `Set-Cookie`/CORS response headers, but not a real browser session). Worth a manual click-through once running locally.

## Verification

- `npm run build` (frontend) and `uvicorn` smoke test (backend) — done.
- Manual click-through of every nav link and CTA — still pending (recommend before calling MVP fully done).
- Lighthouse run on homepage + one case study page — pending, part of the polish-pass step.
- Contact form tested end-to-end (submission → DB row → email notification) — done. A real submission was posted, saved to Postgres, the Gmail SMTP notification sent with no errors logged, then the test row was deleted from `contact_requests`.
