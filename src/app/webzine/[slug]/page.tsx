import { notFound } from "next/navigation";
import Link from "next/link";
import { getWebzineById } from "@/services/supabaseServices";
import { fieldsOf, coverOf } from "@/lib/content";
import type { CuratedWork } from "@/types/schema";

export const dynamic = "force-dynamic";

async function loadIssue(slug: string) {
    try {
        const res = await getWebzineById(slug);
        return res?.data ? fieldsOf(res.data) : null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const issue = await loadIssue(slug);
    if (!issue) return { title: "Webzine Issue - THWARA" };
    return {
        title: `${issue.title || issue.webzine_name || "Issue"} - THWARA Webzine`,
        description: issue.excerpt || issue.description || "",
    };
}

export default async function WebzineDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const issue = await loadIssue(slug);
    if (!issue) notFound();

    const project = {
        title: issue.title || issue.webzine_name || "Webzine Issue",
        type: issue.domain || "Visual Essay",
        excerpt: issue.excerpt || "",
        description: issue.description || "",
        date: issue.date || "",
        coverImage: coverOf(issue),
        contributors: issue.author_name || issue.authorName || "Thwara Collective",
    };

    const curatedArticles: CuratedWork[] = issue.articles ?? [];
    const curatedFictions: CuratedWork[] = issue.fictions ?? [];
    const curatedFolklores: CuratedWork[] = issue.folklores ?? [];
    const curatedTellings: CuratedWork[] = issue.tellings ?? [];
    const hasCuratedWorks =
        curatedArticles.length > 0 ||
        curatedFictions.length > 0 ||
        curatedFolklores.length > 0 ||
        curatedTellings.length > 0;

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">
            {/* Back Nav */}
            <div className="fixed top-24 left-8 z-40 hidden lg:block blend-difference">
                <Link
                    href="/webzine"
                    className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-red)] transition-colors"
                >
                    ← Back to Webzine
                </Link>
            </div>

            {/* Cinematic Hero */}
            <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center overflow-hidden border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-50/20">
                {project.coverImage && (
                    <div className="absolute inset-0 z-0 bg-neutral-100 mix-blend-multiply opacity-50">
                        <img
                            src={project.coverImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale object-center scale-110 blur-xl"
                        />
                    </div>
                )}
                <div className="relative z-10 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl text-center max-w-full overflow-hidden">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--color-brand-red)] mb-6 sm:mb-8 block">
                        A {project.type}
                    </span>
                    <h1 className="font-serif text-[clamp(2rem,6vw,6rem)] leading-[0.95] tracking-tight mb-6 sm:mb-8 break-words [overflow-wrap:anywhere] text-[var(--color-brand-black)]">
                        {project.title}
                    </h1>
                    <p className="text-[15px] sm:text-[18px] md:text-[20px] text-[var(--color-brand-gray)] max-w-2xl font-medium leading-[1.8] italic font-serif break-words [overflow-wrap:anywhere]">
                        {project.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                        {project.date && (
                            <>
                                <span>{project.date}</span>
                                <span className="text-[var(--color-brand-gray)]">/</span>
                            </>
                        )}
                        <span className="text-[var(--color-brand-red)]">{project.contributors}</span>
                    </div>
                </div>
            </section>

            {/* If Curated Works Exist: Curated Anthology Grid */}
            {hasCuratedWorks && (
                <section className="w-full px-4 sm:px-8 lg:px-24 py-16 max-w-[1400px] mx-auto bg-white flex flex-col gap-10 border-b-2 border-[var(--color-brand-border)]">
                    <div className="border-b-2 border-neutral-200 pb-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-red)] block mb-1">
                            Anthology Curation
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold text-black uppercase">
                            Works Included in this Issue
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Curated Articles */}
                        {curatedArticles.map((art, idx) => (
                            <div key={`art-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Article
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{art.title}</h3>
                                    {art.author && <p className="text-xs text-neutral-500 mt-1">By {art.author}</p>}
                                </div>
                                <Link
                                    href={`/articles/${art.slug || art.id}`}
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Read Article <span>→</span>
                                </Link>
                            </div>
                        ))}

                        {/* Curated Fiction */}
                        {curatedFictions.map((fic, idx) => (
                            <div key={`fic-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Fiction: {fic.genre || "Story"}
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{fic.title}</h3>
                                    {fic.author && <p className="text-xs text-neutral-500 mt-1">By {fic.author}</p>}
                                </div>
                                <Link
                                    href={`/fiction/${fic.slug || fic.id}`}
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Read Fiction <span>→</span>
                                </Link>
                            </div>
                        ))}

                        {/* Curated Folklore */}
                        {curatedFolklores.map((fol, idx) => (
                            <div key={`fol-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Folklore: {fol.category || "Oral History"}
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{fol.title}</h3>
                                    {fol.narrator && <p className="text-xs text-neutral-500 mt-1">Narrated by {fol.narrator}</p>}
                                </div>
                                <Link
                                    href={`/folklore/${fol.slug || fol.id}`}
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Explore Folklore <span>→</span>
                                </Link>
                            </div>
                        ))}

                        {/* Curated Tellings */}
                        {curatedTellings.map((tel, idx) => (
                            <div key={`tel-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Audio: {tel.category || "Series"}
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{tel.title}</h3>
                                </div>
                                <Link
                                    href="/tellings"
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Listen to Audio <span>→</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {project.description && (
                <section className="w-full px-4 sm:px-8 lg:px-24 py-16 max-w-[1400px] mx-auto bg-white">
                    <p className="text-[15px] sm:text-[17px] text-[var(--color-brand-black)] leading-[1.9] whitespace-pre-line max-w-3xl mx-auto break-words [overflow-wrap:anywhere]">
                        {project.description}
                    </p>
                </section>
            )}

            {!hasCuratedWorks && !project.description && (
                <section className="w-full px-4 py-16 text-center text-neutral-500 text-sm">
                    Works for this issue are being prepared &mdash; check back soon.
                </section>
            )}
        </main>
    );
}
