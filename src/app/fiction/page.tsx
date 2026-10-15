"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getFictions } from "@/services/supabaseServices";

const CATEGORIES = ["All", "Story", "Poem", "Cartoon"];

export default function FictionPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<any[]>([
    {
      id: 1,
      type: "Story",
      title: "Midnight City",
      author: "Thwara Collective",
      coverImage: "https://picsum.photos/seed/fiction_pg1/400/400",
      date: "2026",
      slug: "1",
      snippet:
        "An evocative tale that explores memory and imagination, blurring the lines between reality and dreamscape.",
    },
    {
      id: 2,
      type: "Poem",
      title: "Verses Across the Border",
      author: "Thwara Collective",
      coverImage: "https://picsum.photos/seed/fiction_pg2/400/400",
      date: "2026",
      slug: "2",
      snippet:
        "Poetic reflections delving into the geography of language and community resilience.",
    },
  ]);

  useEffect(() => {
    async function fetchLiveFiction() {
      try {
        const res = await getFictions(1, 50);
        if (res?.data && res.data.length > 0) {
          const mapped = res.data.map((entity: any) => {
            const attr = entity.attributes || entity;
            const cover =
              attr.cover_image ||
              attr.coverImage?.url ||
              `https://picsum.photos/seed/fiction${entity.id}/400/400`;

            const snippet =
              attr.notes ||
              (attr.content
                ? attr.content
                    .replace(/[#*`>_\[\]\(\)]/g, "")
                    .trim()
                    .slice(0, 140) + "..."
                : "An evocative literary narrative exploring imagination and lived experience.");

            return {
              id: entity.id,
              type: attr.genre || "Story",
              title: attr.title || `Fiction Piece #${entity.id}`,
              author: attr.author_name || attr.authorName || "Thwara Writer",
              coverImage: cover,
              date: attr.date || "2026",
              snippet,
              slug: attr.slug || String(entity.id),
            };
          });
          setItems(mapped);
        }
      } catch (err) {
        console.log("Using static fiction as fallback", err);
      }
    }
    fetchLiveFiction();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.type === activeCategory);

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--color-brand-border)] pb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-black uppercase">
            Fiction & Poetry
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

        <div className="flex flex-col gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col md:flex-row gap-6 border-2 border-[var(--color-brand-border)] rounded p-5 sm:p-6 bg-white shrink-0 items-center hover:bg-neutral-50/70 transition-colors group"
            >
              <Link href={`/fiction/${item.slug}`} className="w-full md:w-52 aspect-square shrink-0 block overflow-hidden rounded border-2 border-[var(--color-brand-border)]">
                <img
                  src={item.coverImage}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  alt={item.title}
                />
              </Link>
              <div className="flex flex-col text-left justify-center w-full">
                <span className="text-[var(--color-brand-red)] font-bold text-xs tracking-widest uppercase mb-1">
                  {item.type}
                </span>
                <Link href={`/fiction/${item.slug}`} className="block">
                  <h2 className="text-2xl md:text-3xl font-bold text-black mb-2 group-hover:text-[var(--color-brand-red)] transition-colors leading-tight">
                    {item.title}
                  </h2>
                </Link>
                <p className="text-black text-sm mb-4 leading-relaxed max-w-2xl">
                  {item.snippet}
                </p>
                <div className="flex justify-between items-center w-full border-t border-[var(--color-brand-border)] pt-4 mt-auto">
                  <span className="font-bold text-black text-sm">
                    {item.author} • {item.date}
                  </span>
                  <Link
                    href={`/fiction/${item.slug}`}
                    className="flex items-center font-bold text-sm text-[var(--color-brand-red)] group-hover:underline"
                  >
                    Read More <span className="text-xl ml-1.5 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-black font-medium text-lg">
              No fiction found in this category.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}