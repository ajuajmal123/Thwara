import { getSupabase } from "@/lib/supabase";
import {
  Article,
  Folklore,
  Fiction,
  Webzine,
  Author,
  Tellings,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from "@/types/schema";

/**
 * Normalizes Supabase database rows into an entity format compatible with both
 * traditional REST and legacy Strapi format (supports item.title and item.attributes.title)
 */
function normalizeEntity<T>(row: any): any {
  if (!row) return null;
  return {
    id: row.id,
    attributes: {
      ...row,
      authorName: row.author_name || row.authorName,
      coverImage: typeof row.cover_image === "string" ? { url: row.cover_image } : row.cover_image,
      authorPhoto: row.author_photo || row.authorPhoto,
      authorDescription: row.author_description || row.authorDescription,
      narratorName: row.narrator_name || row.narratorName,
      narratorPhoto: row.narrator_photo || row.narratorPhoto,
      narratorDescription: row.narrator_description || row.narratorDescription,
      spotifyUrl: row.spotify_url || row.spotifyUrl,
      issueNumber: row.issue_number || row.issueNumber,
      webzineName: row.webzine_name || row.webzineName,
      workName: row.work_name || row.workName,
    },
    ...row,
    authorName: row.author_name || row.authorName,
    coverImage: typeof row.cover_image === "string" ? { url: row.cover_image } : row.cover_image,
    authorPhoto: row.author_photo || row.authorPhoto,
    authorDescription: row.author_description || row.authorDescription,
    narratorName: row.narrator_name || row.narratorName,
    narratorPhoto: row.narrator_photo || row.narratorPhoto,
    narratorDescription: row.narrator_description || row.narratorDescription,
    spotifyUrl: row.spotify_url || row.spotifyUrl,
    issueNumber: row.issue_number || row.issueNumber,
    webzineName: row.webzine_name || row.webzineName,
    workName: row.work_name || row.workName,
  };
}

function emptyCollection<T>(page = 1, pageSize = 10): StrapiCollectionResponse<T> {
  return {
    data: [],
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount: 0,
        total: 0,
      },
    },
  };
}

/**
 * Fetches all Articles with pagination
 */
export async function getArticles(page = 1, pageSize = 10): Promise<StrapiCollectionResponse<Article>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Article>(page, pageSize);

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Supabase] getArticles error:", error.message);
      return emptyCollection<Article>(page, pageSize);
    }

    const total = count || (data?.length || 0);
    return {
      data: (data || []).map((row) => normalizeEntity<Article>(row)),
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getArticles exception:", err);
    return emptyCollection<Article>(page, pageSize);
  }
}

/**
 * Fetches a single Article by slug
 */
export async function getArticleBySlug(slug: string): Promise<StrapiSingleResponse<Article> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const raw = String(slug);
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // keep raw
    }

    // Try finding by slug first (both decoded and raw)
    const { data: bySlug, error: slugErr } = await supabase
      .from("articles")
      .select("*")
      .in("slug", [decoded, raw])
      .limit(1)
      .maybeSingle();

    if (!slugErr && bySlug) {
      return { data: normalizeEntity<Article>(bySlug) };
    }

    // Fallback if accessed via numeric id
    if (!isNaN(Number(raw))) {
      const { data: byId } = await supabase
        .from("articles")
        .select("*")
        .eq("id", Number(raw))
        .limit(1)
        .maybeSingle();
      if (byId) return { data: normalizeEntity<Article>(byId) };
    }

    return null;
  } catch (err) {
    console.error("[Supabase] getArticleBySlug exception:", err);
    return null;
  }
}

/**
 * Tellings (Audio / Stories / Podcasts / Interviews)
 */
