# Lumen – SaaS Landing Page

A responsive landing page for **Lumen**, an invented shared-inbox product for customer support teams.
Built for the Sankar Group Front-End Development Internship assignment.

- **Live demo:** _add your deployed link here_
- **Technologies:** HTML5, CSS3 (custom properties, Grid, Flexbox, `backdrop-filter`, `@property`), vanilla JavaScript (ES6). No frameworks, build step or dependencies. The Inter web font is loaded from Google Fonts and falls back to the system font when offline.

## Run locally

No installation needed.

1. Download or clone this folder.
2. Open `index.html` in any modern browser (double-click it).

Optional, to serve it on a local address:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
lumen/
├── index.html        # Page structure and content
├── css/style.css     # All styling (tokens, layout, components, responsive rules)
├── js/script.js      # Interactions (nav, pricing toggle, modal, form validation)
├── screenshots/      # Desktop and mobile screenshots
└── README.md
```

## What's included

| Requirement | Implementation |
|---|---|
| Navigation bar | Floating glass header with logo, 4 links, "Get started" button, hamburger menu on mobile, active-section highlight, scroll-progress bar |
| Hero | Headline, description, two CTAs, social proof, and an animated product mockup (3D tilt, live-updating inbox, typing indicator, floating stat chips) built with HTML/CSS |
| Features | 7 glass cards in a bento grid with inline SVG icons, cursor-following spotlight and animated mini-visuals |
| How it works | 3 numbered steps |
| Pricing | 3 plans (Starter / Team / Business) with a working monthly/yearly toggle |
| Extras | Auto-scrolling trust-logo marquee, count-up stats band, final call-to-action panel |
| Contact + footer | Demo request form with contact details, 3-column footer |

## Interactions

- **Navigation links** smooth-scroll to their sections (with `scroll-padding-top` so headings are not hidden under the sticky header).
- **"Get started" / "Start free" / plan buttons** open a sign-up modal; the chosen plan is pre-selected. "Book a demo" and "Talk to sales" scroll to the contact form.
- **Pricing toggle** switches prices between monthly and yearly (20% off).
- **Forms** (sign-up modal and demo request) validate required fields, email format and minimum message length. Errors show under each field, focus jumps to the first invalid field, and a success message replaces the form on submit. No backend is used, so nothing is actually sent.
- **Animations:** staggered scroll-reveal, count-up stats, animated pricing numbers, rotating gradient border on the featured plan, hover light-sweep on buttons, a live inbox feed in the hero, and a 3D tilt on the product mockup. All motion is switched off for users who prefer reduced motion.
- **Responsive** layout for mobile (≈375px), tablet and desktop. Checked for horizontal overflow at 375, 768 and 1440px.
- **Accessibility basics:** semantic landmarks, skip link, labelled form fields with `aria-invalid`/`role="alert"` errors, visible focus styles, keyboard-closable modal (Esc), `prefers-reduced-motion` support.

## Screenshots

| Desktop | Mobile |
|---|---|
| `screenshots/01-desktop-hero.png` | `screenshots/02-mobile-hero.png` |
| `screenshots/05-features.png` | `screenshots/02-mobile-menu.png` |
| `screenshots/06-pricing.png` | `screenshots/mobile-full.png` |
| `screenshots/03-form-validation.png` | |
| `screenshots/04-signup-success.png` | |
| `screenshots/desktop-full.png` | |

## Design choices and challenges (short explanation)

1. I picked a support-inbox product because its story is easy to explain, and used a dark "glassmorphism" style (frosted translucent panels over a slowly drifting aurora background) with one indigo-violet-cyan accent so the page feels modern and consistent.
2. A clear type scale and a repeating section pattern (small label, heading, subtext) give each section the same visual hierarchy and spacing.
3. The hero visual is an HTML/CSS mock of the product instead of a stock image, so it stays sharp on every screen and loads instantly.
4. The layout is mobile-first: one column by default, then 2 and 3 column grids at 640px and 900px, with the nav collapsing into a hamburger menu.
5. A sticky header covered section headings after a link click; I solved it with `scroll-padding-top`, and used an `IntersectionObserver` to highlight the current section.
6. Form validation is written once as small reusable rules (`data-rules="required|email"`) so both forms share the same code, with clear messages and keyboard/screen-reader friendly errors.
7. The sign-up modal uses the native `<dialog>` element, which handles focus trapping, Esc to close and the backdrop for free; I added focus return to the button that opened it.
8. Prices live in `data-` attributes, so the monthly/yearly toggle needs no extra HTML.

## Notes

Brand name, contact details and testimonials-style content are placeholders. AI tools were used for assistance, and the code is written to be explained line by line.
# Saas-Lumen
