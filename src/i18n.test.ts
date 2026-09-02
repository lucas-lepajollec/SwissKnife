import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, locales, messages } from './i18n';

function leafPaths(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string' || typeof value === 'function') return [prefix];
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => leafPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe('i18n contract', () => {
  it('keeps English as the explicit default', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(locales).toEqual(['en', 'fr', 'es', 'de']);
    expect(LOCALE_STORAGE_KEY).toBe('swissknife.ui_language');
  });

  it('keeps every supported locale in exact key parity with English', () => {
    for (const locale of locales) {
      expect(leafPaths(messages[locale]).sort()).toEqual(leafPaths(messages.en).sort());
    }
  });
});
