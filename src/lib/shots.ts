/* Finds the screenshots of a project in src/assets/projects/<slug>/. See src/content.config.ts for the naming rules. */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}', { eager: true });

export type Shots = { desktop?: ImageMetadata; mobile?: ImageMetadata; mobile2?: ImageMetadata; extra: ImageMetadata[] };

export function getShots(slug: string): Shots {
  const shots: Shots = { extra: [] };
  Object.entries(files)
    .filter(([path]) => path.split('/').at(-2) === slug)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([path, mod]) => {
      const name = path.split('/').at(-1)!.replace(/\.[^.]+$/, '').toLowerCase();
      if (name === 'desktop') shots.desktop = mod.default;
      else if (name === 'mobile') shots.mobile = mod.default;
      else if (name === 'mobile-2') shots.mobile2 = mod.default;
      else shots.extra.push(mod.default);
    });
  return shots;
}
