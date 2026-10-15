"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getWebzines } from "@/services/strapiServices";
import { WEBZINE_PROJECTS } from "@/data/webzine";
import { getStrapiMedia } from "@/lib/strapi";

const CATEGORIES = ["All", "Visual Essay", "Digital Storytelling", "Experimental Archive", "Interactive Essay", "Image + Text", "Collaborative Fiction"];

export default function WebzinePage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [items, setItems] = useState<any[]>(() => {
        return WEBZINE_PROJECTS.map((p, idx) => ({
            id: p.id,
            category: p.type,
            title: p.title,
            slug: p.slug,
            date: p.date,
            coverImage: `https://picsum.photos/seed/webzine_cover${idx + 1}/400/550`,
            articlesCount: 0,
        }));
    });

    useEffect(() => {
        async function fetchLiveIssues() {
            try {
                const res = await getWebzines();
                if (res?.data && res.data.length > 0) {
                    const mapped = res.data.map((entity: any) => {
                        const attr = entity.attributes || entity;
                        const coverUrl = attr.cover_image || (attr.coverImage?.data?.attributes?.url
                            ? getStrapiMedia(attr.coverImage.data.attributes.url)
                            : `https://picsum.photos/seed/webzine_cover${entity.id}/400/550`);

                        const artCount = Array.isArray(attr.articles) ? attr.articles.length : (attr.articles?.data?.length || 0);
                        const ficCount = Array.isArray(attr.fictions) ? attr.fictions.length : 0;
                        const folCount = Array.isArray(attr.folklores) ? attr.folklores.length : 0;
                        const telCount = Array.isArray(attr.tellings) ? attr.tellings.length : 0;
                        const totalWorks = artCount + ficCount + folCount + telCount;

                        return {
                            id: entity.id,
                            category: attr.domain || "Visual Essay",
                            title: attr.title || attr.webzine_name || attr.webzineName || attr.workName || `Issue #${entity.id}`,
                            slug: attr.slug || (entity.id).toString(),
                            date: attr.date || "2026",
                            coverImage: coverUrl,
                            articlesCount: totalWorks,
                        };
                    });
                    setItems(mapped);
                }
            } catch (err) {
                // Keep default static items gracefully if Strapi is offline or seeding
                console.log("Using static Webzine issues as fallback");
            }
        }
        fetchLiveIssues();
    }, []);

    const filteredItems = activeCategory === "All" ? items : items.filter(item => item.category === activeCategory);

    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-10">

                <div className="flex items-center justify-between border-b-2 border-[var(--color-brand-border)] pb-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase underline decoration-[var(--color-brand-green)] underline-offset-8">Webzine Issues</h1>
                    <span className="text-[var(--color-brand-red)] text-5xl font-bold hidden md:block">↓</span>
                </div>

                {/* Filter Categories */}
                <div className="flex overflow-x-auto no-scrollbar md:flex-wrap gap-4 sm:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)] pb-4 w-full items-center md:items-start text-center md:text-left">
                    {CATEGORIES.map(cat => (
                        <span
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`cursor-pointer whitespace-nowrap flex-shrink-0 transition-colors ${activeCategory === cat ? 'text-[var(--color-brand-red)] border-b-2 border-[var(--color-brand-red)] pb-1' : 'hover:text-[var(--color-brand-red)]'}`}
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="flex flex-col items-center p-4 border-2 border-[var(--color-brand-border)] rounded bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                            <img src={item.coverImage} className="w-full aspect-[3/4] object-cover border-2 border-black rounded shadow" loading="lazy" alt={item.title} />
                            <span className="text-[var(--color-brand-red)] font-bold text-[10px] uppercase mt-2 tracking-widest">{item.category}</span>
                            <h2 className="text-xl font-bold text-black mt-2 text-center line-clamp-1">{item.title}</h2>
                            <p className="text-black font-medium text-xs mt-1 mb-4">{item.date}</p>

                            <Link
                                href={`/webzine/${item.slug || "monsoon-notes"}`}
                                className="w-full border-2 border-[var(--color-brand-red)] text-black py-2 rounded text-sm font-bold hover:bg-[var(--color-brand-red)] hover:text-white transition-colors uppercase text-center block"
                            >
                                {item.articlesCount > 0 ? `Read Online (${item.articlesCount} Works)` : "Read Online"}
                            </Link>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-12 text-center text-black font-medium text-lg">
                            No webzine project found in {activeCategory}.
                        </div>
                    )}
                </div>

            </section>
        </main>
    );
}