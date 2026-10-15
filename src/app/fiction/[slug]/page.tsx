import { notFound } from "next/navigation";
import Link from "next/link";
import { getFictionBySlug } from "@/services/supabaseServices";
import ArticleContentRenderer from "@/components/article/ArticleContentRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await getFictionBySlug(slug);
    const item: any = res?.data?.attributes || res?.data;
    if (item) {
      return {
        title: `${item.title} - THWARA Fiction`,
        description: item.notes || item.content?.slice(0, 160) || "Fiction piece from Thwara magazine.",
      };
    }
  } catch {
    // fallback
  }
  return { title: "Fiction - THWARA" };
}

export default async function FictionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getFictionBySlug(slug);
  const fiction: any = res?.data?.attributes || res?.data;

  if (!fiction) {
    notFound();
  }

  const isMalayalam =
    /[\u0D00-\u0D7F]/.test(fiction.title || "") ||
    /[\u0D00-\u0D7F]/.test(fiction.content || "");

  const coverUrl =
    typeof fiction.cover_image === "string"
      ? fiction.cover_image
      : fiction.coverImage?.url || null;

  const authorPhoto =
    typeof fiction.author_photo === "string"
      ? fiction.author_photo
      : fiction.authorPhoto?.url || null;

  return (
    <main className="w-full max-w-[1000px] mx-auto px-4 py-8 sm:py-12 flex flex-col bg-white">
      <article className="border-4 border-[var(--color-brand-border)] rounded-xl p-6 sm:p-12 bg-white flex flex-col gap-8 shadow-sm">
        {/* Navigation & Genre Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4">
          <Link
            href="/fiction"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5"
          >
            <span>←</span>
            <span>All Fiction</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="bg-purple-100 border border-purple-300 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded text-purple-800">
              {fiction.genre || "Story"}
            </span>
            <span className="text-neutral-400 text-xs">•</span>
            <span className="text-xs text-neutral-500 font-medium">
              {fiction.date || "2026"}
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
            {fiction.title}
          </h1>

          {/* Author Card Header */}
          <div className="flex items-center gap-3.5 pt-2 border-t border-neutral-100 mt-2">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={fiction.author_name || "Author"}
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-brand-border)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-200 border-2 border-neutral-300 flex items-center justify-center text-lg">
                👤
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-black block">
                {fiction.author_name || "Thwara Writer"}
              </span>
              {fiction.author_description && (
                <p className="text-xs text-neutral-500 line-clamp-1 max-w-lg">
                  {fiction.author_description}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        {coverUrl && (
          <figure className="w-full flex flex-col items-center">
            <img
              src={coverUrl}
              alt={fiction.title}
              className="w-full max-h-[520px] object-cover rounded-lg border-2 border-[var(--color-brand-border)] shadow-xs"
            />
          </figure>
        )}

        {/* Full Content */}
        <ArticleContentRenderer
          content={fiction.content}
          additionalImages={fiction.additional_images}
          reference={fiction.notes}
          isMalayalam={isMalayalam}
        />

        {/* Author Bio Box */}
        {fiction.author_name && (
          <section className="mt-8 p-6 bg-neutral-50 border-2 border-[var(--color-brand-border)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={fiction.author_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-brand-border)] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-[var(--color-brand-red)] tracking-wider">
                Author Profile
              </span>
              <h3 className="text-base font-bold text-black">{fiction.author_name}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {fiction.author_description || "Contributing fiction writer at THWARA magazine."}
              </p>
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-2 border-neutral-200">
          <Link
            href="/fiction"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to all fiction</span>
          </Link>

          <Link
            href="/folklore"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-green)] hover:underline"
          >
            Explore Folklore & Oral Histories →
          </Link>
        </footer>
      </article>
    </main>
  );
}
