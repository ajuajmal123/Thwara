"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getArticles } from "@/services/supabaseServices";
import { getStrapiMedia } from "@/lib/strapi";

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

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<any[]>([
    {
      id: 1,
      category: "Literature",
      title: "Critical Analysis on Subject #1",
      author: "Thwara Collective",
      coverImage: "https://picsum.photos/seed/articles1/600/400",
      slug: "1",
      snippet: "A comprehensive look at the intersection of modern culture and traditional practices.",
    },
    {
      id: 2,
      category: "History",
      title: "Critical Analysis on Subject #2",
      author: "Thwara Collective",
      coverImage: "https://picsum.photos/seed/articles2/600/400",
      slug: "2",
      snippet: "Investigating historical trajectories and cultural transformations.",
    },
  ]);

  useEffect(() => {
    async function fetchLiveArticles() {
      try {
        const res = await getArticles(1, 50);
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((entity: any) => {
            const attr = entity.attributes || entity;
            let cover = attr.cover_image;
            if (!cover && attr.coverImage?.url) {
              cover = getStrapiMedia(attr.coverImage.url);
            }
            if (!cover) {
              cover = `https://picsum.photos/seed/articles${entity.id}/600/400`;
            }

            const snippet =
              attr.subheading ||
              (attr.content
                ? attr.content
                    .replace(/[#*`>_\[\]\(\)]/g, "")
                    .trim()
                    .slice(0, 140) + "..."
                : "A comprehensive critical look at cultural perspectives and narratives.");

            return {
              id: entity.id,
              category: attr.domain || "Literature",
              title: attr.title || `Article #${entity.id}`,
              author: attr.author_name || attr.authorName || "Thwara Editorial",
              coverImage: cover,
              snippet,
              slug: attr.slug || String(entity.id),
            };
          });
          setItems(mapped);
        }
      } catch (err) {
        console.log("Using static articles as fallback", err);
      }
    }
    fetchLiveArticles();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

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
                  <img
                    src={item.coverImage}
                    className="w-full aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                    alt={item.title}
                  />
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
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-black font-medium text-lg">
              No articles found in this category.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}