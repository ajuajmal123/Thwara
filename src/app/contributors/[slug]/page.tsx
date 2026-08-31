import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CONTRIBUTORS } from "@/data/contributors";
import { ARTICLES } from "@/data/articles";
import { CREATIVE_WORKS } from "@/data/creative";
import { WEBZINE_PROJECTS } from "@/data/webzine";

export function generateStaticParams() {
    return CONTRIBUTORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const person = CONTRIBUTORS.find((c) => c.slug === slug);
    if (!person) return { title: 'Not Found' };
    return { title: `${person.name} - THWARA Contributors`, description: person.bio };
}

export default async function ContributorDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const contributor = CONTRIBUTORS.find((c) => c.slug === slug);

    if (!contributor) {
        notFound();
    }

    // Get Authored Works
    const articles = ARTICLES.filter(a => a.author === contributor.name);
    const creative = CREATIVE_WORKS.filter(c => c.author === contributor.name);
    const webzine = WEBZINE_PROJECTS.filter(w => w.contributors.includes(contributor.name));

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">
            <div className="flex flex-col lg:flex-row w-full min-h-[90vh]">

                {/* Left: Sticky Profile */}
                <aside className="w-full lg:w-[40%] xl:w-[35%] flex flex-col border-b-[0.5px] lg:border-b-0 lg:border-r-[0.5px] border-[var(--color-brand-border)] bg-neutral-50/20">
                    <div className="sticky top-0 p-8 sm:p-12 lg:p-16 flex flex-col h-full lg:min-h-screen">

                        <div className="mb-12">
                            <Link href="/contributors" className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] transition-colors">
                                ← Directory
                            </Link>
                        </div>

                        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-12 mix-blend-multiply opacity-80">
                            <Image
                                src={contributor.imageUrl}
                                alt={contributor.name}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <h1 className="font-serif text-[3rem] sm:text-[4rem] leading-[0.9] tracking-tight text-[var(--color-foreground)] uppercase">
                            {contributor.name}
                        </h1>
                        <h2 className="text-[12px] uppercase font-semibold tracking-[0.25em] text-[var(--color-brand-red)] mt-6">
                            {contributor.role}
                        </h2>

                        <p className="mt-8 text-[15px] leading-relaxed text-[var(--color-brand-gray)] max-w-sm">
                            {contributor.bio}
                        </p>

                    </div>
                </aside>

                {/* Right: Selected Works Index Structure */}
                <div className="w-full lg:w-[60%] xl:w-[65%] flex flex-col pt-12 lg:pt-0">

                    <div className="p-8 sm:p-12 lg:px-24 lg:py-16 border-b-[0.5px] border-[var(--color-brand-border)]">
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                            Selected Work
                        </h3>
                    </div>

                    <div className="flex flex-col w-full">
                        {/* Render Articles */}
                        {articles.length > 0 && (
                            <div className="mb-4">
                                {articles.map((item, i) => (
                                    <Link key={i} href={`/essays/${item.slug}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 sm:p-12 lg:px-24 border-b-[0.5px] border-[var(--color-brand-border)] group hover:bg-white transition-colors">
                                        <div className="flex flex-col max-w-xl pr-4">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-brand-gray)] uppercase mb-3 block">
                                                Essay / {item.category}
                                            </span>
                                            <h4 className={`font-serif text-2xl sm:text-3xl text-[var(--color-foreground)] group-hover:italic transition-all ${item.language === 'മലയാളം' ? 'tracking-normal' : ''}`}>
                                                {item.title}
                                            </h4>
                                        </div>
                                        <span className="mt-4 sm:mt-0 text-[11px] uppercase tracking-widest font-semibold text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-red)] transition-colors">
                                            {item.date}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Render Creative */}
                        {creative.length > 0 && (
                            <div className="mb-4">
                                {creative.map((item, i) => (
                                    <Link key={i} href={`/creative/${item.slug}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 sm:p-12 lg:px-24 border-b-[0.5px] border-[var(--color-brand-border)] group hover:bg-white transition-colors">
                                        <div className="flex flex-col max-w-xl pr-4">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-brand-gray)] uppercase mb-3 block">
                                                Creative / {item.type}
                                            </span>
                                            <h4 className="font-serif text-2xl sm:text-3xl text-[var(--color-foreground)] group-hover:italic transition-all">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <span className="mt-4 sm:mt-0 text-[11px] uppercase tracking-widest font-semibold text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-red)] transition-colors">
                                            {item.date}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Render Webzine */}
                        {webzine.length > 0 && (
                            <div>
                                {webzine.map((item, i) => (
                                    <Link key={i} href={`/webzine/${item.slug}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-8 sm:p-12 lg:px-24 border-b-[0.5px] border-[var(--color-brand-border)] group hover:bg-white transition-colors">
                                        <div className="flex flex-col max-w-xl pr-4">
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-[var(--color-brand-gray)] uppercase mb-3 block">
                                                Webzine / {item.type}
                                            </span>
                                            <h4 className="font-serif text-2xl sm:text-3xl text-[var(--color-foreground)] group-hover:italic transition-all">
                                                {item.title}
                                            </h4>
                                        </div>
                                        <span className="mt-4 sm:mt-0 text-[11px] uppercase tracking-widest font-semibold text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-red)] transition-colors">
                                            {item.date}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {articles.length === 0 && creative.length === 0 && webzine.length === 0 && (
                            <div className="p-8 sm:p-12 lg:px-24 text-[13px] text-[var(--color-brand-gray)] italic">
                                No works currently published in the mock database.
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </main>
    )
}
