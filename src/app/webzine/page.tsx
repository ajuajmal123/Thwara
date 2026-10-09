"use client";

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = ["All", "Visual Essay", "Digital Storytelling", "Experimental Archive", "Interactive Essay", "Image + Text", "Collaborative Fiction"];

export default function WebzinePage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const items = [
        { id: 1, category: "Visual Essay", title: "Monsoon Notes", date: "Oct 2026" },
        { id: 2, category: "Digital Storytelling", title: "A City in Fragments", date: "Sep 2026" },
        { id: 3, category: "Experimental Archive", title: "Listening to the Coast", date: "Aug 2026" },
        { id: 4, category: "Interactive Essay", title: "Between Two Languages", date: "Jul 2026" },
        { id: 5, category: "Image + Text", title: "The Unfinished Archive", date: "May 2026" },
        { id: 6, category: "Collaborative Fiction", title: "Letters From Elsewhere", date: "Mar 2026" },
        { id: 7, category: "Visual Essay", title: "Winter Solstice", date: "Dec 2025" },
        { id: 8, category: "Image + Text", title: "Urban Chronicles", date: "Nov 2025" },
    ];

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
                            <img src={`https://picsum.photos/seed/webzine_cover${item.id}/400/550`} className="w-full aspect-[3/4] object-cover border-2 border-black rounded shadow" loading="lazy" />
                            <span className="text-[var(--color-brand-red)] font-bold text-[10px] uppercase mt-2 tracking-widest">{item.category}</span>
                            <h2 className="text-xl font-bold text-black mt-2 text-center">{item.title}</h2>
                            <p className="text-black font-medium text-xs mt-1 mb-4">{item.date}</p>
                            <button className="w-full border-2 border-[var(--color-brand-red)] text-black py-2 rounded text-sm font-bold hover:bg-[var(--color-brand-red)] hover:text-white transition-colors uppercase">
                                Read Online
                            </button>
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