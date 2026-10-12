# Landing Page Hierarchy

Single-page Next.js portfolio (`src/app/page.tsx`). Goal: a hiring manager / client should understand **who you are → what you can do → proof → how to reach you** in one scroll.

## Section order

| # | Section | id | Component | Purpose | Status |
|---|---------|----|-----------|---------|--------|
| 0 | Preloader | – | `PortraitLoader` | Portrait outline intro, hands off to Hero | keep |
| 1 | Hero | `hero` | `Hero` | Name, rotating roles, portrait, CTAs (Resume / GitHub / LinkedIn / Contact) | keep |
| 2 | About | `about` | `About` | "Hi, I'm Zaeem" — 2–3 line story, years of experience, what you build | keep (light theme) |
| 3 | Skills | `skills` | `Skills` | Stack grouped: Languages, Frameworks, DB, CMS, AI Agents, Tools | keep |
| 4 | Projects | `projects` | `Project` | 8 case studies (BookMySpot, SquareOne, Lexnis, Recrot, VaultSneaks…) — strongest proof | **move up** |
| 5 | Experience | `experience` | `Experience` | Innovative Widget, Oct-2024 → present | keep |
| 6 | How I Work | `how-i-work` | `HowIWork` | Understand → Plan → Build → Ship | **move down** |
| 7 | Education & Certifications | `education` | `Education` | BSCS, Cloud Applied GenAI Engineer, Web Engineering | keep |
| 8 | Contact | `contact` | `Contact` | Form → `/api/contact` (nodemailer) | keep |
| 9 | Footer | – | `Footer` | Social icons + copyright | keep |
| – | Global | – | `BackToTop`, `Cursor`, `SmoothScroll`, `Navbar` | Utilities; Navbar currently commented out | see notes |

## Why this order

1. **Hero → About**: identity first, then a human hook.
2. **Skills → Projects → Experience**: claim, then proof of the claim, then where it was used professionally. Moving Projects directly after Skills keeps the strongest content high; right now "How I Work" sits between and delays it.
3. **How I Work after Experience**: a process section reads best once the visitor already trusts the work. It is also the lowest-signal section for a quick skim.
4. **Education late**: lowest priority for a developer hiring decision; stays above Contact as a credibility closer.
5. **Contact last**: the single conversion point; Hero also has a CTA so there are two entry paths.

Recommended `page.tsx` order:

```
PortraitLoader
Hero → About → Skills → Projects → Experience → HowIWork → Education → Contact
Footer, BackToTop
```

## Gaps (optional, only add if you have the content)

- **Testimonials / client quotes** — between Experience and How I Work. Skip until you have real quotes.
- **Stats strip** (years, projects shipped) — fold into About instead of a new section.
- **Services / "What I do"** — only if freelancing; otherwise Skills + About already cover it.

## Fixes found while analyzing

- `Navbar` is commented out in `page.tsx`, so `navlinks` in `data.tsx` is unused. Either re-enable it or delete it. Anchor order must match the order above if re-enabled (About, Skills, Projects, Experience, How I Work, Education, Contact).
- `navlinks` currently omits **Contact**; add it (it is the main CTA).
- Duplicate ids: `page.tsx` wraps each component in `<section id="…">` and `Skills`, `Experience`, `Education`, `Contact`, `Project`, `About`, `HowIWork` render the same id again inside. Duplicate ids break anchor scrolling/a11y; keep it in one place (the wrapper in `page.tsx`).
- `Project` and `Experience` render nested `<section>`s inside the wrapper `<section>`; switch inner ones to `<div>`.
- Theme: About is light (`bone-bg`) while Skills/HowIWork use dark/white-text styling. Group light sections together and dark sections together (or use a deliberate light→dark transition after About) to avoid jarring flips.
