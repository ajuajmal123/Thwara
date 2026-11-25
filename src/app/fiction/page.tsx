"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getFictions } from "@/services/supabaseServices";
import { fieldsOf, coverOf, snippetOf } from "@/lib/content";

const CATEGORIES = ["All", "Story", "Poem", "Cartoon"];

interface FictionItem {
  id: number;
  type: string;
  title: string;
  author: string;
  coverImage: string;
  date: string;
  snippet: string;
  slug: string;
}

export default function FictionPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<FictionItem[] | null>(null);

  useEffect(() => {
    getFictions(1, 50)
      .then((res) => {
        setItems(
          (res?.data ?? []).map((entity) => {
            const attr = fieldsOf(entity);
            return {
              id: entity.id,
              type: attr.genre || "Story",
              title: attr.title || `Fiction Piece #${entity.id}`,
              author: attr.author_name || attr.authorName || "Thwara Writer",
              coverImage: coverOf(attr),
              date: attr.date || "",
              snippet: attr.notes || snippetOf(attr.content),
              slug: attr.slug || String(entity.id),
            };
          })
        );
      })
      .catch((err) => {
        console.error("[FictionPage] Failed to load:", err);
        setItems([]);
      });
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items ?? []
      : (items ?? []).filter((item) => item.type === activeCategory);

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
{item.coverImage ? (
                  <img
                    src={item.coverImage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    alt={item.title}
                  />
                ) : (
                  <div className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 bg-neutral-100 flex items-center justify-center">
                    <span className="text-4xl text-[var(--color-brand-red)]">✦</span>
                  </div>
                )}
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
                    {item.author}{item.date ? ` • ${item.date}` : ""}
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
          {items !== null && filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-black font-medium text-lg">
              {items.length === 0 ? "No fiction published yet." : "No fiction found in this category."}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}