import Link from "next/link";
import { TEAM_MEMBERS } from "@/data/team";

export default function TeamPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8 items-center text-center">

                <h1 className="text-4xl md:text-5xl font-bold text-black border-2 border-[var(--color-brand-border)] px-6 py-3 rounded-full uppercase">
                    The <span className="text-[var(--color-brand-red)]">Core</span> Team
                </h1>

                <p className="max-w-2xl text-black font-medium my-4">
                    The individuals working behind the scenes to maintain our editorial standard, curate multidisciplinary discourse, and cultivate community engagement.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full border-t-2 border-dotted border-[var(--color-brand-border)] pt-10">
                    {TEAM_MEMBERS.map((member) => (
                        <Link
                            key={member.id}
                            href={`/team/${member.slug}`}
                            className="group flex flex-col items-center border-2 border-[var(--color-brand-border)] rounded-lg p-6 bg-white hover:shadow-lg transition-all hover:-translate-y-1 relative"
                        >
                            <div className="absolute top-3 right-3 text-[var(--color-brand-red)] text-xl font-bold opacity-60 group-hover:opacity-100 transition-opacity">★</div>
                            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--color-brand-border)] mb-4">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                            </div>
                            <h2 className="text-xl font-bold text-black group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1">
                                {member.name}
                            </h2>
                            <span className="text-xs font-bold text-[var(--color-brand-red)] uppercase mt-1 mb-2">
                                {member.role}
                            </span>
                            <p className="text-neutral-700 text-sm line-clamp-3 leading-relaxed flex-grow">
                                {member.shortBio || member.fullBio}
                            </p>
                            <div className="mt-4 pt-3 border-t border-[var(--color-brand-border)] w-full flex items-center justify-center text-xs font-bold uppercase tracking-wider text-black group-hover:text-[var(--color-brand-red)] transition-colors">
                                Read Profile <span className="ml-1 text-base group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>

            </section>
        </main>
    );
}