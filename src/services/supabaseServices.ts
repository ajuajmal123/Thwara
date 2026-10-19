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
import { ARTICLES } from "@/data/articles";
import { CREATIVE_WORKS } from "@/data/creative";
import { WEBZINE_PROJECTS } from "@/data/webzine";
import { CONTRIBUTORS } from "@/data/contributors";

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

// ─────────────────────────────────────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────────────────────────────────────

export interface SearchResultItem {
  id: string;
  origin: "Article" | "Fiction" | "Folklore" | "Webzine" | "Telling" | "Author";
  type?: "article" | "fiction" | "folklore" | "webzine" | "telling" | "author" | string;
  title: string;
  excerpt?: string;
  author?: string;
  date?: string;
  category?: string;
  coverImage?: string;
  href: string;
}

export async function searchAllContent(rawQuery: string): Promise<SearchResultItem[]> {
  const query = (rawQuery || "").trim();
  if (!query) return [];

  const q = query.toLowerCase();
  const results: SearchResultItem[] = [];
  const seenHrefs = new Set<string>();

  const supabase = getSupabase();

  if (supabase) {
    try {
      const [artRes, ficRes, folRes, webRes, telRes, autRes] = await Promise.allSettled([
        supabase
          .from("articles")
          .select("id, title, author_name, domain, date, cover_image, slug, content")
          .or(`title.ilike.%${query}%,author_name.ilike.%${query}%,domain.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(20),
        supabase
          .from("fictions")
          .select("id, title, author_name, genre, date, cover_image, slug, content")
          .or(`title.ilike.%${query}%,author_name.ilike.%${query}%,genre.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(20),
        supabase
          .from("folklores")
          .select("id, title, narrator_name, category, date, cover_image, slug, content")
          .or(`title.ilike.%${query}%,narrator_name.ilike.%${query}%,category.ilike.%${query}%,content.ilike.%${query}%`)
          .limit(20),
        supabase
          .from("webzines")
          .select("id, title, webzine_name, description, excerpt, date, domain, slug, cover_image")
          .or(`title.ilike.%${query}%,webzine_name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(20),
        supabase
          .from("tellings")
          .select("id, title, author_name, category, notes, date, cover_image, slug")
          .or(`title.ilike.%${query}%,author_name.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(20),
        supabase
          .from("authors")
          .select("id, name, description, photo")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(20),
      ]);

      if (artRes.status === "fulfilled" && artRes.value.data) {
        artRes.value.data.forEach((row: any) => {
          const href = `/articles/${row.slug || row.id}`;
          if (!seenHrefs.has(href)) {
            seenHrefs.add(href);
            results.push({
              id: `db-art-${row.id}`,
              origin: "Article",
              title: row.title || "Untitled Article",
              excerpt: (row.content ? row.content.replace(/[#*`>_\[\]\(\)]/g, "").slice(0, 160) : "") || "",
              author: row.author_name || "Thwara Editorial",
              date: row.date ? String(row.date).slice(0, 10) : "2026",
              category: row.domain || "Article",
              coverImage: typeof row.cover_image === "string" ? row.cover_image : row.cover_image?.url || "",
              href,
            });
          }
        });
      }

      if (ficRes.status === "fulfilled" && ficRes.value.data) {
        ficRes.value.data.forEach((row: any) => {
          const href = `/fiction/${row.slug || row.id}`;
          if (!seenHrefs.has(href)) {
            seenHrefs.add(href);
            results.push({
              id: `db-fic-${row.id}`,
              origin: "Fiction",
              title: row.title || "Untitled Fiction",
              excerpt: (row.content ? row.content.replace(/[#*`>_\[\]\(\)]/g, "").slice(0, 160) : "") || "",
              author: row.author_name || "Thwara Writer",
              date: row.date ? String(row.date).slice(0, 10) : "2026",
              category: row.genre || "Fiction",
              coverImage: typeof row.cover_image === "string" ? row.cover_image : row.cover_image?.url || "",
              href,
            });
          }
        });
      }

      if (folRes.status === "fulfilled" && folRes.value.data) {
        folRes.value.data.forEach((row: any) => {
          const href = `/folklore/${row.slug || row.id}`;
          if (!seenHrefs.has(href)) {
            seenHrefs.add(href);
            results.push({
              id: `db-fol-${row.id}`,
              origin: "Folklore",
              title: row.title || "Untitled Folklore",
              excerpt: (row.content ? row.content.replace(/[#*`>_\[\]\(\)]/g, "").slice(0, 160) : "") || "",
              author: row.narrator_name || "Thwara Archive",
              date: row.date ? String(row.date).slice(0, 10) : "2026",
              category: row.category || "Folklore",
              coverImage: typeof row.cover_image === "string" ? row.cover_image : row.cover_image?.url || "",
              href,
            });
          }
        });
      }

      if (webRes.status === "fulfilled" && webRes.value.data) {
        webRes.value.data.forEach((row: any) => {
          const href = `/webzine/${row.slug || row.id}`;
          if (!seenHrefs.has(href)) {
            seenHrefs.add(href);
            results.push({
              id: `db-web-${row.id}`,
              origin: "Webzine",
              title: row.title || row.webzine_name || "Webzine Issue",
              excerpt: row.excerpt || row.description || "",
              author: "Thwara Collective",
              date: row.date || "2026",
              category: row.domain || "Webzine",
              coverImage: typeof row.cover_image === "string" ? row.cover_image : row.cover_image?.url || "",
              href,
            });
          }
        });
      }

      if (telRes.status === "fulfilled" && telRes.value.data) {
        telRes.value.data.forEach((row: any) => {
          const href = `/tellings`;
          results.push({
            id: `db-tel-${row.id}`,
            origin: "Telling",
            title: row.title || "Telling Audio",
            excerpt: row.notes || "",
            author: row.author_name || "Thwara",
            date: row.date || "2026",
            category: row.category || "Audio",
            coverImage: typeof row.cover_image === "string" ? row.cover_image : row.cover_image?.url || "",
            href,
          });
        });
      }

      if (autRes.status === "fulfilled" && autRes.value.data) {
        autRes.value.data.forEach((row: any) => {
          const href = `/authors`;
          results.push({
            id: `db-aut-${row.id}`,
            origin: "Author",
            title: row.name || "Author",
            excerpt: row.description || "",
            author: row.name,
            category: "Author Profile",
            coverImage: row.photo || "",
            href,
          });
        });
      }
    } catch (err) {
      console.error("[Supabase searchAllContent error]:", err);
    }
  }

  // Also include matching static data as fallback / augmentation
  // Static Articles
  ARTICLES.forEach((item) => {
    const matches =
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));

    const href = `/articles/${item.slug}`;
    if (matches && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      results.push({
        id: `static-art-${item.id}`,
        origin: "Article",
        title: item.title,
        excerpt: item.excerpt,
        author: item.author,
        date: item.date,
        category: item.category,
        coverImage: item.coverImage,
        href,
      });
    }
  });

  // Static Creative Works -> Fiction & Folklore
  CREATIVE_WORKS.forEach((item) => {
    const matches =
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
      (item.type && item.type.toLowerCase().includes(q));

    const href = `/fiction/${item.slug}`;
    if (matches && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      results.push({
        id: `static-cre-${item.id}`,
        origin: "Fiction",
        title: item.title,
        excerpt: item.excerpt,
        author: item.author,
        date: item.date,
        category: item.type,
        coverImage: item.coverImage,
        href,
      });
    }
  });

  // Static Webzine Projects
  WEBZINE_PROJECTS.forEach((item) => {
    const matches =
      (item.title && item.title.toLowerCase().includes(q)) ||
      (Array.isArray(item.contributors) && item.contributors.some((c) => c.toLowerCase().includes(q))) ||
      (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
      (item.type && item.type.toLowerCase().includes(q));

    const href = `/webzine/${item.slug}`;
    if (matches && !seenHrefs.has(href)) {
      seenHrefs.add(href);
      results.push({
        id: `static-web-${item.id}`,
        origin: "Webzine",
        title: item.title,
        excerpt: item.excerpt,
        author: Array.isArray(item.contributors) ? item.contributors.join(", ") : "Thwara Collective",
        date: item.date,
        category: item.type,
        coverImage: item.coverImage,
        href,
      });
    }
  });

  // Static Contributors
  CONTRIBUTORS.forEach((cont) => {
    const matches =
      (cont.name && cont.name.toLowerCase().includes(q)) ||
      (cont.role && cont.role.toLowerCase().includes(q)) ||
      (cont.bio && cont.bio.toLowerCase().includes(q));

    const href = `/authors`;
    if (matches) {
      results.push({
        id: `static-con-${cont.id}`,
        origin: "Author",
        title: cont.name,
        excerpt: cont.bio || `${cont.role} at THWARA`,
        author: cont.name,
        category: cont.role,
        href,
      });
    }
  });

  return results;
}
