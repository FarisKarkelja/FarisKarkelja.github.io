/* Theme switching. The <html data-theme> attribute selects a block of CSS variables in global.css. */
import { themes, DEFAULT_THEME, type ThemeId } from '../data/themes';

const KEY = 'fk-theme';

export const themeIds = themes.map((t) => t.id) as readonly string[];

export function getTheme(): string {
  return document.documentElement.dataset.theme || DEFAULT_THEME;
}

export function setTheme(id: string): boolean {
  if (!themeIds.includes(id)) return false;
  document.documentElement.dataset.theme = id;
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* private mode: the theme simply isn't remembered */
  }
  const bg = themes.find((t) => t.id === (id as ThemeId))?.bg;
  if (bg) document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg);
  window.dispatchEvent(new CustomEvent('themechange', { detail: id }));
  return true;
}

/** Read a colour token (e.g. "--accent") as it is right now. */
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
