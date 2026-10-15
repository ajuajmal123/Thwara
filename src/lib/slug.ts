/**
 * Automatically converts a title into a clean URL slug.
 * Supports Latin and Unicode scripts (such as Malayalam) and numbers.
 *
 * Example:
 * "Who Gets to Remember a City?" -> "who-gets-to-remember-a-city"
 * "ഭാഷയുടെ അതിരുകൾക്കപ്പുറം" -> "ഭാഷയുടെ-അതിരുകൾക്കപ്പുറം"
 */
export function generateSlug(title: string): string {
  if (!title) return "untitled";
  const clean = title
    .toString()
    .trim()
    .toLowerCase()
    // Replace whitespace, punctuation, and non-alphanumeric unicode characters with hyphens
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, "");

  return clean || "untitled";
}
