import Link from "next/link";
import Image from "next/image";
import { WEBZINE_PROJECTS } from "@/data/webzine";

export const metadata = {
    title: 'Webzine - THWARA',
    description: 'An evolving space for experiments in image, text, sound, form and digital storytelling.',
}

export default function WebzinePage() {

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">

            {/* Editorial Header */}
            <section className="p-8 sm:p-12 lg:p-24 pt-24 lg:pt-32 flex flex-col items-center justify-center min-h-[50vh] w-full border-b-[0.5px] border-[var(--color-brand-border)] text-center bg-neutral-50/50">
                <h1 className="font-serif text-[clamp(4rem,10vw,14rem)] font-medium leading-[0.7] tracking-tighter uppercase break-words w-full text-transparent bg-clip-text bg-gradient-to-b from-[var(--color-brand-black)] to-[var(--color-brand-gray)]">
                    <span className="text-[var(--color-brand-red)]">Web</span>zine
                </h1>
                <p className="mt-12 text-[14px] md:text-[16px] text-[var(--color-brand-gray)] max-w-lg leading-[2] font-medium tracking-wide selection:bg-[var(--color-brand-red)] selection:text-white">
                    An evolving space for experiments in image, text, sound, form and digital storytelling.
                </p>
            </section>

            {/* Experimental Gallery Grid */}
            <section className="flex flex-col w-full min-h-[60vh]">
                {WEBZINE_PROJECTS.length === 0 && (
                    <div className="p-12 text-[13px] text-[var(--color-brand-gray)] text-center">Currently in development.</div>
                )}

                {WEBZINE_PROJECTS.map((project, i) => (
                    <div key={project.id} className="flex flex-col xl:flex-row w-full border-b-[0.5px] border-[var(--color-brand-border)] group">

                        {/* Meta Block */}
                        <div className="w-full xl:w-[25%] p-8 sm:p-12 xl:border-r-[0.5px] border-[var(--color-brand-border)] flex flex-col justify-between bg-neutral-50 group-hover:bg-neutral-100 transition-colors duration-500">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)] mb-4 block">
                                Project {String(i + 1).padStart(2, '0')}
                            </span>
                            <div>
                                <span className="text-[11px] uppercase tracking-widest text-[var(--color-brand-gray)] block mb-2">Architects</span>
                                <div className="flex flex-col gap-1 text-[13px] text-[var(--color-brand-black)] font-medium">
                                    {project.contributors.map(c => <span key={c}>{c}</span>)}
                                </div>
                            </div>
                            <div className="mt-12">
                                <span className="text-[11px] uppercase tracking-widest text-[var(--color-brand-gray)] block mb-2">Type</span>
                                <span className="text-[13px] text-[var(--color-brand-black)] font-medium">{project.type}</span>
                            </div>
                            <div className="mt-12 xl:mt-auto">
                                <span className="text-[11px] uppercase tracking-widest text-[var(--color-brand-gray)] block mb-2">Released</span>
                                <span className="text-[13px] text-[var(--color-brand-black)] font-medium">{project.date}</span>
                            </div>
                        </div>

                        {/* Cover Interface */}
                        <Link href={`/webzine/${project.slug}`} className="w-full xl:w-[75%] flex flex-col xl:flex-row items-stretch overflow-hidden relative">

                            {/* Visual Anchor */}
                            <div className="w-full xl:w-1/2 min-h-[300px] xl:min-h-full border-b-[0.5px] xl:border-b-0 xl:border-r-[0.5px] border-[var(--color-brand-border)] bg-neutral-100 relative mix-blend-multiply px-20 overflow-hidden">
                                <Image src={project.coverImage} alt={project.title} fill className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" />
                            </div>

                            {/* Content Typo Anchor */}
                            <div className="w-full xl:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-[var(--color-background)] group-hover:bg-neutral-50 transition-colors duration-500">
                                <h2 className="font-serif text-4xl sm:text-5xl lg:text-[4.5rem] leading-[0.9] tracking-tight text-[var(--color-brand-black)] mb-8 group-hover:-translate-y-2 group-hover:text-[var(--color-brand-red)] transition-all duration-500">
                                    {project.title}
                                </h2>
                                <p className="text-[14px] sm:text-[16px] leading-[1.8] text-[var(--color-brand-gray)] group-hover:text-[var(--color-foreground)] max-w-sm transition-colors duration-500">
                                    {project.excerpt}
                                </p>
                                <div className="mt-12 flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                                    <span>Experience</span>
                                    <span className="w-8 h-[1px] bg-current"></span>
                                </div>
                            </div>

                        </Link>
                    </div>
                ))}
            </section>

        </main>
    );
}
