"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin, getSupabase } from "@/lib/supabase";

export async function submitPitchAction(formData: FormData) {
  const supabase = getSupabaseAdmin() || getSupabase();
  if (!supabase) {
    throw new Error("Supabase is not configured. Please check your backend credentials.");
  }

  let payload = {
    authorName: "Anonymous",
    email: null as string | null,
    title: "Untitled Submission",
    googleDriveLink: null as string | null,
    agreedToPrivacy: true,
    status: "Pending",
  };

  const rawData = formData.get("data");
  if (rawData && typeof rawData === "string") {
    try {
      const parsed = JSON.parse(rawData);
      payload.authorName = parsed.authorName || payload.authorName;
      payload.email = parsed.email || null;
      payload.title = parsed.title || payload.title;
      payload.googleDriveLink = parsed.googleDriveLink || null;
      payload.agreedToPrivacy = parsed.agreedToPrivacy ?? true;
    } catch {
      // ignore JSON parse fallback
    }
  } else {
    payload.authorName = (formData.get("authorName") as string) || payload.authorName;
    payload.email = (formData.get("email") as string) || null;
    payload.title = (formData.get("title") as string) || payload.title;
    payload.googleDriveLink = (formData.get("googleDriveLink") as string) || null;
  }

  let documentUrl: string | null = null;
  let documentName: string | null = null;

  // Handle uploaded document file
  const docFile = formData.get("files.document") || formData.get("document");
  if (docFile && docFile instanceof File && docFile.size > 0) {
    try {
      const sanitized = docFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `docs/${Date.now()}_${sanitized}`;

      const arrayBuffer = await docFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let { data: uploadData, error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(path, buffer, {
          contentType: docFile.type || "application/octet-stream",
          cacheControl: "3600",
          upsert: false,
        });

      // If bucket does not exist, auto-create it
      if (
        uploadError &&
        (uploadError.message?.includes("Bucket not found") ||
          (uploadError as any).statusCode === "404" ||
          (uploadError as any).status === 404)
      ) {
        await supabase.storage.createBucket("submissions", { public: true });
        const retry = await supabase.storage.from("submissions").upload(path, buffer, {
          contentType: docFile.type || "application/octet-stream",
          cacheControl: "3600",
          upsert: false,
        });
        uploadData = retry.data;
        uploadError = retry.error;
      }

      if (!uploadError && uploadData?.path) {
        documentName = docFile.name;
        const { data: urlData } = supabase.storage
          .from("submissions")
          .getPublicUrl(uploadData.path);
        documentUrl = urlData.publicUrl;
      }
    } catch (storageErr) {
      console.error("[Submission Storage Error]:", storageErr);
    }
  }

  // Insert submission row using server admin privileges (bypasses RLS)
  const { error } = await supabase.from("submissions").insert([
    {
      author_name: payload.authorName,
      email: payload.email,
      title: payload.title,
      google_drive_link: payload.googleDriveLink,
      document_url: documentUrl,
      document_name: documentName,
      agreed_to_privacy: payload.agreedToPrivacy,
      status: payload.status,
    },
  ]);

  if (error) {
    console.error("[Submission insert error]:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/submissions");
  return { success: true };
}
