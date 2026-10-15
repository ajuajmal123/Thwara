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
    <main className="w-full max-w-[1000px] mx-auto px-4 py-8 sm:py-12 flex flex-col bg-white">
      <article className="border-4 border-[var(--color-brand-border)] rounded-xl p-6 sm:p-12 bg-white flex flex-col gap-8 shadow-sm">
        {/* Navigation & Category Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4">
          <Link
            href="/folklore"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5"
          >
            <span>←</span>
            <span>All Folklore</span>
          </Link>

          <div className="flex items-center gap-2">
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
        <header className="flex flex-col gap-4">
          <h1
            className={`text-3xl sm:text-5xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] ${
              isMalayalam ? "font-sans leading-normal" : "font-serif"
            }`}
          >
            {folklore.title}
          </h1>

          {/* Narrator Card Header */}
          <div className="flex items-center gap-3.5 pt-2 border-t border-neutral-100 mt-2">
            {narratorPhoto ? (
              <img
                src={narratorPhoto}
                alt={folklore.narrator_name || "Narrator"}
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-brand-border)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-200 border-2 border-neutral-300 flex items-center justify-center text-lg">
                🎙️
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-black block">
                {folklore.narrator_name || "Thwara Archive"}
              </span>
              {folklore.narrator_description && (
                <p className="text-xs text-neutral-500 line-clamp-1 max-w-lg">
                  {folklore.narrator_description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Spotify Audio Embed (if provided) */}
        {folklore.spotify_url && (
          <div className="w-full bg-neutral-50 p-3 rounded-xl border-2 border-[var(--color-brand-border)]">
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
          <figure className="w-full flex flex-col items-center">
            <img
              src={coverUrl}
              alt={folklore.title}
              className="w-full max-h-[520px] object-cover rounded-lg border-2 border-[var(--color-brand-border)] shadow-xs"
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
          <section className="mt-8 p-6 bg-neutral-50 border-2 border-[var(--color-brand-border)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {narratorPhoto ? (
              <img
                src={narratorPhoto}
                alt={folklore.narrator_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-brand-border)] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl shrink-0">
                🎙️
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-[var(--color-brand-red)] tracking-wider">
                Narrator / Source
              </span>
              <h3 className="text-base font-bold text-black">{folklore.narrator_name}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
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
