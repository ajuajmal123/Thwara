import { notFound } from "next/navigation";
import Link from "next/link";
import { getFolkloreBySlug } from "@/services/supabaseServices";
import ArticleContentRenderer from "@/components/article/ArticleContentRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await getFolkloreBySlug(slug);
    const item: any = res?.data?.attributes || res?.data;
    if (item) {
      return {
        title: `${item.title} - THWARA Folklore & Oral Histories`,
        description: item.reference || item.content?.slice(0, 160) || "Documenting community narratives and oral histories.",
      };
    }
  } catch {
    // fallback
  }
  return { title: "Folklore - THWARA" };
}

export default async function FolkloreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getFolkloreBySlug(slug);
  const folklore: any = res?.data?.attributes || res?.data;

  if (!folklore) {
    notFound();
  }

  const isMalayalam =
    /[\u0D00-\u0D7F]/.test(folklore.title || "") ||
    /[\u0D00-\u0D7F]/.test(folklore.content || "");

  const coverUrl =
    typeof folklore.cover_image === "string"
      ? folklore.cover_image
      : folklore.coverImage?.url || null;

  const narratorPhoto =
    typeof folklore.narrator_photo === "string"
      ? folklore.narrator_photo
      : folklore.narratorPhoto?.url || null;

  return (
    <main className="w-full max-w-[1000px] mx-auto px-3 sm:px-6 py-6 sm:py-12 flex flex-col bg-white overflow-hidden">
      <article className="border-2 sm:border-4 border-[var(--color-brand-border)] rounded-xl p-4 sm:p-8 md:p-12 bg-white flex flex-col gap-6 sm:gap-8 shadow-sm max-w-full overflow-hidden">
        {/* Navigation & Category Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-neutral-200 pb-3 sm:pb-4">
          <Link
            href="/folklore"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5 shrink-0"
          >
            <span>←</span>
            <span>All Folklore</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-amber-100 border border-amber-300 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded text-amber-800">
              {folklore.category || "Oral Histories"}
            </span>
            <span className="text-neutral-400 text-xs">•</span>
            <span className="text-xs text-neutral-500 font-medium">
              {folklore.date || "2026"}
            </span>
          </div>
        </div>

        {/* Title */}
        <header className="flex flex-col gap-4 max-w-full overflow-hidden">
          <h1
            className={`text-2xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-[1.2] break-words [overflow-wrap:anywhere] ${
              isMalayalam ? "font-sans leading-normal" : "font-serif"
            }`}
          >
            {folklore.title}
          </h1>

          {/* Narrator Card Header */}
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 mt-2 max-w-full overflow-hidden">
            {narratorPhoto ? (
              <img
                src={narratorPhoto}
                alt={folklore.narrator_name || "Narrator"}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[var(--color-brand-border)] shrink-0"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-200 border-2 border-neutral-300 flex items-center justify-center text-lg shrink-0">
                🎙️
              </div>
            )}
            <div className="min-w-0 flex-1 overflow-hidden">
              <span className="text-sm font-bold text-black block truncate">
                {folklore.narrator_name || "Thwara Archive"}
              </span>
              {folklore.narrator_description && (
                <p className="text-xs text-neutral-500 line-clamp-2 max-w-lg break-words [overflow-wrap:anywhere]">
                  {folklore.narrator_description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Spotify Audio Embed (if provided) */}
        {folklore.spotify_url && (
          <div className="w-full max-w-full overflow-hidden bg-neutral-50 p-3 rounded-xl border-2 border-[var(--color-brand-border)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              🎙️ Listen to Oral Recording / Podcast
            </span>
            <iframe
              style={{ borderRadius: "12px" }}
              src={folklore.spotify_url}
              width="100%"
              height="152"
              frameBorder="0"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}

        {/* Featured Cover Image */}
        {coverUrl && (
          <figure className="w-full max-w-full flex flex-col items-center overflow-hidden">
            <img
              src={coverUrl}
              alt={folklore.title}
              className="w-full max-w-full h-auto max-h-[520px] object-cover rounded-lg border-2 border-[var(--color-brand-border)] shadow-xs"
            />
          </figure>
        )}

        {/* Full Narrative Content */}
        <ArticleContentRenderer
          content={folklore.content}
          additionalImages={folklore.additional_images}
          reference={folklore.reference}
          isMalayalam={isMalayalam}
        />

        {/* Narrator Bio Box */}
        {folklore.narrator_name && (
          <section className="mt-8 p-4 sm:p-6 bg-neutral-50 border-2 border-[var(--color-brand-border)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-full overflow-hidden">
            {narratorPhoto ? (
              <img
                src={narratorPhoto}
                alt={folklore.narrator_name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[var(--color-brand-border)] shrink-0"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl shrink-0">
                🎙️
              </div>
            )}
            <div className="flex flex-col gap-1 min-w-0 flex-1 overflow-hidden">
              <span className="text-xs uppercase font-bold text-[var(--color-brand-red)] tracking-wider">
                Narrator / Source
              </span>
              <h3 className="text-base font-bold text-black break-words [overflow-wrap:anywhere]">{folklore.narrator_name}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed break-words [overflow-wrap:anywhere]">
                {folklore.narrator_description || "Documented and archived for upcoming generations."}
              </p>
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-2 border-neutral-200">
          <Link
            href="/folklore"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to all folklore</span>
          </Link>

          <Link
            href="/tellings"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-green)] hover:underline"
          >
            Listen to Tellings & Audio Series →
          </Link>
        </footer>
      </article>
    </main>
  );
}
