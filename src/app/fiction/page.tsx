"use client";

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = ["All", "Story", "Poem", "Cartoon"];

export default function FictionPage() {
    const [activeCategory, setActiveCategory] = useState("All");

    const items = [
        { id: 1, type: "Story" },
        { id: 2, type: "Poem" },
        { id: 3, type: "Cartoon" }
    ];

    const filteredItems = activeCategory === "All" ? items : items.filter(item => item.type === activeCategory);

    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[var(--color-brand-border)] pb-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase">Fiction</h1>
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

                <div className="flex flex-col gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row gap-6 border-2 border-[var(--color-brand-border)] rounded p-6 bg-white shrink-0 items-center hover:bg-neutral-50 transition-colors">
                            <img src={`https://picsum.photos/seed/fiction_pg${item.id}/300/300`} className="w-48 h-48 object-cover rounded border-2 border-[var(--color-brand-border)]" loading="lazy" />
                            <div className="flex flex-col text-left justify-center w-full">
                                <span className="text-[var(--color-brand-red)] font-bold text-xs tracking-widest uppercase mb-1">{item.type}</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">Midnight City #{item.id}</h2>
                                <p className="text-black text-sm mb-4 leading-relaxed max-w-2xl">
                                    An evocative tale that explores memory and imagination, blurring the lines between reality and dreamscape in a rapidly evolving world.
                                </p>
                                <div className="flex justify-between items-center w-full border-t border-[var(--color-brand-border)] pt-4 mt-auto">
                                    <span className="font-bold text-black text-sm">Author • Feb 10, 2026</span>
                                    <Link href="#" className="flex items-center font-bold text-[var(--color-brand-red)] group">
                                        Read <span className="text-xl ml-2 group-hover:translate-x-2 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
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