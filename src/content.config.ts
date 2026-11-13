import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects / case studies. One Markdown file per project in src/content/projects/.
 *
 * SCREENSHOTS are picked up automatically from src/assets/projects/<file name without .md>/
 *   desktop.jpg   -> shown on the 3D laptop
 *   mobile.jpg    -> shown on the 3D phone
 *   mobile-2.jpg  -> optional second phone (for mobile apps)
 *   anything else -> extra images in the gallery on the project page
 * (.png and .webp work too.) No desktop.jpg = phone-only mockup, no mobile.jpg = laptop only.
 *
 * - `featured`: a number puts the project on the home page (1 = first). Leave it out to show it only on /work.
 * - `caseStudy: false`: no detail page, the card links straight to the live site or the repo.
 * - `todo`: notes for yourself about missing info. Run `npm run todo` to list them all.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string(),
    year: z.string(),
    role: z.string(),
    context: z.string(),
    categories: z.array(z.enum(['Web', 'Full-stack', 'Mobile', 'AI', 'Freelance', 'Systems', 'Team'])),
    stack: z.array(z.string()).default([]),
    featured: z.number().optional(),
    order: z.number().default(100),
    caseStudy: z.boolean().default(true),
    highlights: z.array(z.string()).default([]),
    links: z
      .object({
        live: z.url().optional(),
        repo: z.url().optional(),
        extra: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
        note: z.string().optional(),
      })
      .default({ extra: [] }),
    todo: z.array(z.string()).default([]),
  }),
});

export const collections = { projects };
