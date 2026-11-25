"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getArticles } from "@/services/supabaseServices";
import { fieldsOf, coverOf, snippetOf } from "@/lib/content";

const CATEGORIES = [
  "All",
  "Literature",
  "Library",
  "Psychology",
  "History",
  "Politics",
  "Culture",
  "Fashion",
  "Photo story",
  "Travelogue",
  "Memoir",
];

interface ArticleItem {
  id: number;
  category: string;
  title: string;
  author: string;
  coverImage: string;
  snippet: string;
  slug: string;
}

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<ArticleItem[] | null>(null);

  useEffect(() => {
    getArticles(1, 50)
      .then((res) => {
        setItems(
          (res?.data ?? []).map((entity) => {
            const attr = fieldsOf(entity);
            return {
              id: entity.id,
              category: attr.domain || "Literature",
              title: attr.title || `Article #${entity.id}`,
              author: attr.author_name || attr.authorName || "Thwara Editorial",
              coverImage: coverOf(attr),
              snippet: attr.subheading || snippetOf(attr.content),
              slug: attr.slug || String(entity.id),
            };
          })
        );
      })
      .catch((err) => {
        console.error("[ArticlesPage] Failed to load:", err);
        setItems([]);
      });
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items ?? []
      : (items ?? []).filter((item) => item.category === activeCategory);

  return (
    <main className="w-full max-w-[1400px] mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col bg-white overflow-hidden">
      <section className="border-2 sm:border-4 border-[var(--color-brand-border)] rounded-lg p-4 sm:p-8 md:p-10 bg-white flex flex-col gap-6 sm:gap-8 max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--color-brand-border)] pb-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black uppercase break-words">
            Articles & Essays
          </h1>
        </div>

        {/* Filter Categories */}
        <div className="flex overflow-x-auto no-scrollbar md:flex-wrap gap-4 sm:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)] pb-4 w-full items-center md:items-start text-center md:text-left">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cursor-pointer whitespace-nowrap flex-shrink-0 transition-colors ${
                activeCategory === cat
                  ? "text-[var(--color-brand-red)] border-b-2 border-[var(--color-brand-red)] pb-1"
                  : "hover:text-[var(--color-brand-red)]"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col border-2 border-[var(--color-brand-border)] rounded p-4 group bg-white shadow-sm hover:shadow-md transition-shadow justify-between max-w-full overflow-hidden"
            >
              <div className="min-w-0">
                <Link href={`/articles/${item.slug}`} className="block overflow-hidden rounded mb-4">
{item.coverImage ? (
                  <img
                    src={item.coverImage}
                    className="w-full aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                    alt={item.title}
                  />
                ) : (
                  <div className="w-full aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] group-hover:scale-102 transition-transform duration-300 bg-neutral-100 flex items-center justify-center">
                    <span className="text-4xl text-[var(--color-brand-red)]">✦</span>
                  </div>
                )}
                </Link>
                <span className="text-[var(--color-brand-red)] font-bold text-xs uppercase mb-1 block">
                  {item.category}
                </span>
                <Link href={`/articles/${item.slug}`} className="block min-w-0">
                  <h2 className="text-xl font-bold text-black mb-2 leading-tight line-clamp-2 group-hover:text-[var(--color-brand-red)] transition-colors break-words [overflow-wrap:anywhere]">
                    {item.title}
                  </h2>
                </Link>
                <p className="text-black text-sm mb-4 line-clamp-3 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {item.snippet}
                </p>
              </div>

              <div className="mt-auto flex justify-between items-center text-black border-t-2 border-dotted border-[var(--color-brand-border)] pt-4">
                <span className="font-bold text-xs uppercase text-neutral-700 truncate max-w-[170px]">
                  {item.author}
                </span>
                <Link
                  href={`/articles/${item.slug}`}
                  className="font-bold text-xs flex items-center gap-1 text-[var(--color-brand-red)] hover:underline whitespace-nowrap"
                >
                  READ MORE <span className="text-lg">→</span>
                </Link>
              </div>
            </article>
          ))}
          {items !== null && filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-black font-medium text-lg">
              {items.length === 0 ? "No articles published yet." : "No articles found in this category."}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}