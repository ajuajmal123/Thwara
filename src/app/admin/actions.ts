"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, getSupabase, supabaseUrl } from "@/lib/supabase";
import { verifyPassword, setAdminSession, clearAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";
import { generateSlug } from "@/lib/slug";

function getClient() {
  return getSupabaseAdmin() || getSupabase();
}

function formatDbError(error: any): string {
  if (!error) return "Unknown database error occurred";
  const msg = error.message || (typeof error === "string" ? error : JSON.stringify(error));
  const lower = msg.toLowerCase();

  if (
    lower.includes("row-level security") ||
    lower.includes("policy") ||
    lower.includes("permission denied")
  ) {
    return "Action blocked by Supabase Row-Level Security (RLS). Please verify your SUPABASE_SERVICE_ROLE_KEY in .env.";
  }

  if (lower.includes("fetch failed") || lower.includes("enotfound") || lower.includes("econnrefused")) {
    return "Connection to Supabase failed (fetch failed). Please check that NEXT_PUBLIC_SUPABASE_URL in your .env matches your active project URL in Supabase Dashboard -> Settings -> API, and check that your project is not Paused.";
  }

  if (lower.includes("bucket not found")) {
    return "Storage bucket 'media' was not found. Please create a public bucket named 'media' in Supabase Dashboard -> Storage.";
  }

  return msg;
}

/**
 * Admin Login Action
 */
export async function loginAdminAction(formData: FormData) {
  const password = formData.get("password") as string;
  if (!verifyPassword(password)) {
    return { error: "Invalid admin password. Please try again." };
  }

  await setAdminSession();
  redirect("/admin");
}

/**
 * Admin Logout Action
 */
export async function logoutAdminAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

/**
 * Overview statistics
 */
export async function getAdminOverviewStats() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return null;

  const supabase = getClient();
  if (!supabase) return null;

  try {
    const [articles, fictions, folklores, tellings, webzines, authors, submissions] = await Promise.all([
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase.from("fictions").select("id", { count: "exact", head: true }),
      supabase.from("folklores").select("id", { count: "exact", head: true }),
      supabase.from("tellings").select("id", { count: "exact", head: true }),
      supabase.from("webzines").select("id", { count: "exact", head: true }),
      supabase.from("authors").select("id", { count: "exact", head: true }),
      supabase.from("submissions").select("id, status"),
    ]);

    const pendingSubmissions = (submissions.data || []).filter((s) => s.status === "Pending").length;

    return {
      articlesCount: articles.count || 0,
      fictionsCount: fictions.count || 0,
      folkloresCount: folklores.count || 0,
      tellingsCount: tellings.count || 0,
      webzinesCount: webzines.count || 0,
      authorsCount: authors.count || 0,
      totalSubmissions: submissions.data?.length || 0,
      pendingSubmissions,
    };
  } catch (err) {
    console.error("[Admin Stats Error]:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLES
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminArticles() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function saveArticleAction(articleData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const id = articleData.id;
  const title = (articleData.title || "").trim();
  const slug = generateSlug(title);

  // Lookup author profile if author_name is selected
  let authorPhoto = articleData.author_photo || null;
  let authorDescription = articleData.author_description || null;
  if (articleData.author_name) {
    try {
      const { data: authorRecord } = await supabase
        .from("authors")
        .select("photo, description")
        .eq("name", articleData.author_name)
        .maybeSingle();
      if (authorRecord) {
        authorPhoto = authorRecord.photo || authorPhoto;
        authorDescription = authorRecord.description || authorDescription;
      }
    } catch {
      // ignore lookup error
    }
  }

  const additionalImages = Array.isArray(articleData.additional_images)
    ? articleData.additional_images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
    : [];

  const payload = {
    title,
    slug,
    subheading: articleData.subheading || null,
    author_name: articleData.author_name || "Thwara Editorial",
    domain: articleData.domain || "Literature",
    date: articleData.date || new Date().toISOString().split("T")[0],
    cover_image: articleData.cover_image || null,
    additional_images: additionalImages,
    author_photo: authorPhoto,
    author_description: authorDescription,
    reference: articleData.reference || null,
    content: articleData.content || null,
  };

  let error;
  if (id) {
    const res = await supabase.from("articles").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("articles").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(formatDbError(error));
  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  return { success: true };
}

export async function deleteArticleAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/articles");
  revalidatePath("/articles");
  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// FICTIONS
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminFictions() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase.from("fictions").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function saveFictionAction(fictionData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const id = fictionData.id;
  const title = (fictionData.title || "").trim();
  const slug = generateSlug(title);

  let authorPhoto = fictionData.author_photo || null;
  let authorDescription = fictionData.author_description || null;
  if (fictionData.author_name) {
    try {
      const { data: authorRecord } = await supabase
        .from("authors")
        .select("photo, description")
        .eq("name", fictionData.author_name)
        .maybeSingle();
      if (authorRecord) {
        authorPhoto = authorRecord.photo || authorPhoto;
        authorDescription = authorRecord.description || authorDescription;
      }
    } catch {
      // ignore lookup error
    }
  }

  const additionalImages = Array.isArray(fictionData.additional_images)
    ? fictionData.additional_images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
    : [];

  const payload = {
    title,
    slug,
    subheading: fictionData.subheading || null,
    author_name: fictionData.author_name || "Thwara",
    genre: fictionData.genre || "Story",
    date: fictionData.date || new Date().toISOString().split("T")[0],
    cover_image: fictionData.cover_image || null,
    additional_images: additionalImages,
    author_photo: authorPhoto,
    author_description: authorDescription,
    notes: fictionData.notes || null,
    content: fictionData.content || null,
  };

  let error;
  if (id) {
    const res = await supabase.from("fictions").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("fictions").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(formatDbError(error));
  revalidatePath("/admin/fiction");
  revalidatePath("/fiction");
  revalidatePath("/");
  return { success: true };
}

export async function deleteFictionAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("fictions").delete().eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/fiction");
  revalidatePath("/fiction");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// FOLKLORES
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminFolklores() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase.from("folklores").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function saveFolkloreAction(folkloreData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const id = folkloreData.id;
  const title = (folkloreData.title || "").trim();
  const slug = generateSlug(title);

  let narratorPhoto = folkloreData.narrator_photo || null;
  let narratorDescription = folkloreData.narrator_description || null;
  if (folkloreData.narrator_name) {
    try {
      const { data: authorRecord } = await supabase
        .from("authors")
        .select("photo, description")
        .eq("name", folkloreData.narrator_name)
        .maybeSingle();
      if (authorRecord) {
        narratorPhoto = authorRecord.photo || narratorPhoto;
        narratorDescription = authorRecord.description || narratorDescription;
      }
    } catch {
      // ignore lookup error
    }
  }

  const additionalImages = Array.isArray(folkloreData.additional_images)
    ? folkloreData.additional_images.filter((img: any) => typeof img === "string" && img.trim().length > 0)
    : [];

  const payload = {
    title,
    slug,
    subheading: folkloreData.subheading || null,
    narrator_name: folkloreData.narrator_name || "Thwara Archive",
    category: folkloreData.category || "Oral Histories",
    date: folkloreData.date || new Date().toISOString().split("T")[0],
    cover_image: folkloreData.cover_image || null,
    additional_images: additionalImages,
    narrator_photo: narratorPhoto,
    narrator_description: narratorDescription,
    spotify_url: folkloreData.spotify_url || null,
    reference: folkloreData.reference || null,
    content: folkloreData.content || null,
  };

  let error;
  if (id) {
    const res = await supabase.from("folklores").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("folklores").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(formatDbError(error));
  revalidatePath("/admin/fiction");
  revalidatePath("/folklore");
  revalidatePath("/");
  return { success: true };
}

export async function deleteFolkloreAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("folklores").delete().eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/fiction");
  revalidatePath("/folklore");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// TELLINGS (Audio, Stories, Podcasts, Interviews)
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminTellings() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("tellings")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function saveTellingAction(tellingData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const id = tellingData.id;
  const title = (tellingData.title || "").trim();
  if (!title) throw new Error("Title is required");

  const payload = {
    title,
    category: tellingData.category || "Stories",
    cover_image: tellingData.cover_image?.trim() || null,
    spotify_url: tellingData.spotify_url?.trim() || null,
    audio_url: tellingData.audio_url?.trim() || null,
  };

  let error;
  if (id) {
    const res = await supabase.from("tellings").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("tellings").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(formatDbError(error));
  revalidatePath("/admin/tellings");
  revalidatePath("/tellings");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTellingAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("tellings").delete().eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/tellings");
  revalidatePath("/tellings");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBZINES
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminWebzines() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase.from("webzines").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function saveWebzineAction(webzineData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const id = webzineData.id;
  const title = (webzineData.title || "").trim();
  if (!title) throw new Error("Issue title is required");

  const slug = generateSlug(title);

  const payload = {
    title,
    webzine_name: webzineData.webzine_name || title,
    issue_number: webzineData.issue_number || "01",
    slug,
    domain: webzineData.domain || "Visual Essay",
    date: webzineData.date || new Date().toLocaleString("en-US", { month: "short", year: "numeric" }),
    cover_image: webzineData.cover_image || null,
    excerpt: webzineData.excerpt || null,
    description: webzineData.description || null,
    author_name: webzineData.author_name || null,
    articles: Array.isArray(webzineData.articles) ? webzineData.articles : [],
    fictions: Array.isArray(webzineData.fictions) ? webzineData.fictions : [],
    folklores: Array.isArray(webzineData.folklores) ? webzineData.folklores : [],
    tellings: Array.isArray(webzineData.tellings) ? webzineData.tellings : [],
  };

  let error;
  if (id) {
    const res = await supabase.from("webzines").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("webzines").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(formatDbError(error));
  revalidatePath("/admin/webzine");
  revalidatePath("/webzine");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}

export async function deleteWebzineAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("webzines").delete().eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/webzine");
  revalidatePath("/webzine");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTHORS
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminAuthors() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase.from("authors").select("*").order("name", { ascending: true });
  return data || [];
}

export async function saveAuthorAction(authorData: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const id = authorData.id;
  const payload = {
    name: authorData.name,
    photo: authorData.photo || null,
    description: authorData.description || null,
  };

  let error;
  if (id) {
    const res = await supabase.from("authors").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("authors").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(formatDbError(error));
  revalidatePath("/admin/authors");
  revalidatePath("/authors");
  return { success: true };
}

export async function deleteAuthorAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/authors");
  revalidatePath("/authors");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMISSIONS
// ─────────────────────────────────────────────────────────────────────────────
export async function getAdminSubmissions() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
  return data || [];
}

export async function updateSubmissionStatusAction(id: string, status: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
  if (error) throw new Error(formatDbError(error));

  revalidatePath("/admin/submissions");
  return { success: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA UPLOAD
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadMediaAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const file = formData.get("file") as File;
  if (!file || !(file instanceof File)) {
    throw new Error("No file provided");
  }

  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `uploads/${Date.now()}_${sanitized}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let { data, error } = await supabase.storage.from("media").upload(path, buffer, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "3600",
    upsert: false,
  });

  // If bucket does not exist, try creating it automatically using admin client
  if (error && (error.message?.includes("Bucket not found") || (error as any).statusCode === "404" || (error as any).status === 404)) {
    try {
      await supabase.storage.createBucket("media", { public: true });
      const retry = await supabase.storage.from("media").upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: false,
      });
      data = retry.data;
      error = retry.error;
    } catch {
      // Proceed to format error
    }
  }

  if (error) {
    console.error("[Supabase Storage Upload Error]:", error);
    throw new Error(formatDbError(error));
  }

  if (!data?.path) {
    throw new Error("Upload succeeded but no path was returned");
  }

  const { data: urlData } = supabase.storage.from("media").getPublicUrl(data.path);
  return { url: urlData.publicUrl, path: data.path };
}

export async function listMediaFilesAction() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) return [];

  const supabase = getClient();
  if (!supabase) return [];

  const { data, error } = await supabase.storage.from("media").list("uploads", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return [];

  return (data || []).map((file) => ({
    name: file.name,
    id: file.id,
    created_at: file.created_at,
    url: `${supabaseUrl}/storage/v1/object/public/media/uploads/${file.name}`,
  }));
}
