/**
 * Colour themes. The colours themselves live in src/styles/global.css (one block per theme).
 * Try them live: footer swatches, or `theme <name>` in the terminal (Ctrl/Cmd + K).
 * When you have picked one, set DEFAULT_THEME to it. To remove a theme, delete it here and in global.css.
 */
export const DEFAULT_THEME = 'velvet';

export const themes = [
  { id: 'velvet', name: 'Velvet', note: 'Black tie: velvet black, brass and ivory', bg: '#130d10', accent: '#c8a061' },
  { id: 'midnight', name: 'Midnight', note: 'Midnight-blue tuxedo: navy, ice white and azure, with a lime spark', bg: '#0a0f1d', accent: '#7cb7ff' },
  { id: 'aurora', name: 'Aurora', note: 'Plum black and soft violet with a lime terminal - the AI and voice side', bg: '#120c1c', accent: '#b79cff' },
  { id: 'graphite', name: 'Graphite', note: 'Neutral dev-tool grey with one loud lime accent', bg: '#0f1113', accent: '#c6f432' },
  { id: 'ember', name: 'Ember', note: 'Warm charcoal, sand and salsa red', bg: '#150d0c', accent: '#ff6a55' },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
