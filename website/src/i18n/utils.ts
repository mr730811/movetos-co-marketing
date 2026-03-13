import de from './translations/de.json';
import en from './translations/en.json';
import { routeMap } from './routes';

const translations: Record<string, any> = { de, en };
export type Lang = 'de' | 'en';

/** Join base path with a sub-path, avoiding double slashes */
export function joinPath(base: string, path: string): string {
  if (base.endsWith('/') && path.startsWith('/')) {
    return base + path.slice(1);
  }
  return base + path;
}

export function getLangFromUrl(url: URL): Lang {
  const path = url.pathname;
  // Check if path contains /en/ segment (after base path)
  const segments = path.split('/').filter(Boolean);
  // In production, base is /movetos-co-marketing, so segments[0] = 'movetos-co-marketing', segments[1] might be 'en'
  // In dev, there's no base prefix, so segments[0] might be 'en'
  if (segments.includes('en')) {
    return 'en';
  }
  return 'de';
}

export function t(lang: Lang, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  for (const k of keys) {
    value = value?.[k];
  }
  return value ?? key;
}

export function getLocalizedPath(path: string, lang: Lang, base: string): string {
  // Strip base from path
  let cleanPath = path.startsWith(base) ? path.slice(base.length) : path;
  if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

  if (lang === 'de') {
    // If currently on EN page, map back to DE
    if (cleanPath.startsWith('/en/')) {
      const enPath = cleanPath.slice(3); // remove /en
      // Find DE equivalent
      for (const [dePath, enRoute] of Object.entries(routeMap)) {
        if (enRoute === enPath || enRoute === enPath.replace(/\/$/, '') + '/') {
          return joinPath(base, dePath);
        }
      }
      return joinPath(base, '/');
    }
    return joinPath(base, cleanPath);
  }

  // lang === 'en': map DE path to EN
  const dePath = cleanPath.endsWith('/') ? cleanPath : cleanPath + '/';
  const enPath = routeMap[dePath];
  if (enPath === null) {
    // Legal page with no EN equivalent — link to DE version
    return joinPath(base, dePath);
  }
  if (enPath) {
    return joinPath(base, '/en' + enPath);
  }
  // Fallback
  return joinPath(base, '/en' + cleanPath);
}
