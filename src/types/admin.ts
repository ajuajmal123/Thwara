// Shapes used by the private admin dashboard and its server actions.

export type RecordId = number | string;

/**
 * A curated reference inside a webzine issue: either a bare id or a stored
 * snapshot of the work (id plus display fields such as title, slug, author).
 */
export type CuratedRef = RecordId | { id: RecordId; [field: string]: string | number | null | undefined };

/**
 * A row being listed or edited in the admin dashboard. One shape covers every
 * table (articles, fictions, folklores, tellings, webzines, authors,
 * submissions); each form only reads the columns its table has.
 */
export interface AdminRecord {
  id?: RecordId;
  created_at?: string | null;

  slug?: string | null;
  title?: string | null;
  subheading?: string | null;
  content?: string | null;
  date?: string | null;
  domain?: string | null;
  genre?: string | null;
  category?: string | null;

  author_name?: string | null;
  author_photo?: string | null;
  author_description?: string | null;
  narrator_name?: string | null;
  narrator_photo?: string | null;
  narrator_description?: string | null;

  cover_image?: string | null;
  additional_images?: string[] | null;
  reference?: string | null;
  notes?: string | null;
  spotify_url?: string | null;
  audio_url?: string | null;

  webzine_name?: string | null;
  issue_number?: string | null;
  work_name?: string | null;
  excerpt?: string | null;
  description?: string | null;
  articles?: CuratedRef[] | null;
  fictions?: CuratedRef[] | null;
  folklores?: CuratedRef[] | null;
  tellings?: CuratedRef[] | null;

  // authors
  name?: string | null;
  photo?: string | null;

  // submissions
  email?: string | null;
  google_drive_link?: string | null;
  document_url?: string | null;
  document_name?: string | null;
  agreed_to_privacy?: boolean | null;
  status?: string | null;
}

/** A file in the `media/uploads` storage folder. */
export interface MediaFile {
  name: string;
  id: string | null;
  created_at: string | null;
  url: string;
}

/** A row loaded from the database: always has an id. */
export type AdminRow = AdminRecord & { id: RecordId };
