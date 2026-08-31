"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CREATIVE_WORKS } from "@/data/creative";

export default function CreativePage() {
    const [filterType, setFilterType] = useState<string>("All");

    const filtered = CREATIVE_WORKS.filter(item => {
        if (filterType !== "All" && item.type !== filterType) return false;
        return true;
    });

    const activeBtnClass = "text-white bg-[var(--color-brand-red)] border-[var(--color-brand-red)]";
    const defaultBtnClass = "text-[var(--color-brand-gray)] border-[var(--color-brand-border)] hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)] transition-colors";

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)] text-[var(--color-foreground)]">

            {/* Editorial Header */}
            <section className="bg-neutral-50 border-b-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-12 lg:p-24 pt-16 flex flex-col justify-end min-h-[40vh] w-full">
                <h1 className="font-serif text-[4rem] sm:text-[6rem] lg:text-[10rem] font-medium leading-[0.8] tracking-tighter uppercase break-words w-full text-[var(--color-brand-black)]">
                    <span className="text-[var(--color-brand-red)]">Cre</span>ative
                </h1>
                <p className="mt-8 text-sm md:text-md text-[var(--color-brand-gray)] max-w-lg leading-relaxed selection:bg-[var(--color-brand-red)] selection:text-white">
                    Poetry, fiction, personal narratives and experiments in form.
                </p>
            </section>

            {/* Main Listing Layout */}
            <section className="flex flex-col xl:flex-row w-full min-h-[60vh]">

                {/* Sidebar Filters */}
                <aside className="w-full xl:w-[25%] flex flex-col border-b-[0.5px] xl:border-b-0 xl:border-r-[0.5px] border-[var(--color-brand-border)]">
                    <div className="p-8 sm:p-12 sticky top-24">
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-5">Form</h3>
                        <div className="flex flex-row xl:flex-col flex-wrap gap-2 text-[11px] uppercase tracking-widest font-semibold items-start">
                            {["All", "Poetry", "Fiction", "Personal Narrative", "Visual Art", "Experimental"].map(frm => (
                                <button
                                    key={frm}
                                    onClick={() => setFilterType(frm)}
                                    className={`px-3 xl:px-4 py-2 border-[0.5px] ${filterType === frm ? activeBtnClass : defaultBtnClass} transition-colors duration-300 w-auto xl:w-full text-left`}
                                >
                                    {frm}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Abstract Staggered Grid */}
                <div className="w-full xl:w-[75%] p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {filtered.length === 0 && (
                            <div className="col-span-1 md:col-span-2 p-8 sm:p-12 text-[13px] text-[var(--color-brand-gray)]">
                                No creative works match these filters.
                            </div>
                        )}
                        {filtered.map((item, i) => (
                            <Link
                                href={`/creative/${item.slug}`}
                                key={item.id}
                                className={`flex flex-col border-b-[0.5px] border-[var(--color-brand-border)] group ${(i + 1) % 2 !== 0 ? 'md:border-r-[0.5px]' : ''}`}
                            >
                                {/* Visual layer for art vs text emphasis */}
                                {item.coverImage ? (
                                    <div className="relative w-full aspect-square border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-100 mix-blend-multiply p-8 sm:p-12 flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={item.coverImage}
                                            alt={item.title}
                                            fill
                                            className="object-contain p-12 opacity-30 group-hover:opacity-80 transition-opacity duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative w-full aspect-square border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-50 flex items-center justify-center p-8 text-[var(--color-brand-gray)] font-serif text-[clamp(4rem,20vw,120px)] leading-none overflow-hidden group-hover:text-[var(--color-brand-red)] transition-colors duration-500">
                                        {item.title.charAt(0)}
                                    </div>
                                )}

                                <div className="p-8 sm:p-12 flex flex-col flex-1 bg-[var(--color-background)] hover:bg-neutral-50 transition-colors duration-300">
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)] mb-4">
                                        {item.type}
                                    </span>
                                    <h4 className="font-serif text-3xl sm:text-4xl text-[var(--color-brand-black)] mb-6 group-hover:italic group-hover:text-[var(--color-brand-red)] transition-all duration-300">
                                        {item.title}
                                    </h4>
                                    <p className="text-[14px] text-[var(--color-brand-gray)] mb-8 max-w-sm line-clamp-3">
                                        {item.excerpt}
                                    </p>
                                    <div className="mt-auto flex justify-between items-end border-t-[0.5px] border-[var(--color-brand-border)] pt-6">
                                        <span className="text-[12px] text-[var(--color-brand-black)] font-medium group-hover:text-[var(--color-brand-red)] transition-colors">
                                            {item.author}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-black)] transition-colors">
                                            {item.date}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </section>
        </main>
    );
}
