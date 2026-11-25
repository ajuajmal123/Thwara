import type { ContentRow } from "@/types/schema";
import { getStrapiMedia } from "./strapi";

/** Returns the row's fields whether it arrived flat or in the legacy `attributes` shape. */
export function fieldsOf(entity: ContentRow): ContentRow {
  return entity.attributes || entity;
}

/** Resolves a row's cover image to a usable URL, or "" when it has none. */
export function coverOf(row: ContentRow): string {
  return row.cover_image || getStrapiMedia(row.coverImage?.url) || "";
}

/** Strips Markdown punctuation and trims text to a short preview. */
export function snippetOf(text: string | null | undefined, length = 140): string {
  if (!text) return "";
  const plain = text.replace(/[#*`>_[\]()]/g, "").trim();
  return plain.length > length ? `${plain.slice(0, length)}...` : plain;
}
