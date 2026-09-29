import { stripBase, withBase } from '@/utils/paths';

export type Locale = 'en' | 'zh-tw';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'zh-tw'];

/**
 * 從 URL 路徑判斷語言
 */
export function getLocaleFromUrl(url: URL): Locale {
  const pathname = stripBase(url.pathname);
  if (pathname.startsWith('/zh-tw/') || pathname === '/zh-tw') {
    return 'zh-tw';
  }
  return 'en';
}

/**
 * 產生語言化路徑（含 base，可直接作為 href）
 */
export function localizePath(path: string, locale: Locale): string {
  // 確保 path 以 / 開頭
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') {
    return withBase(normalizedPath);
  }
  return withBase(`/zh-tw${normalizedPath}`);
}

/**
 * 取得另一語言的對應路徑（語言切換連結用）
 * `currentPath` 可含或不含 base（通常直接傳 `Astro.url.pathname`），回傳值含 base。
 */
export function getAlternatePath(currentPath: string, targetLocale: Locale): string {
  return withBase(alternatePathWithoutBase(stripBase(currentPath), targetLocale));
}

function alternatePathWithoutBase(currentPath: string, targetLocale: Locale): string {
  // 移除尾端斜線（但保留根路徑）
  const normalized = currentPath.length > 1 && currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  if (targetLocale === 'en') {
    // 移除 /zh-tw 前綴
    if (normalized.startsWith('/zh-tw')) {
      const rest = normalized.slice('/zh-tw'.length);
      return rest || '/';
    }
    return normalized;
  }

  // 加上 /zh-tw 前綴
  if (normalized.startsWith('/zh-tw')) {
    return normalized; // 已經是 zh-tw 路徑
  }
  return `/zh-tw${normalized}`;
}

/**
 * 從翻譯物件取得對應語言的翻譯
 */
export function useTranslations<T>(translations: Record<Locale, T>, locale: Locale): T {
  return translations[locale];
}
