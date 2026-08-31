import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { WEBZINE_PROJECTS } from "@/data/webzine";

export function generateStaticParams() {
    return WEBZINE_PROJECTS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const work = WEBZINE_PROJECTS.find((w) => w.slug === slug);
    if (!work) return { title: 'Not Found' };
    return {
        title: `${work.title} - THWARA Webzine`,
        description: work.excerpt,
    };
}

export default async function WebzineDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = WEBZINE_PROJECTS.find((w) => w.slug === slug);

    if (!project) notFound();

    const episodes = [
        { title: "Point of Contact", desc: "The geography of the shoreline operates not as a fixed boundary but as an ongoing negotiation between earth and current.", img: project.coverImage },
        { title: "Static Memory", desc: "Acoustic footprints remain embedded in the local architecture long after the original structural functions have ceased.", img: "/mock-2.svg" },
        { title: "Translation Error", desc: "Attempts to document these phenomena via standard alphabetical metrics invariably strip them of their tonal weight.", img: "/mock-1.svg" },
        { title: "Reconciliation", desc: "Accepting the fluid nature of the archive. The decay is itself a secondary layer of information.", img: project.coverImage }
    ];

    const isMalayalam = project.language === 'മലയാളം';

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">

            {/* Back Nav */}
            <div className="fixed top-24 left-8 z-40 hidden lg:block blend-difference">
                <Link href="/webzine" className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-red)] transition-colors">
                    ← Back to Webzine
                </Link>
            </div>

            {/* Cinematic Hero */}
            <section className="relative w-full h-screen min-h-[700px] flex flex-col justify-center items-center overflow-hidden border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-50/20">
                <div className="absolute inset-0 z-0 bg-neutral-100 mix-blend-multiply opacity-50">
                    <Image src={project.coverImage} alt={project.title} fill className="object-cover opacity-20 grayscale object-center scale-110 blur-xl" />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center p-8 max-w-4xl text-center">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--color-brand-red)] mb-8 block">
                        A {project.type}
                    </span>
                    <h1 className={`font-serif text-[clamp(3rem,8vw,7rem)] leading-[0.85] tracking-tight mb-8 break-words text-[var(--color-brand-black)] ${isMalayalam ? 'leading-normal font-sans' : ''}`}>
                        {project.title}
                    </h1>
                    <p className="text-[16px] md:text-[20px] text-[var(--color-brand-gray)] max-w-2xl font-medium leading-[1.8] italic font-serif">
                        {project.excerpt}
                    </p>
                    <div className="flex gap-4 mt-12 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                        <span>{project.date}</span>
                        <span className="text-[var(--color-brand-gray)]">/</span>
                        <span className="text-[var(--color-brand-red)]">{project.contributors.join(' & ')}</span>
                    </div>
                </div>
            </section>

            {/* Episodic Scroller Layout */}
            <section className="flex flex-col w-full px-4 sm:px-8 lg:px-24 py-24 sm:py-32 gap-32 sm:gap-40 max-w-[1400px] mx-auto bg-white">
                {episodes.map((ep, i) => (
                    <div key={i} className="flex flex-col md:flex-row items-center w-full group">

                        {/* Number & Text */}
                        <div className={`w-full md:w-1/2 flex flex-col p-8 sm:p-12 ${i % 2 === 0 ? 'md:pr-24 lg:pr-32 items-end text-right order-2 md:order-1' : 'md:pl-24 lg:pl-32 items-start order-2 md:order-2'}`}>
                            <span className="font-serif text-[6rem] sm:text-[8rem] lg:text-[10rem] leading-[0.7] text-neutral-200 group-hover:text-[var(--color-brand-red)] transition-colors">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="-mt-8 z-10 relative">
                                <h3 className="font-serif text-[2.5rem] sm:text-[3rem] text-[var(--color-brand-black)] leading-[0.9] tracking-tight mb-6 group-hover:italic transition-all">
                                    {ep.title}
                                </h3>
                                <p className={`text-[15px] sm:text-[16px] text-[var(--color-brand-gray)] leading-[2] max-w-sm ${i % 2 === 0 ? 'ml-auto' : ''}`}>
                                    {isMalayalam && i === 0 ? "തീരത്തിന്റെ ഭൂമിശാസ്ത്രം ഒരു സ്ഥിരമായ അതിരല്ല, മറിച്ച് കടലും കരയും തമ്മിലുള്ള നിരന്തരമായൊരു വിലപേശലാണ്." : ep.desc}
                                </p>
                            </div>
                        </div>

                        {/* Visual Frame */}
                        <div className={`w-full md:w-1/2 p-4 sm:p-0 order-1 ${i % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                            <div className="relative w-full aspect-[4/5] bg-neutral-100 border-[0.5px] border-[var(--color-brand-border)] overflow-hidden mix-blend-multiply group-hover:border-[var(--color-brand-red)] transition-colors duration-700">
                                <Image src={ep.img} alt={ep.title} fill className="object-cover p-12 opacity-60 transform group-hover:scale-110 transition-transform duration-1000 ease-out" />
                            </div>
                        </div>

                    </div>
                ))}
            </section>

        </main>
    );
}