export async function getTellingsByCategory(
  category: "Stories" | "Podcast" | "Interview"
): Promise<StrapiCollectionResponse<Tellings>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Tellings>();

  try {
    const { data, error } = await supabase
      .from("tellings")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase] getTellingsByCategory error:", error.message);
      return emptyCollection<Tellings>();
    }

    return {
      data: (data || []).map((row) => normalizeEntity<Tellings>(row)),
      meta: {
        pagination: {
          page: 1,
          pageSize: data?.length || 10,
          pageCount: 1,
          total: data?.length || 0,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getTellingsByCategory exception:", err);
    return emptyCollection<Tellings>();
  }
}

export async function getTellings(
  category?: string
): Promise<StrapiCollectionResponse<Tellings>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Tellings>();

  try {
    let query = supabase.from("tellings").select("*").order("created_at", { ascending: false });
    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    const { data, error } = await query;

    if (error) {
      console.error("[Supabase] getTellings error:", error.message);
      return emptyCollection<Tellings>();
    }

    return {
      data: (data || []).map((row) => normalizeEntity<Tellings>(row)),
      meta: {
        pagination: {
          page: 1,
          pageSize: data?.length || 10,
          pageCount: 1,
          total: data?.length || 0,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getTellings exception:", err);
    return emptyCollection<Tellings>();
  }
}

/**
 * Fiction
 */
export async function getFictions(page = 1, pageSize = 10): Promise<StrapiCollectionResponse<Fiction>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Fiction>(page, pageSize);

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("fictions")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Supabase] getFictions error:", error.message);
      return emptyCollection<Fiction>(page, pageSize);
    }

    const total = count || (data?.length || 0);
    return {
      data: (data || []).map((row) => normalizeEntity<Fiction>(row)),
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getFictions exception:", err);
    return emptyCollection<Fiction>(page, pageSize);
  }
}

/**
 * Folklore
 */
export async function getFolklore(page = 1, pageSize = 10): Promise<StrapiCollectionResponse<Folklore>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Folklore>(page, pageSize);

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
      .from("folklores")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("[Supabase] getFolklore error:", error.message);
      return emptyCollection<Folklore>(page, pageSize);
    }

    const total = count || (data?.length || 0);
    return {
      data: (data || []).map((row) => normalizeEntity<Folklore>(row)),
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getFolklore exception:", err);
    return emptyCollection<Folklore>(page, pageSize);
  }
}

/**
 * Fetches a single Fiction piece by slug or ID
 */
export async function getFictionBySlug(slug: string): Promise<StrapiSingleResponse<Fiction> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const raw = String(slug);
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // keep raw
    }

    const { data: bySlug, error: slugErr } = await supabase
      .from("fictions")
      .select("*")
      .in("slug", [decoded, raw])
      .limit(1)
      .maybeSingle();

    if (!slugErr && bySlug) {
      return { data: normalizeEntity<Fiction>(bySlug) };
    }

    if (!isNaN(Number(raw))) {
      const { data: byId } = await supabase
        .from("fictions")
        .select("*")
        .eq("id", Number(raw))
        .limit(1)
        .maybeSingle();
      if (byId) return { data: normalizeEntity<Fiction>(byId) };
    }

    return null;
  } catch (err) {
    console.error("[Supabase] getFictionBySlug exception:", err);
    return null;
  }
}

/**
 * Fetches a single Folklore entry by slug or ID
 */
export async function getFolkloreBySlug(slug: string): Promise<StrapiSingleResponse<Folklore> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const raw = String(slug);
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // keep raw
    }

    const { data: bySlug, error: slugErr } = await supabase
      .from("folklores")
      .select("*")
      .in("slug", [decoded, raw])
      .limit(1)
      .maybeSingle();

    if (!slugErr && bySlug) {
      return { data: normalizeEntity<Folklore>(bySlug) };
    }

    if (!isNaN(Number(raw))) {
      const { data: byId } = await supabase
        .from("folklores")
        .select("*")
        .eq("id", Number(raw))
        .limit(1)
        .maybeSingle();
      if (byId) return { data: normalizeEntity<Folklore>(byId) };
    }

    return null;
  } catch (err) {
    console.error("[Supabase] getFolkloreBySlug exception:", err);
    return null;
  }
}

/**
 * Webzine (Curated issues)
 */
