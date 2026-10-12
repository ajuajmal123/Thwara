import Link from "next/link";
import { TEAM_MEMBERS } from "@/data/team";

export default function AboutPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">

            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col">

                <div className="max-w-4xl w-full mx-auto flex flex-col gap-6 text-justify">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-6 underline decoration-[var(--color-brand-red)] underline-offset-4 sm:underline-offset-8 text-left whitespace-nowrap overflow-hidden text-ellipsis sm:whitespace-normal">
                        About THWARA
                    </h1>

                    <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                        THWARA (Think Write and Reimagine All) is an independent bilingual digital media collective.
                    </p>

                    <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                        The Malayalam word ത്വര (Thwara) means an urge-to explore, to act, to create. We come together with that same urge: to think, write, and reimagine the world with curiosity and critical care.
                    </p>

                    <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                        We publish research and critical essays alongside poetry, fiction, personal narratives, visual art, social commentary, and experimental storytelling in Malayalam and English.
                        Our work sits at the meeting point of scholarship and creativity.
                    </p>

                    <p className="text-black text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium">
                        THWARA supports emerging writers and researchers and foster conversations across disciplines and forms. We aim to make knowledge more accessible, local, and democratic-and to grow from a publishing platform into a living community rooted in dialogue, curiosity, and critical thought.
                    </p>
                </div>

                <div className="max-w-5xl w-full mx-auto mt-16 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-black mb-10 underline decoration-[var(--color-brand-green)] underline-offset-8">
                        Our Team
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                        {TEAM_MEMBERS.map((member) => (
                            <Link
                                key={member.id}
                                href={`/team/${member.slug}`}
                                className="group flex flex-col border-2 border-[var(--color-brand-border)] rounded-lg p-6 bg-white hover:shadow-lg transition-all hover:-translate-y-1 relative"
                            >
                                <div className="absolute top-3 right-3 text-[var(--color-brand-red)] text-xl font-bold opacity-60 group-hover:opacity-100 transition-opacity">★</div>
                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[var(--color-brand-border)] mb-4">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-black text-center group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1 mb-3">
                                    {member.name}
                                </h3>
                                <p className="text-neutral-700 text-sm line-clamp-3 text-center leading-relaxed flex-grow">
                                    {member.shortBio || member.fullBio}
                                </p>
                                <div className="mt-4 pt-3 border-t border-[var(--color-brand-border)] flex items-center justify-center text-xs font-bold uppercase tracking-wider text-black group-hover:text-[var(--color-brand-red)] transition-colors">
                                    Read More <span className="ml-1 text-base group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </section>

        </main>
    );
}
