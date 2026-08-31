import Link from "next/link";
import Image from "next/image";
import { CONTRIBUTORS } from "@/data/contributors";

export default function ContributorsPreview() {
    const previewContributors = CONTRIBUTORS.slice(0, 3);

    return (
        <section className="border-b-[0.5px] border-[var(--color-brand-border)]">
            <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b-[0.5px] border-[var(--color-brand-border)] bg-[var(--color-background)]">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                    Contributors
                </h2>
                <Link href="/contributors" className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] transition-colors">
                    View Directory
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
                {previewContributors.map((contributor, idx) => (
                    <Link
                        key={contributor.id}
                        href={`/contributors/${contributor.slug}`}
                        className={`group flex flex-col p-8 sm:p-10 outline-none hover:bg-neutral-50/50 transition-colors ${idx !== 2 ? 'md:border-r-[0.5px] border-b-[0.5px] md:border-b-0 border-[var(--color-brand-border)]' : ''}`}
                    >
                        <div className="flex items-center gap-6 mb-10">
                            {contributor.imageUrl ? (
                                <div className="relative w-16 h-16 rounded-sm overflow-hidden flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <Image
                                        src={contributor.imageUrl}
                                        alt={contributor.name}
                                        fill
                                        className="object-cover grayscale"
                                        sizes="64px"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-sm bg-[var(--color-brand-border)] opacity-30 flex-shrink-0" />
                            )}
                            <div className="flex flex-col">
                                <h3 className="font-sans text-[0.95em] sm:text-base font-semibold tracking-wide uppercase text-[var(--color-foreground)] transition-colors">
                                    {contributor.name}
                                </h3>
                            </div>
                        </div>

                        <p className="text-[13px] leading-[1.8] text-[var(--color-brand-gray)] mb-10 flex-1 line-clamp-3">
                            {contributor.bio}
                        </p>

                        <div className="text-[9px] uppercase font-semibold tracking-[0.2em] text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-black)] transition-colors flex justify-between items-center w-full pt-4 border-t-[0.5px] border-[var(--color-brand-border)]">
                            <span>{contributor.role}</span>
                            <span className="text-[var(--color-brand-red)] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
