// Thwara Platform Data Models

/** A work referenced inside a webzine issue (stored as JSONB on `webzines`). */
export interface CuratedWork {
  id?: number | string;
  slug?: string;
  title?: string;
  author?: string;
  narrator?: string;
  genre?: string;
  category?: string;
}

/**
 * A row from any Supabase content table (articles, fictions, folklores,
 * webzines, tellings, authors) after `normalizeEntity`. Columns differ per
 * table, so everything except `id` is optional. camelCase aliases mirror the
 * snake_case columns for older callers, and `attributes` repeats the row in
 * the legacy Strapi shape.
 */
export interface ContentRow {
  id: number;
  slug?: string | null;
  title?: string | null;
  subheading?: string | null;
  content?: string | null;
  date?: string | null;
  created_at?: string | null;

  domain?: string | null;
  genre?: string | null;
  category?: string | null;

  author_name?: string | null;
  authorName?: string | null;
  author_photo?: string | null;
  authorPhoto?: string | null;
  author_description?: string | null;
  authorDescription?: string | null;

  narrator_name?: string | null;
  narratorName?: string | null;
  narrator_photo?: string | null;
  narratorPhoto?: string | null;
  narrator_description?: string | null;
  narratorDescription?: string | null;

  cover_image?: string | null;
  coverImage?: { url?: string | null } | null;
  additional_images?: string[] | null;

  reference?: string | null;
  notes?: string | null;
  spotify_url?: string | null;
  spotifyUrl?: string | null;
  audio_url?: string | null;

  webzine_name?: string | null;
  webzineName?: string | null;
  issue_number?: string | null;
  issueNumber?: string | null;
  work_name?: string | null;
  workName?: string | null;
  excerpt?: string | null;
  description?: string | null;
  articles?: CuratedWork[] | null;
  fictions?: CuratedWork[] | null;
  folklores?: CuratedWork[] | null;
  tellings?: CuratedWork[] | null;

  // authors table
  name?: string | null;
  photo?: string | null;
  bio?: string | null;

  attributes?: ContentRow;
}

export interface Submission {
  authorName?: string;
  email?: string;
  title?: string;
  googleDriveLink?: string;
  agreedToPrivacy?: boolean;
  status?: "Pending" | "Under Review" | "Accepted" | "Rejected" | string;
}

// Response wrappers (shape kept from the Strapi era so callers stay unchanged)
export interface CollectionResponse {
  data: ContentRow[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SingleResponse {
  data: ContentRow;
}
