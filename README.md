# fariskarkelja.github.io

Personal portfolio of **Faris Karkelja**, full-stack software engineer from Sarajevo.

Live: https://fariskarkelja.github.io

Built with [Astro](https://astro.build), TypeScript, [Three.js](https://threejs.org), [GSAP](https://gsap.com) ScrollTrigger and [Lenis](https://lenis.darkroom.engineering). Deployed to GitHub Pages with GitHub Actions.

## Run it locally

Needs Node.js 22.23.4 or newer.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run todo      # list every placeholder that still needs real content
```

## Where the content lives

Everything is data, so you never need to touch the components to update the site.

| What | Where |
| --- | --- |
| Name, bio, contact, hero status card, experience, education, toolkit, certificates, volunteering | `src/data/profile.ts` |
| Projects and case studies (one file each) | `src/content/projects/*.md` |
| Project screenshots for the 3D laptop and phone | `src/assets/projects/<project>/desktop.jpg` and `mobile.jpg` |
| Dance section: lessons per count, selected performances, full list | `src/data/stage.ts` |
| Dance photos | `src/assets/photos/stage/` |
| Certificates (text list, copies on request) | `src/data/profile.ts` (certificates) |
| Portrait photos | `src/assets/photos/portrait/` |
| Colour themes | `src/styles/global.css` (colours) and `src/data/themes.ts` (list and default) |
| CV PDF behind every "Download CV" button | `public/cv/Faris_Karkelja_CV_en.pdf` |
| Social preview image | `public/og.jpg` |

**Replacing a placeholder image:** overwrite the file with the same name. `.png` and `.webp` work too (delete the `.jpg` in that case). Astro resizes and converts everything at build time.

**Adding a project:** copy a file in `src/content/projects/`, change the frontmatter, and add a folder with the same name in `src/assets/projects/` containing `desktop.jpg` and/or `mobile.jpg` (`mobile-2.jpg` adds a second phone, any other image goes into the gallery). `featured: 1-4` puts it on the home page; `caseStudy: false` links the card straight to the live site or the repo.

**Picking a theme:** try them with the swatches in the footer or `theme <name>` in the terminal, then set `DEFAULT_THEME` in `src/data/themes.ts`.

## What is in it

- Curtain intro on the first visit of a session (skippable, never shown with reduced motion)
- Hero: a Three.js signal field and a status card that types itself and opens the terminal
- Terminal: `Ctrl/Cmd + K` or the backtick key, with autocomplete (`Tab`), themes and a few easter eggs
- Selected work: a pinned, realistic three.js laptop and phone (real proportions, PBR materials, one shared WebGL context for the whole page) that switch screens as you scroll; screenshots: desktop 1440x900, mobile 390x844
- The Stage: two stylized dancers built and animated in code (inverse kinematics, no recordings), dancing one bar of salsa as you scroll - counts 1-2-3, pause, 5-6-7, pause
- Five colour themes, switchable live
- `prefers-reduced-motion` respected everywhere, keyboard accessible, JSON-LD `Person`, sitemap, Open Graph

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`. In the repository settings, **Settings > Pages > Source** must be set to **GitHub Actions**.

## Credits

Icons: [Feather](https://feathericons.com) (MIT) and [Simple Icons](https://simpleicons.org) (CC0). Signature outlines generated from the font Mr De Haviland (SIL Open Font License). Typefaces: Bodoni Moda, IBM Plex Sans and IBM Plex Mono (SIL Open Font License).
