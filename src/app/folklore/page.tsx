"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getFolklore } from "@/services/supabaseServices";
import { fieldsOf, coverOf, snippetOf } from "@/lib/content";

const CATEGORIES = [
  "All",
  "Oral Histories",
  "Folk Practices",
  "Folk Literature",
  "Myths",
  "Legends",
  "Field notes",
];

interface FolkloreItem {
  id: number;
  category: string;
  title: string;
  narrator: string;
  coverImage: string;
  spotifyUrl: string | null;
  snippet: string;
  slug: string;
}

export default function FolklorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState<FolkloreItem[] | null>(null);

  useEffect(() => {
    getFolklore(1, 50)
      .then((res) => {
        setItems(
          (res?.data ?? []).map((entity) => {
            const attr = fieldsOf(entity);
            return {
              id: entity.id,
              category: attr.category || "Oral Histories",
              title: attr.title || `Folklore Entry #${entity.id}`,
              narrator: attr.narrator_name || attr.narratorName || "Thwara Archive",
              coverImage: coverOf(attr),
              spotifyUrl: attr.spotify_url || attr.spotifyUrl || null,
              snippet: attr.reference || snippetOf(attr.content),
              slug: attr.slug || String(entity.id),
            };
          })
        );
      })
      .catch((err) => {
        console.error("[FolklorePage] Failed to load:", err);
        setItems([]);
      });
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? items ?? []
      : (items ?? []).filter((item) => item.category === activeCategory);

  return (
    <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">
        <div className="flex flex-col border-b-2 border-[var(--color-brand-border)] pb-6 items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-black uppercase underline decoration-[var(--color-brand-red)] underline-offset-8">
            Folklore & Myths
          </h1>
          <p className="max-w-2xl text-black font-medium mt-6 text-sm">
            Documenting oral histories, community narratives, and ancient tales for upcoming generations.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex overflow-x-auto no-scrollbar md:flex-wrap md:justify-center gap-4 sm:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)] pb-4 w-full border-b-2 border-dotted border-[var(--color-brand-border)] items-center md:items-start text-center md:text-left">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col border-2 border-[var(--color-brand-border)] rounded overflow-hidden group bg-white shadow-sm hover:shadow-md transition-shadow justify-between"
            >
              <Link href={`/folklore/${item.slug}`} className="block overflow-hidden">
{item.coverImage ? (
                  <img
                    src={item.coverImage}
                    className="w-full aspect-video object-cover border-b-2 border-[var(--color-brand-border)] group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                    alt={item.title}
                  />
                ) : (
                  <div className="w-full aspect-video object-cover border-b-2 border-[var(--color-brand-border)] group-hover:scale-102 transition-transform duration-300 bg-neutral-100 flex items-center justify-center">
                    <span className="text-4xl text-[var(--color-brand-red)]">✦</span>
                  </div>
                )}
              </Link>

              <div className="p-6 bg-white flex flex-col h-full gap-4">
                <div>
                  <span className="text-[var(--color-brand-red)] font-bold text-xs uppercase block mb-1">
                    {item.category}
                  </span>
                  <Link href={`/folklore/${item.slug}`} className="block">
                    <h2 className="text-2xl font-bold text-black my-2 group-hover:text-[var(--color-brand-red)] transition-colors leading-tight">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-black text-sm flex-grow leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                {item.spotifyUrl && (
                  <div className="w-full mt-2">
                    <iframe
                      style={{ borderRadius: "12px" }}
                      src={item.spotifyUrl}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex justify-between items-center w-full border-t border-[var(--color-brand-border)] pt-4 mt-auto">
                  <span className="font-bold text-xs text-neutral-600 truncate max-w-[200px]">
                    {item.narrator}
                  </span>
                  <Link
                    href={`/folklore/${item.slug}`}
                    className="font-bold text-sm text-[var(--color-brand-red)] flex items-center gap-1.5 hover:underline whitespace-nowrap"
                  >
                    Read & Explore <span className="text-lg">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {items !== null && filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center text-black font-medium text-lg">
              {items.length === 0 ? "No folklore published yet." : `No items found in ${activeCategory}.`}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}