"use client";

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = ["All", "Oral Histories", "Folk Practices", "Folk Literature", "Myths", "Legends", "Field notes"];

export default function FolklorePage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const items = [
        { id: 1, category: "Oral Histories", hasSpotify: true },
        { id: 2, category: "Myths", hasSpotify: false },
        { id: 3, category: "Field notes", hasSpotify: true },
        { id: 4, category: "Legends", hasSpotify: false },
        { id: 5, category: "Folk Practices", hasSpotify: false },
        { id: 6, category: "Folk Literature", hasSpotify: false },
    ];

    const filteredItems = activeCategory === "All" ? items : items.filter(item => item.category === activeCategory);

    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">

                <div className="flex flex-col border-b-2 border-[var(--color-brand-border)] pb-6 items-center text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase underline decoration-[var(--color-brand-red)] underline-offset-8">Folklore & Myths</h1>
                    <p className="max-w-2xl text-black font-medium mt-6 text-sm">Documenting oral histories, community narratives, and ancient tales for the upcoming generations.</p>
                </div>

                {/* Filter Categories */}
                <div className="flex overflow-x-auto no-scrollbar md:flex-wrap md:justify-center gap-4 sm:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)] pb-4 w-full border-b-2 border-dotted border-[var(--color-brand-border)] items-center md:items-start text-center md:text-left">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="flex flex-col border-2 border-[var(--color-brand-border)] rounded overflow-hidden group">
                            <img src={`https://picsum.photos/seed/folklore_pg${item.id}/800/400`} className="w-full aspect-video object-cover border-b-2 border-[var(--color-brand-border)]" loading="lazy" />
                            <div className="p-6 bg-white flex flex-col h-full gap-4">
                                <div>
                                    <span className="text-[var(--color-brand-red)] font-bold text-xs uppercase">{item.category}</span>
                                    <h2 className="text-2xl font-bold text-black my-2">The Legend of the Coast #{item.id}</h2>
                                    <p className="text-black text-sm flex-grow">
                                        Exploring stories rooted deeply in local tradition, investigating meaning that transcended generations...
                                    </p>
                                </div>
                                {item.hasSpotify && (
                                    <div className="w-full">
                                        <iframe
                                            style={{ borderRadius: '12px' }}
                                            src={`https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator&theme=0`}
                                            width="100%"
                                            height="152"
                                            frameBorder="0"
                                            allowFullScreen
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                )}
                                <Link href="#" className="font-bold text-sm text-black flex items-center gap-2 group-hover:text-[var(--color-brand-red)] border-t border-[var(--color-brand-border)] pt-4 mt-auto">
                                    Explore Feature <span className="text-[var(--color-brand-red)] text-xl">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="col-span-full py-12 text-center text-black font-medium text-lg">
                            No items found in {activeCategory}.
                        </div>
                    )}
                </div>

            </section>
        </main>
    );
}