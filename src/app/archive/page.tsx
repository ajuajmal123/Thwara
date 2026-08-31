"use client";

import { useState } from "react";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { CREATIVE_WORKS } from "@/data/creative";
import { WEBZINE_PROJECTS } from "@/data/webzine";

export default function ArchivePage() {
    const [filterLang, setFilterLang] = useState<string>("All");
    const [filterForm, setFilterForm] = useState<string>("All");
    const [filterYear, setFilterYear] = useState<string>("All");

    const allContent = [
        ...ARTICLES.map(a => ({ ...a, origin: 'Essay', form: a.category, href: `/essays/${a.slug}` })),
        ...CREATIVE_WORKS.map(c => ({ ...c, origin: 'Creative', form: c.type, href: `/creative/${c.slug}` })),
        ...WEBZINE_PROJECTS.map(w => ({ ...w, origin: 'Webzine', form: w.type, author: w.contributors.join(', '), href: `/webzine/${w.slug}` }))
    ];

    // Sorting strictly by Date (most recent first natively, but since it's mock, we mock it)
    // Our dates are strings like "Aug 22, 2026", we'll just extract the year for the year filter.

    const filtered = allContent.filter(item => {
        // Check Lang
        if (filterLang !== "All") {
            if (item.language !== filterLang) return false;
        }

        // Check Form (e.g., Poetry, Research, Webzine type)
        if (filterForm !== "All") {
            if (item.form !== filterForm) return false;
        }

        // Check Year
        if (filterYear !== "All") {
            if (!item.date.includes(filterYear)) return false;
        }

        return true;
    });

    const activeBtnClass = "text-white bg-[var(--color-brand-red)] border-[var(--color-brand-red)]";
    const defaultBtnClass = "text-[var(--color-brand-gray)] bg-transparent hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-colors border-[var(--color-brand-border)]";

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">

            {/* Editorial Header */}
            <section className="bg-neutral-50 text-[var(--color-brand-black)] border-b-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-12 lg:p-24 pt-16 lg:pt-24 flex flex-col md:flex-row justify-between w-full">
                <div className="max-w-2xl">
                    <h1 className="font-serif text-[4rem] sm:text-[6rem] lg:text-[8rem] font-medium leading-[0.8] tracking-tighter uppercase break-words w-full text-[var(--color-brand-red)]">
                        Archive
                    </h1>
                    <p className="mt-8 text-sm md:text-base text-[var(--color-brand-gray)] max-w-md leading-relaxed selection:bg-[var(--color-brand-red)] selection:text-white">
                        Explore THWARA's writing, research and creative work across languages, forms and years. An evolving record of critical thought.
                    </p>
                </div>
            </section>

            {/* Database View Container */}
            <section className="flex flex-col xl:flex-row w-full min-h-[60vh]">

                {/* Sidebar Filters */}
                <aside className="w-full xl:w-[25%] flex flex-col border-b-[0.5px] xl:border-b-0 xl:border-r-[0.5px] border-[var(--color-brand-border)]">
                    <div className="p-8 sm:p-12 sticky top-24">

                        {/* Year Filter */}
                        <div className="mb-12">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-5">Year</h3>
                            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-widest font-semibold">
                                {["All", "2026", "2025"].map(yr => (
                                    <button
                                        key={yr}
                                        onClick={() => setFilterYear(yr)}
                                        className={`px-3 py-1.5 border-[0.5px] ${filterYear === yr ? activeBtnClass : defaultBtnClass}`}
                                    >
                                        {yr}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language Filter */}
                        <div className="mb-12">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-5">Language</h3>
                            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-widest font-semibold">
                                {["All", "English", "മലയാളം"].map(lg => (
                                    <button
                                        key={lg}
                                        onClick={() => setFilterLang(lg)}
                                        className={`px-3 py-1.5 border-[0.5px] ${filterLang === lg ? activeBtnClass : defaultBtnClass} ${lg === 'മലയാളം' ? 'font-sans normal-case' : ''}`}
                                    >
                                        {lg}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Form Filter */}
                        <div>
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-5">Form</h3>
                            <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-widest font-semibold">
                                {["All", "Research", "Essays", "Poetry", "Fiction", "Personal Narratives", "Visual Art", "Social Commentary", "Experimental"].map(frm => (
                                    <button
                                        key={frm}
                                        onClick={() => setFilterForm(frm)}
                                        className={`px-3 py-1.5 border-[0.5px] ${filterForm === frm ? activeBtnClass : defaultBtnClass}`}
                                    >
                                        {frm}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </aside>

                {/* Index Table Layout */}
                <div className="w-full xl:w-[75%] p-0">
                    {/* Desktop Table Header */}
                    <div className="hidden md:flex flex-row items-center border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-100 p-6 px-8 sm:px-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-red)]">
                        <div className="w-[50%]">Title & Author</div>
                        <div className="w-[20%]">Form</div>
                        <div className="w-[15%]">Language</div>
                        <div className="w-[15%] text-right">Date</div>
                    </div>

                    {/* Results List */}
                    <div className="flex flex-col">
                        {filtered.length === 0 && (
                            <div className="p-8 sm:p-12 text-[13px] text-[var(--color-brand-gray)]">
                                No publications found matching the applied matrix filters.
                            </div>
                        )}
                        {filtered.map((item, i) => (
                            <Link href={item.href} key={i} className="flex flex-col md:flex-row md:items-center border-b-[0.5px] border-[var(--color-brand-border)] p-6 px-8 sm:px-12 hover:bg-neutral-50 transition-colors group">
                                <div className="w-full md:w-[50%] flex flex-col mb-4 md:mb-0 pr-4">
                                    <h4 className="font-serif text-xl md:text-2xl text-[var(--color-foreground)] group-hover:italic group-hover:text-[var(--color-brand-red)] transition-all">
                                        {item.title}
                                    </h4>
                                    <span className="text-[12px] font-medium text-[var(--color-brand-gray)] mt-2 group-hover:text-[var(--color-brand-black)] transition-colors">
                                        {item.author}
                                    </span>
                                </div>
                                <div className="w-full md:w-[20%] mb-2 md:mb-0 text-[11px] uppercase tracking-widest text-[var(--color-brand-black)] font-semibold">
                                    {item.form}
                                </div>
                                <div className="w-full md:w-[15%] mb-2 md:mb-0 text-[11px] tracking-widest text-[var(--color-brand-gray)]">
                                    {item.language}
                                </div>
                                <div className="w-full md:w-[15%] md:text-right text-[11px] uppercase tracking-widest text-[var(--color-brand-black)] font-semibold group-hover:text-[var(--color-brand-red)] transition-colors">
                                    {item.date}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </section>
        </main>
    );
}
