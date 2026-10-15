import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Validates whether Supabase environment variables are properly configured.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
}

// Client-safe Supabase instance (uses anon key)
let _supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!_supabaseClient) {
    _supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabaseClient;
}

// Server-side privileged Supabase instance (uses service role key if available, otherwise anon key)
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!supabaseUrl) return null;
  const key = supabaseServiceKey || supabaseAnonKey;
  if (!key) return null;
  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Universal media URL resolver.
 * Handles:
 * - External absolute URLs (https://...)
 * - Local static assets (/...)
 * - Supabase Storage file paths (e.g. 'media/articles/cover.jpg')
 */
export function getMediaUrl(pathOrUrl: string | null | undefined, bucket: string = "media"): string {
  if (!pathOrUrl) return "";

  // If already absolute URL or local public asset path
  if (
    pathOrUrl.startsWith("http://") ||
    pathOrUrl.startsWith("https://") ||
    pathOrUrl.startsWith("//") ||
    pathOrUrl.startsWith("/")
  ) {
    return pathOrUrl;
  }

  // If it's a storage path in Supabase
  if (supabaseUrl) {
    const cleanPath = pathOrUrl.startsWith(`${bucket}/`)
      ? pathOrUrl.replace(`${bucket}/`, "")
      : pathOrUrl;
    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
  }

  return pathOrUrl;
}
