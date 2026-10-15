"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";
import { verifyPassword, setAdminSession, clearAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";

function getClient() {
  return getSupabaseAdmin() || getSupabase();
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
    const [articles, fictions, folklores, webzines, authors, submissions] = await Promise.all([
      supabase.from("articles").select("id", { count: "exact", head: true }),
      supabase.from("fictions").select("id", { count: "exact", head: true }),
      supabase.from("folklores").select("id", { count: "exact", head: true }),
      supabase.from("webzines").select("id", { count: "exact", head: true }),
      supabase.from("authors").select("id", { count: "exact", head: true }),
      supabase.from("submissions").select("id, status"),
    ]);

    const pendingSubmissions = (submissions.data || []).filter((s) => s.status === "Pending").length;

    return {
      articlesCount: articles.count || 0,
      fictionsCount: fictions.count || 0,
      folkloresCount: folklores.count || 0,
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
  const payload = {
    title: articleData.title,
    slug: articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    subheading: articleData.subheading || null,
    author_name: articleData.author_name || "Thwara Editorial",
    domain: articleData.domain || "Literature",
    date: articleData.date || new Date().toISOString().split("T")[0],
    cover_image: articleData.cover_image || null,
    author_photo: articleData.author_photo || null,
    author_description: articleData.author_description || null,
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

  if (error) throw new Error(error.message);
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
  if (error) throw new Error(error.message);

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
  const payload = {
    title: fictionData.title,
    slug: fictionData.slug || fictionData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    subheading: fictionData.subheading || null,
    author_name: fictionData.author_name || "Thwara",
    genre: fictionData.genre || "Story",
    date: fictionData.date || new Date().toISOString().split("T")[0],
    cover_image: fictionData.cover_image || null,
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

  if (error) throw new Error(error.message);
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
  if (error) throw new Error(error.message);

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
  const payload = {
    title: folkloreData.title,
    slug: folkloreData.slug || folkloreData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    subheading: folkloreData.subheading || null,
    narrator_name: folkloreData.narrator_name || "Thwara Archive",
    category: folkloreData.category || "Oral Histories",
    date: folkloreData.date || new Date().toISOString().split("T")[0],
    cover_image: folkloreData.cover_image || null,
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

  if (error) throw new Error(error.message);
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
  if (error) throw new Error(error.message);

  revalidatePath("/admin/fiction");
  revalidatePath("/folklore");
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
  const payload = {
    title: webzineData.title,
    webzine_name: webzineData.webzine_name || webzineData.title,
    issue_number: webzineData.issue_number || "01",
    slug: webzineData.slug || webzineData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    domain: webzineData.domain || "Visual Essay",
    date: webzineData.date || "2026",
    cover_image: webzineData.cover_image || null,
    excerpt: webzineData.excerpt || null,
    description: webzineData.description || null,
    author_name: webzineData.author_name || null,
  };

  let error;
  if (id) {
    const res = await supabase.from("webzines").update(payload).eq("id", id);
    error = res.error;
  } else {
    const res = await supabase.from("webzines").insert([payload]);
    error = res.error;
  }

  if (error) throw new Error(error.message);
  revalidatePath("/admin/webzine");
  revalidatePath("/webzine");
  revalidatePath("/");
  return { success: true };
}

export async function deleteWebzineAction(id: number | string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) throw new Error("Unauthorized");

  const supabase = getClient();
  if (!supabase) throw new Error("Database not connected");

  const { error } = await supabase.from("webzines").delete().eq("id", id);
  if (error) throw new Error(error.message);

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

  if (error) throw new Error(error.message);
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
  if (error) throw new Error(error.message);

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
  if (error) throw new Error(error.message);

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

  const { data, error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(error.message);

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

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return (data || []).map((file) => ({
    name: file.name,
    id: file.id,
    created_at: file.created_at,
    url: `${supabaseUrl}/storage/v1/object/public/media/uploads/${file.name}`,
  }));
}
