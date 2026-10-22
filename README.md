# Sakshi & Vivek — Wedding Invitation

A mobile-first digital wedding invitation built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Run `npm run typecheck` and `npm run build` to validate a production build.

## Personalize the invitation

Edit [`src/data/wedding.ts`](./src/data/wedding.ts) to add the date, event schedule, family details, venue information, licensed imagery, contact details, and any revised wording. Empty values are intentional setup placeholders; no real venues, dates, addresses, phone numbers, or family names have been fabricated.

Replace the abstract CSS image panels with owner-provided, properly licensed images by adding local assets and setting their paths in the configuration. The optional soundtrack path is `/audio/wedding-theme-placeholder.mp3`; provide an appropriately licensed audio file at that location. Music is never started until a guest opens the invitation.

## Custom assets

All custom artwork lives in `public/images/`. Paths are set in [`src/data/wedding.ts`](./src/data/wedding.ts) (`assets.logo`, `couple.portraitImage`, `story[].image`). If a file is missing, the page falls back to the decorative placeholder instead of showing a broken image.

| File | Used for | Recommended size |
| --- | --- | --- |
| `public/images/logo.png` | Replaces every S & V monogram: loading screen, palace-door cover, navigation, hero, couple frame, share section and footer | Square or near-square, 512 × 512 px, transparent background PNG |
| `public/images/Couple.png` | “A little about our hearts” framed portrait (bottom-to-top shading is applied in CSS) | Portrait 4:5, 1200 × 1500 px or larger |
| `public/images/story/OurStory1.png` | Our Story, first chapter | Landscape 4:3, 1200 × 900 px |
| `public/images/story/OurStory2.png` | Our Story, second chapter | Landscape 4:3, 1200 × 900 px |
| `public/images/story/OurStory3.png` | Our Story, third chapter | Landscape 4:3, 1200 × 900 px |

Gallery photos are optional: set `src` on the `gallery` entries (for example `/images/gallery/01.jpg`, portrait 3:4, 1200 × 1600 px). The gallery is a swipeable carousel with arrows, hover preview and a fullscreen lightbox.

Keep each image under roughly 500 KB where possible; Next.js optimizes and resizes them automatically.

Wedding date: `weddingDate` is `2026-11-21T00:00:00+05:30` and drives the countdown. Celebrations are shown as a swipeable, draggable carousel in the order of the `events` array (Satyanarayan Puja & Shagun, Mehendi, Tilak & Sangeet, Matikor & Haldi, Baraat & Pheras).

## Deploy (Vercel) and share on WhatsApp

1. Put the project on GitHub (`git init`, commit, push to a new private repository). `node_modules`, `.next` and `.env*` are already git-ignored.
2. Sign in at <https://vercel.com> with GitHub, choose **Add New → Project**, import the repository, keep the detected **Next.js** preset and click **Deploy**.
3. Under **Settings → Environment Variables** add `NEXT_PUBLIC_SITE_URL` (your final address, for example `https://sakshi-vivek.vercel.app` or your own domain). Redeploy so the WhatsApp preview image uses the absolute address.
4. Optional: **Settings → Domains** to attach a custom domain.
5. Share the link on WhatsApp. The preview card uses `public/og-image.jpg` (1200 × 630). WhatsApp caches previews, so test with a new link or add `?v=2` after changing the image.

Before sharing, replace the placeholder text in `src/data/wedding.ts` (bride and groom introductions, story dates and descriptions) and add `public/audio/wedding-theme-placeholder.mp3` if you want background music.

## Correspondence contacts

The Correspondence section is driven by `correspondence` in [`src/data/wedding.ts`](./src/data/wedding.ts). Edit `name`, `heading` and `phone` for each side, or set `photo` (for example `/images/contacts/somesh.jpg`) to replace the circular initial placeholder with a portrait. Gallery entries also need their image `width` and `height` so each photo is shown in full, without cropping.

## Search indexing and privacy

Copy `.env.example` to `.env.local`. `NEXT_PUBLIC_ALLOW_INDEXING` defaults to `false`; only set it to `true` when the invitation is intentionally ready for search engines. Set `NEXT_PUBLIC_SITE_URL` to the deployment origin to enable canonical and sitemap URLs and absolute social-sharing metadata. Never place private keys in `NEXT_PUBLIC_*` variables.

Contact numbers are hidden by default in the data configuration. Consider whether to keep venue addresses private until appropriate for your guests.