export async function getWebzines(): Promise<StrapiCollectionResponse<Webzine>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Webzine>();

  try {
    const { data, error } = await supabase
      .from("webzines")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Supabase] getWebzines error:", error.message);
      return emptyCollection<Webzine>();
    }

    return {
      data: (data || []).map((row) => normalizeEntity<Webzine>(row)),
      meta: {
        pagination: {
          page: 1,
          pageSize: data?.length || 10,
          pageCount: 1,
          total: data?.length || 0,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getWebzines exception:", err);
    return emptyCollection<Webzine>();
  }
}

export async function getWebzineById(id: string | number): Promise<StrapiSingleResponse<Webzine> | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const raw = String(id);
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // keep raw
    }

    const { data: bySlug, error: slugErr } = await supabase
      .from("webzines")
      .select("*")
      .in("slug", [decoded, raw])
      .limit(1)
      .maybeSingle();

    if (!slugErr && bySlug) {
      return { data: normalizeEntity<Webzine>(bySlug) };
    }

    if (!isNaN(Number(raw))) {
      const { data: byId } = await supabase
        .from("webzines")
        .select("*")
        .eq("id", Number(raw))
        .limit(1)
        .maybeSingle();
      if (byId) return { data: normalizeEntity<Webzine>(byId) };
    }

    return null;
  } catch (err) {
    console.error("[Supabase] getWebzineById exception:", err);
    return null;
  }
}

/**
 * Authors
 */
export async function getAuthors(): Promise<StrapiCollectionResponse<Author>> {
  const supabase = getSupabase();
  if (!supabase) return emptyCollection<Author>();

  try {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("[Supabase] getAuthors error:", error.message);
      return emptyCollection<Author>();
    }

    return {
      data: (data || []).map((row) => normalizeEntity<Author>(row)),
      meta: {
        pagination: {
          page: 1,
          pageSize: data?.length || 10,
          pageCount: 1,
          total: data?.length || 0,
        },
      },
    };
  } catch (err) {
    console.error("[Supabase] getAuthors exception:", err);
    return emptyCollection<Author>();
  }
}

/**
 * Submissions (Handles both document file uploads to Supabase Storage and records in Supabase DB)
 */
export async function postSubmission(submissionData: FormData | any) {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("[Supabase] Submissions: Supabase client is not configured. Submission saved locally for demo.");
    return { success: true, message: "Submission simulated (configure Supabase to persist)." };
  }

  let payload: {
    authorName?: string;
    email?: string;
    title?: string;
    googleDriveLink?: string;
    agreedToPrivacy?: boolean;
    status?: string;
  } = {};

  let documentFile: File | null = null;

  if (typeof FormData !== "undefined" && submissionData instanceof FormData) {
    const rawData = submissionData.get("data");
    if (rawData && typeof rawData === "string") {
      try {
        payload = JSON.parse(rawData);
      } catch {
        payload = {};
      }
    } else {
      payload = {
        authorName: (submissionData.get("authorName") as string) || "Anonymous",
        email: (submissionData.get("email") as string) || undefined,
        title: (submissionData.get("title") as string) || "Untitled Submission",
        googleDriveLink: (submissionData.get("googleDriveLink") as string) || undefined,
      };
    }

    const doc = submissionData.get("files.document") || submissionData.get("document");
    if (doc instanceof File) {
      documentFile = doc;
    }
  } else if (typeof submissionData === "object" && submissionData !== null) {
    payload = submissionData.data || submissionData;
  }

  let documentUrl: string | null = null;
  let documentName: string | null = null;

  // Upload file to Supabase Storage bucket 'submissions' if attached
  if (documentFile) {
    try {
      const sanitizedName = documentFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filePath = `docs/${Date.now()}_${sanitizedName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(filePath, documentFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.warn("[Supabase Storage] File upload warning:", uploadError.message);
      } else if (uploadData?.path) {
        documentName = documentFile.name;
        const { data: urlData } = supabase.storage
          .from("submissions")
          .getPublicUrl(uploadData.path);
        documentUrl = urlData.publicUrl;
      }
    } catch (storageErr) {
      console.error("[Supabase Storage] Upload error:", storageErr);
    }
  }

  // Insert submission row into PostgreSQL (no .select() so anon role doesn't hit SELECT RLS block)
  const { data, error } = await supabase
    .from("submissions")
    .insert([
      {
        author_name: payload.authorName || "Anonymous",
        email: payload.email || null,
        title: payload.title || "Untitled Submission",
        google_drive_link: payload.googleDriveLink || null,
        document_url: documentUrl,
        document_name: documentName,
        agreed_to_privacy: payload.agreedToPrivacy ?? true,
        status: payload.status || "Pending",
      },
    ]);

  if (error) {
    console.error("[Supabase] Submission insert error:", error.message);
    throw new Error(error.message);
  }

  return { success: true, data };
}
