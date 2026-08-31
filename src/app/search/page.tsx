"use client";

import { useState } from "react";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import { CREATIVE_WORKS } from "@/data/creative";
import { WEBZINE_PROJECTS } from "@/data/webzine";
import { CONTRIBUTORS } from "@/data/contributors";

export default function SearchPage() {
    const [query, setQuery] = useState("");

    const allContent = [
        ...ARTICLES.map(a => ({ ...a, origin: 'Essay', href: `/essays/${a.slug}` })),
        ...CREATIVE_WORKS.map(c => ({ ...c, origin: 'Creative', href: `/creative/${c.slug}` })),
        ...WEBZINE_PROJECTS.map(w => ({ ...w, origin: 'Webzine', author: w.contributors.join(', '), href: `/webzine/${w.slug}` }))
    ];

    const searchResults = allContent.filter(item => {
        if (!query) return false;
        const q = query.toLowerCase();
        return (
            item.title.toLowerCase().includes(q) ||
            (item.author && item.author.toLowerCase().includes(q)) ||
            (item.excerpt && item.excerpt.toLowerCase().includes(q))
        );
    });

    const contributorResults = CONTRIBUTORS.filter(c => {
        if (!query) return false;
        const q = query.toLowerCase();
        return (
            c.name.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q)
        );
    });

    const hasSearched = query.length > 0;
    const noResults = hasSearched && searchResults.length === 0 && contributorResults.length === 0;

    return (
        <main className="flex-1 flex flex-col min-h-screen bg-[var(--color-background)]">

            {/* Search Header */}
            <section className="bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-12 lg:p-24 pt-32 lg:pt-48 pb-24">
                <div className="max-w-4xl">
                    <input
                        type="text"
                        placeholder="Search THWARA..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-transparent border-b-[2px] border-[var(--color-brand-border)] pb-4 text-3xl sm:text-5xl lg:text-7xl font-serif text-[var(--color-brand-black)] placeholder-[var(--color-brand-gray)] outline-none focus:border-[var(--color-brand-red)] transition-colors focus:placeholder-opacity-0"
                        autoFocus
                    />
                </div>
            </section>

            {/* Results Section */}
            <section className="flex-1 flex flex-col p-8 sm:p-12 lg:p-24 bg-[var(--color-background)]">

                {/* Empty State */}
                {noResults && (
                    <div className="flex flex-col items-start max-w-lg mt-12 animate-[fadeIn_1s_ease-out]">
                        <h2 className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[var(--color-brand-red)] mb-6">
                            No Results Found
                        </h2>
                        <p className="text-[20px] font-serif leading-relaxed text-[var(--color-brand-gray)] border-l-[0.5px] border-[var(--color-brand-red)] pl-6">
                            Try searching for another title, author, or topic spanning our Essays, Creative works, Webzine projects, and Contributor pool.
                        </p>
                    </div>
                )}

                {/* List of Results */}
                {(searchResults.length > 0 || contributorResults.length > 0) && (
                    <div className="flex flex-col w-full max-w-5xl">

                        {/* Contributors First */}
                        {contributorResults.length > 0 && (
                            <div className="mb-24">
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-8 border-b-[0.5px] border-[var(--color-brand-border)] pb-4">
                                    Contributors ({contributorResults.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
                                    {contributorResults.map(cont => (
                                        <Link href={`/contributors/${cont.slug}`} key={cont.id} className="flex flex-col group">
                                            <span className="font-serif text-xl sm:text-2xl text-[var(--color-foreground)] group-hover:text-[var(--color-brand-red)] transition-colors mb-2">
                                                {cont.name}
                                            </span>
                                            <span className="text-[11px] uppercase tracking-widest text-[var(--color-brand-gray)]">
                                                {cont.role}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Articles / Creative / Webzine */}
                        {searchResults.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-8 border-b-[0.5px] border-[var(--color-brand-border)] pb-4">
                                    Publications ({searchResults.length})
                                </h3>
                                <ul className="flex flex-col w-full border-t-[0.5px] border-[var(--color-brand-border)]">
                                    {searchResults.map((item, idx) => (
                                        <li key={idx} className="border-b-[0.5px] border-[var(--color-brand-border)] group">
                                            <Link href={item.href} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-neutral-50 transition-colors -mx-6 rounded-md">
                                                <div className="flex flex-col max-w-2xl">
                                                    <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-brand-red)] uppercase mb-3 block">
                                                        {item.origin} {((item as any).category || (item as any).type) ? `• ${((item as any).category || (item as any).type)}` : ''}
                                                    </span>
                                                    <h4 className="font-serif text-2xl sm:text-3xl text-[var(--color-foreground)] group-hover:italic transition-all group-hover:text-[var(--color-brand-red)]">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-[14px] text-[var(--color-brand-gray)] mt-3 line-clamp-1">
                                                        {item.excerpt}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col md:items-end mt-4 md:mt-0 min-w-[200px]">
                                                    <span className="text-[12px] font-medium text-[var(--color-brand-black)]">
                                                        {item.author}
                                                    </span>
                                                    <span className="text-[11px] uppercase tracking-wider text-[var(--color-brand-gray)] mt-1 group-hover:text-[var(--color-brand-red)] transition-colors">
                                                        {item.date}
                                                    </span>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

            </section>
        </main>
    );
}
