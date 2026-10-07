"use client";

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = ["All", "Literature", "Library", "Psychology", "History", "Politics", "Culture", "Fashion", "Photo story", "Travelogue", "Memoir"];

export default function ArticlesPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const items = [
        { id: 1, category: "Literature" },
        { id: 2, category: "History" },
        { id: 3, category: "Culture" },
        { id: 4, category: "Politics" },
        { id: 5, category: "Memoir" },
        { id: 6, category: "Travelogue" },
    ];

    const filteredItems = activeCategory === "All" ? items : items.filter(item => item.category === activeCategory);

    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--color-brand-border)] pb-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase">Articles & Essays</h1>
                </div>

                {/* Filter Categories */}
                <div className="grid grid-cols-3 md:flex md:flex-row md:flex-wrap gap-y-3 gap-x-2 sm:gap-6 text-[10px] sm:text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)] pb-2 w-full place-items-center md:place-items-start text-center md:text-left">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="flex flex-col border-2 border-[var(--color-brand-border)] rounded p-4 group bg-white shadow-sm hover:shadow-md transition-shadow">
                            <img src={`https://picsum.photos/seed/articles${item.id}/600/400`} className="w-full aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] mb-4" loading="lazy" />
                            <span className="text-[var(--color-brand-red)] font-bold text-xs uppercase mb-1">{item.category}</span>
                            <h2 className="text-xl font-bold text-black mb-2 leading-tight">Critical Analysis on Subject #{item.id}</h2>
                            <p className="text-black text-sm mb-4 line-clamp-3">
                                A comprehensive look at the intersection of modern culture and traditional practices, highlighting key insights and perspectives.
                            </p>
                            <div className="mt-auto flex justify-between items-center text-black border-t-2 border-dotted border-[var(--color-brand-border)] pt-4">
                                <span className="font-bold text-xs uppercase text-[var(--color-brand-red)]">John Doe</span>
                                <Link href="#" className="font-bold text-xs flex items-center gap-1 group-hover:text-[var(--color-brand-red)]">
                                    READ <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
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