import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/services/supabaseServices";
import ArticleContentRenderer from "@/components/article/ArticleContentRenderer";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const res = await getArticleBySlug(slug);
    const article: any = res?.data?.attributes || res?.data;
    if (article) {
      return {
        title: `${article.title} - THWARA Articles`,
        description: article.subheading || article.content?.slice(0, 160) || "Critical editorial piece from Thwara.",
      };
    }
  } catch {
    // fallback
  }
  return { title: "Article - THWARA" };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const res = await getArticleBySlug(slug);
  const article: any = res?.data?.attributes || res?.data;

  if (!article) {
    notFound();
  }

  const isMalayalam =
    /[\u0D00-\u0D7F]/.test(article.title || "") ||
    /[\u0D00-\u0D7F]/.test(article.content || "");

  const coverUrl =
    typeof article.cover_image === "string"
      ? article.cover_image
      : article.coverImage?.url || null;

  const authorPhoto =
    typeof article.author_photo === "string"
      ? article.author_photo
      : article.authorPhoto?.url || null;

  return (
    <main className="w-full max-w-[1000px] mx-auto px-4 py-8 sm:py-12 flex flex-col bg-white">
      <article className="border-4 border-[var(--color-brand-border)] rounded-xl p-6 sm:p-12 bg-white flex flex-col gap-8 shadow-sm">
        {/* Navigation & Category Bar */}
        <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-4">
          <Link
            href="/articles"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5"
          >
            <span>←</span>
            <span>All Articles</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="bg-neutral-100 border border-neutral-300 text-[11px] font-bold uppercase px-2.5 py-0.5 rounded text-neutral-800">
              {article.domain || "Article"}
            </span>
            <span className="text-neutral-400 text-xs">•</span>
            <span className="text-xs text-neutral-500 font-medium">
              {article.date || "2026"}
            </span>
          </div>
        </div>

        {/* Article Title */}
        <header className="flex flex-col gap-4">
          <h1
            className={`text-3xl sm:text-5xl lg:text-5xl font-bold text-black tracking-tight leading-[1.15] ${
              isMalayalam ? "font-sans leading-normal" : "font-serif"
            }`}
          >
            {article.title}
          </h1>

          {/* Author Card Header */}
          <div className="flex items-center gap-3.5 pt-2 border-t border-neutral-100 mt-2">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={article.author_name || "Author"}
                className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-brand-border)]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-neutral-200 border-2 border-neutral-300 flex items-center justify-center text-lg">
                👤
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-black block">
                {article.author_name || "Thwara Editorial"}
              </span>
              {article.author_description && (
                <p className="text-xs text-neutral-500 line-clamp-1 max-w-lg">
                  {article.author_description}
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
              alt={article.title}
              className="w-full max-h-[520px] object-cover rounded-lg border-2 border-[var(--color-brand-border)] shadow-xs"
            />
          </figure>
        )}

        {/* Article Body Content */}
        <ArticleContentRenderer
          content={article.content}
          additionalImages={article.additional_images}
          reference={article.reference}
          isMalayalam={isMalayalam}
        />

        {/* Author Bio Box */}
        {article.author_name && (
          <section className="mt-8 p-6 bg-neutral-50 border-2 border-[var(--color-brand-border)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {authorPhoto ? (
              <img
                src={authorPhoto}
                alt={article.author_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-brand-border)] shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-bold text-[var(--color-brand-red)] tracking-wider">
                Written By
              </span>
              <h3 className="text-base font-bold text-black">{article.author_name}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {article.author_description || "Contributing writer at THWARA magazine."}
              </p>
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-2 border-neutral-200">
          <Link
            href="/articles"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-red)] hover:underline flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Back to all articles</span>
          </Link>

          <Link
            href="/webzine"
            className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-green)] hover:underline"
          >
            Explore Webzine Anthologies →
          </Link>
        </footer>
      </article>
    </main>
  );
}
