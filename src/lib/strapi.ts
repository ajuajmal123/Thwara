import { getMediaUrl } from "./supabase";

/**
 * Backward compatibility wrapper for media URLs.
 * Automatically delegates to Supabase media URL resolver.
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
    if (!url) return null;
    return getMediaUrl(url);
}

export function getStrapiURL(path = "") {
    return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337"}${path}`;
}

export async function fetchAPI(path: string, _urlParamsObject = {}, _options: any = {}) {
    console.warn(`[API] Legacy fetchAPI called for: ${path}. Transitioning to Supabase.`);
    return { data: [] };
}
