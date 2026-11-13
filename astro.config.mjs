// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The repo is <username>.github.io, so the site lives at the domain root and no `base` is needed.
// If you later add a custom domain, change `site` and add public/CNAME.
export default defineConfig({
  site: 'https://fariskarkelja.github.io',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
});
