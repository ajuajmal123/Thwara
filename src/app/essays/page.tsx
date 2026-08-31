"use client";

import { useState } from "react";
import ArticleCard from "@/components/ui/ArticleCard";
import { ARTICLES } from "@/data/articles";

export default function EssaysPage() {
    const [filterLang, setFilterLang] = useState<string>("All");
    const [filterCategory, setFilterCategory] = useState<string>("All");

    const filtered = ARTICLES.filter(item => {
        if (filterLang !== "All" && item.language !== filterLang) return false;
        if (filterCategory !== "All" && item.category !== filterCategory) return false;
        return true;
    });

    const activeBtnClass = "text-white bg-[var(--color-brand-black)]";
    const defaultBtnClass = "text-[var(--color-brand-gray)] border-transparent hover:text-[var(--color-brand-black)] hover:bg-neutral-200 transition-colors";

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">

            {/* Editorial Header */}
            <section className="bg-neutral-100 border-b-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-12 lg:p-24 pt-16 flex flex-col md:flex-row justify-between w-full">
                <div className="max-w-2xl">
                    <h1 className="font-serif text-[4rem] sm:text-[6rem] lg:text-[8rem] font-medium leading-[0.8] tracking-tighter text-[var(--color-brand-black)] uppercase break-words w-full">
                        Essays
                    </h1>
                    <p className="mt-8 text-sm md:text-[15px] text-[var(--color-brand-gray)] max-w-md leading-relaxed selection:bg-[var(--color-brand-black)] selection:text-white">
                        Critical writing, research and reflections on culture, society, history and the worlds we inhabit.
                    </p>
                </div>
            </section>

            {/* Main Listing Layout */}
            <section className="flex flex-col xl:flex-row w-full min-h-[60vh]">

                {/* Sidebar Filters */}
                <aside className="w-full xl:w-[25%] flex flex-col border-b-[0.5px] xl:border-b-0 xl:border-r-[0.5px] border-[var(--color-brand-border)]">
                    <div className="p-8 sm:p-12 sticky top-24">

                        {/* Category Filter */}
                        <div className="mb-12">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] mb-5">Category</h3>
                            <div className="flex flex-col gap-2 text-[11px] uppercase tracking-widest font-semibold items-start">
                                {["All", "Research", "Essays", "Social Commentary", "Personal Narratives", "Interviews"].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-3 py-2 border-[0.5px] ${filterCategory === cat ? activeBtnClass : defaultBtnClass}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div className="mb-12">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] mb-5">Language</h3>
                            <div className="flex flex-col gap-2 text-[11px] uppercase tracking-widest font-semibold items-start">
                                {["All", "English", "മലയാളം"].map(lg => (
                                    <button
                                        key={lg}
                                        onClick={() => setFilterLang(lg)}
                                        className={`px-3 py-2 border-[0.5px] ${filterLang === lg ? activeBtnClass : defaultBtnClass} ${lg === 'മലയാളം' ? 'font-sans normal-case' : ''}`}
                                    >
                                        {lg}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </aside>

                {/* Index List Using Real ArticleCard Components */}
                <div className="w-full xl:w-[75%] p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {filtered.length === 0 && (
                            <div className="col-span-1 md:col-span-2 p-8 sm:p-12 text-[13px] text-[var(--color-brand-gray)]">
                                No essays match these filters.
                            </div>
                        )}
                        {filtered.map((item, i) => (
                            <div key={item.id} className={`border-b-[0.5px] border-[var(--color-brand-border)] ${(i + 1) % 2 !== 0 ? 'md:border-r-[0.5px]' : ''}`}>
                                <ArticleCard article={item} variant="featured" />
                            </div>
                        ))}
                    </div>
                </div>

            </section>
        </main>
    );
}
