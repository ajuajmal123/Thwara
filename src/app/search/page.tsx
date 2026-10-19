"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchAllContent, SearchResultItem } from "@/services/supabaseServices";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [searching, setSearching] = useState(false);

    // Perform search whenever query from navbar changes
    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults([]);
            return;
        }

        let isCurrent = true;
        setSearching(true);

        const debounceTimer = setTimeout(async () => {
            try {
                const data = await searchAllContent(trimmed);
                if (isCurrent) {
                    setResults(data);
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                if (isCurrent) {
                    setSearching(false);
                }
            }
        }, 100);

        return () => {
            isCurrent = false;
            clearTimeout(debounceTimer);
        };
    }, [query]);

    // Separate into contributors and publications (matching original layout)
    const contributorResults = results.filter((item) => item.origin === "Author");
    const publicationResults = results.filter((item) => item.origin !== "Author");

    const hasSearched = query.trim().length > 0;
    const noResults = hasSearched && !searching && results.length === 0;

    return (
        <main className="flex-1 flex flex-col min-h-screen bg-[var(--color-background)]">
            {/* Clean Editorial Results Header */}
            <section className="bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)] px-6 sm:px-12 lg:px-24 py-10 sm:py-16">
                <div className="max-w-5xl">
                    <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-brand-red)] uppercase block mb-2">
                        Search Results
                    </span>
                    <h1 className="font-serif text-2xl sm:text-4xl text-[var(--color-foreground)]">
                        {query.trim() ? (
                            <>
                                Results for <span className="italic text-[var(--color-brand-red)]">“{query}”</span>
                            </>
                        ) : (
                            "Search THWARA"
                        )}
                    </h1>
                    {!query.trim() && (
                        <p className="text-sm text-[var(--color-brand-gray)] mt-2">
                            Type a keyword in the navbar search bar above to search across our Essays, Fiction, Folklore, Webzine, Tellings, and Contributors.
                        </p>
                    )}
                </div>
            </section>

            {/* Results Section */}
            <section className="flex-1 flex flex-col p-6 sm:p-12 lg:p-24 bg-[var(--color-background)]">
                {/* Searching State */}
                {searching && (
                    <div className="text-sm text-[var(--color-brand-gray)] font-serif italic py-8">
                        Searching archive...
                    </div>
                )}

                {/* Empty State */}
                {noResults && (
                    <div className="flex flex-col items-start max-w-lg mt-4 animate-[fadeIn_1s_ease-out]">
                        <h2 className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[var(--color-brand-red)] mb-4">
                            No Results Found
                        </h2>
                        <p className="text-[18px] sm:text-[20px] font-serif leading-relaxed text-[var(--color-brand-gray)] border-l-[0.5px] border-[var(--color-brand-red)] pl-6">
                            Try searching for another title, author, or topic spanning our Essays, Creative works, Webzine projects, and Contributor pool.
                        </p>
                    </div>
                )}

                {/* List of Results */}
                {!searching && (contributorResults.length > 0 || publicationResults.length > 0) && (
                    <div className="flex flex-col w-full max-w-5xl">
                        {/* Contributors First */}
                        {contributorResults.length > 0 && (
                            <div className="mb-16">
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-8 border-b-[0.5px] border-[var(--color-brand-border)] pb-4">
                                    Contributors ({contributorResults.length})
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
                                    {contributorResults.map((cont) => (
                                        <Link href={cont.href} key={cont.id} className="flex flex-col group">
                                            <span className="font-serif text-xl sm:text-2xl text-[var(--color-foreground)] group-hover:text-[var(--color-brand-red)] transition-colors mb-2">
                                                {cont.title}
                                            </span>
                                            <span className="text-[11px] uppercase tracking-widest text-[var(--color-brand-gray)]">
                                                {cont.excerpt || "Contributor"}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Publications: Articles / Fiction / Folklore / Webzine / Tellings */}
                        {publicationResults.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-8 border-b-[0.5px] border-[var(--color-brand-border)] pb-4">
                                    Publications ({publicationResults.length})
                                </h3>
                                <ul className="flex flex-col w-full border-t-[0.5px] border-[var(--color-brand-border)]">
                                    {publicationResults.map((item) => {
                                        const originLabel =
                                            item.origin === "Article"
                                                ? "Essay"
                                                : item.origin;

                                        return (
                                            <li key={`${item.origin}-${item.id}`} className="border-b-[0.5px] border-[var(--color-brand-border)] group">
                                                <Link href={item.href} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-neutral-50 transition-colors -mx-6 rounded-md">
                                                    <div className="flex flex-col max-w-2xl">
                                                        <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-brand-red)] uppercase mb-3 block">
                                                            {originLabel} {item.category ? `• ${item.category}` : ""}
                                                        </span>
                                                        <h4 className="font-serif text-2xl sm:text-3xl text-[var(--color-foreground)] group-hover:italic transition-all group-hover:text-[var(--color-brand-red)]">
                                                            {item.title}
                                                        </h4>
                                                        {item.excerpt && (
                                                            <p className="text-[14px] text-[var(--color-brand-gray)] mt-3 line-clamp-1">
                                                                {item.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col md:items-end mt-4 md:mt-0 min-w-[200px]">
                                                        {item.author && (
                                                            <span className="text-[12px] font-medium text-[var(--color-brand-black)]">
                                                                {item.author}
                                                            </span>
                                                        )}
                                                        {item.date && (
                                                            <span className="text-[11px] uppercase tracking-wider text-[var(--color-brand-gray)] mt-1 group-hover:text-[var(--color-brand-red)] transition-colors">
                                                                {item.date}
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <main className="flex-1 flex flex-col min-h-screen bg-[var(--color-background)]">
                <section className="px-6 sm:px-12 lg:px-24 py-10 sm:py-16">
                    <div className="max-w-5xl">
                        <div className="h-8 w-1/3 bg-neutral-200 animate-pulse rounded" />
                    </div>
                </section>
            </main>
        }>
            <SearchContent />
        </Suspense>
    );
}
