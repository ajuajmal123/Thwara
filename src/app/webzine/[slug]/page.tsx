import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WEBZINE_PROJECTS } from "@/data/webzine";
import { getWebzineById } from "@/services/supabaseServices";

export function generateStaticParams() {
    return WEBZINE_PROJECTS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const staticWork = WEBZINE_PROJECTS.find((w) => w.slug === slug);
    if (staticWork) {
        return {
            title: `${staticWork.title} - THWARA Webzine`,
            description: staticWork.excerpt,
        };
    }

    try {
        const liveRes = await getWebzineById(slug);
        const liveWork: any = (liveRes?.data as any)?.attributes || liveRes?.data;
        if (liveWork) {
            return {
                title: `${liveWork.title || liveWork.webzine_name || "Issue"} - THWARA Webzine`,
                description: liveWork.excerpt || liveWork.description || "",
            };
        }
    } catch {
        // Fallback
    }

    return { title: "Webzine Issue - THWARA" };
}

export default async function WebzineDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    let project: any = WEBZINE_PROJECTS.find((w) => w.slug === slug);

    if (!project) {
        try {
            const liveRes = await getWebzineById(slug);
            const liveWork: any = (liveRes?.data as any)?.attributes || liveRes?.data;
            if (liveWork) {
                project = {
                    title: liveWork.title || liveWork.webzine_name,
                    type: liveWork.domain || "Visual Essay",
                    excerpt: liveWork.excerpt || liveWork.description || "",
                    date: liveWork.date || "2026",
                    coverImage: liveWork.cover_image || "/mock-1.svg",
                    contributors: [liveWork.author_name || "Thwara Collective"],
                    articles: Array.isArray(liveWork.articles) ? liveWork.articles : [],
                    fictions: Array.isArray(liveWork.fictions) ? liveWork.fictions : [],
                    folklores: Array.isArray(liveWork.folklores) ? liveWork.folklores : [],
                    tellings: Array.isArray(liveWork.tellings) ? liveWork.tellings : [],
                };
            }
        } catch {
            // Not found
        }
    }

    if (!project) notFound();

    const curatedArticles = project.articles || [];
    const curatedFictions = project.fictions || [];
    const curatedFolklores = project.folklores || [];
    const curatedTellings = project.tellings || [];
    const hasCuratedWorks =
        curatedArticles.length > 0 ||
        curatedFictions.length > 0 ||
        curatedFolklores.length > 0 ||
        curatedTellings.length > 0;

    const episodes = [
        { title: "Point of Contact", desc: "The geography of the shoreline operates not as a fixed boundary but as an ongoing negotiation between earth and current.", img: project.coverImage },
        { title: "Static Memory", desc: "Acoustic footprints remain embedded in the local architecture long after the original structural functions have ceased.", img: "/mock-2.svg" },
        { title: "Translation Error", desc: "Attempts to document these phenomena via standard alphabetical metrics invariably strip them of their tonal weight.", img: "/mock-1.svg" },
        { title: "Reconciliation", desc: "Accepting the fluid nature of the archive. The decay is itself a secondary layer of information.", img: project.coverImage }
    ];

    const isMalayalam = project.language === "മലയാളം";

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
                <div className="absolute inset-0 z-0 bg-neutral-100 mix-blend-multiply opacity-50">
                    <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        className="object-cover opacity-20 grayscale object-center scale-110 blur-xl"
                    />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-4xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--color-brand-red)] mb-8 block">
                        A {project.type}
                    </span>
                    <h1
                        className={`font-serif text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.9] tracking-tight mb-8 break-words text-[var(--color-brand-black)] ${
                            isMalayalam ? "leading-normal font-sans" : ""
                        }`}
                    >
                        {project.title}
                    </h1>
                    <p className="text-[16px] md:text-[20px] text-[var(--color-brand-gray)] max-w-2xl font-medium leading-[1.8] italic font-serif">
                        {project.excerpt}
                    </p>
                    <div className="flex gap-4 mt-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                        <span>{project.date}</span>
                        <span className="text-[var(--color-brand-gray)]">/</span>
                        <span className="text-[var(--color-brand-red)]">
                            {Array.isArray(project.contributors) ? project.contributors.join(" & ") : project.contributors || "Thwara Collective"}
                        </span>
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
                        {curatedArticles.map((art: any, idx: number) => (
                            <div key={`art-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Article
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{art.title}</h3>
                                    {art.author && <p className="text-xs text-neutral-500 mt-1">By {art.author}</p>}
                                </div>
                                <Link
                                    href="/articles"
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Read Article <span>→</span>
                                </Link>
                            </div>
                        ))}

                        {/* Curated Fiction */}
                        {curatedFictions.map((fic: any, idx: number) => (
                            <div key={`fic-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Fiction: {fic.genre || "Story"}
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{fic.title}</h3>
                                    {fic.author && <p className="text-xs text-neutral-500 mt-1">By {fic.author}</p>}
                                </div>
                                <Link
                                    href="/fiction"
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Read Fiction <span>→</span>
                                </Link>
                            </div>
                        ))}

                        {/* Curated Folklore */}
                        {curatedFolklores.map((fol: any, idx: number) => (
                            <div key={`fol-${idx}`} className="p-5 border-2 border-[var(--color-brand-border)] rounded-lg flex flex-col justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                        Folklore: {fol.category || "Oral History"}
                                    </span>
                                    <h3 className="text-lg font-bold text-black mt-2">{fol.title}</h3>
                                    {fol.narrator && <p className="text-xs text-neutral-500 mt-1">Narrated by {fol.narrator}</p>}
                                </div>
                                <Link
                                    href="/folklore"
                                    className="mt-4 font-bold text-xs text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
                                >
                                    Explore Folklore <span>→</span>
                                </Link>
                            </div>
                        ))}

                        {/* Curated Tellings */}
                        {curatedTellings.map((tel: any, idx: number) => (
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

            {/* Episodic Scroller Layout */}
            <section className="flex flex-col w-full px-4 sm:px-8 lg:px-24 py-24 sm:py-32 gap-32 sm:gap-40 max-w-[1400px] mx-auto bg-white">
                {episodes.map((ep, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center w-full group">
                        {/* Number & Text */}
                        <div
                            className={`w-full md:w-1/2 flex flex-col p-8 sm:p-12 ${
                                i % 2 === 0
                                    ? "md:pr-24 lg:pr-32 items-end text-right order-2 md:order-1"
                                    : "md:pl-24 lg:pl-32 items-start order-2 md:order-2"
                            }`}
                        >
                            <span className="font-serif text-[6rem] sm:text-[8rem] lg:text-[10rem] leading-[0.7] text-neutral-200 group-hover:text-[var(--color-brand-red)] transition-colors">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="-mt-8 z-10 relative">
                                <h3 className="font-serif text-[2.5rem] sm:text-[3rem] text-[var(--color-brand-black)] leading-[0.9] tracking-tight mb-6 group-hover:italic transition-all">
                                    {ep.title}
                                </h3>
                                <p
                                    className={`text-[15px] sm:text-[16px] text-[var(--color-brand-gray)] leading-[2] max-w-sm ${
                                        i % 2 === 0 ? "ml-auto" : ""
                                    }`}
                                >
                                    {isMalayalam && i === 0
                                        ? "തീരത്തിന്റെ ഭൂമിശാസ്ത്രം ഒരു സ്ഥിരമായ അതിരല്ല, മറിച്ച് കടലും കരയും തമ്മിലുള്ള നിരന്തരമായൊരു വിലപേശലാണ്."
                                        : ep.desc}
                                </p>
                            </div>
                        </div>

                        {/* Visual Frame */}
                        <div className={`w-full md:w-1/2 p-4 sm:p-0 order-1 ${i % 2 === 0 ? "md:order-2" : "md:order-1"}`}>
                            <div className="relative w-full aspect-[4/5] bg-neutral-100 border-[0.5px] border-[var(--color-brand-border)] overflow-hidden mix-blend-multiply group-hover:border-[var(--color-brand-red)] transition-colors duration-700">
                                <Image
                                    src={ep.img}
                                    alt={ep.title}
                                    fill
                                    className="object-cover p-12 opacity-60 transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}
