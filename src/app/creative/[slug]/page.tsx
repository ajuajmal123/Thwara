import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CREATIVE_WORKS } from "@/data/creative";

export function generateStaticParams() {
    return CREATIVE_WORKS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const work = CREATIVE_WORKS.find((c) => c.slug === slug);
    if (!work) return { title: 'Not Found' };
    return { title: `${work.title} - THWARA Creative`, description: work.excerpt };
}

export default async function CreativeDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const work = CREATIVE_WORKS.find((cw) => cw.slug === slug);

    if (!work) notFound();

    const isMalayalam = work.language === "മലയാളം";
    // Check type to render conditionals
    const isPoetry = work.type === "Poetry";
    const isVisualArt = work.type === "Visual Art" || work.type === "Experimental";

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)] text-[var(--color-foreground)]">

            <section className="border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-50 p-6 px-8 sm:px-12 flex justify-between items-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)]">
                <div>
                    <Link href="/creative" className="hover:text-[var(--color-brand-black)] transition-colors">CREATIVE</Link>
                    <span className="mx-3">/</span>
                    <span className="text-[var(--color-brand-black)]">{work.type}</span>
                </div>
                <div>{work.date}</div>
            </section>

            {/* ARTWORK OR HERO */}
            {isVisualArt && work.coverImage && (
                <section className="w-full flex items-center justify-center p-8 sm:p-24 border-b-[0.5px] border-[var(--color-brand-border)] bg-neutral-100">
                    <div className="relative w-full max-w-5xl aspect-square md:aspect-video mix-blend-multiply overflow-hidden border-[0.5px] border-[var(--color-brand-border)] bg-white">
                        <Image src={work.coverImage} alt={work.title} fill className="object-contain p-12 opacity-80" />
                    </div>
                </section>
            )}

            <section className={`w-full flex flex-col items-center justify-center ${isPoetry ? 'py-16 md:py-32' : 'py-16'} px-8 sm:px-12`}>
                <div className={`max-w-4xl w-full text-center flex flex-col items-center ${isVisualArt ? 'mb-16' : 'mb-32'}`}>
                    <h1 className={`font-serif text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] text-[var(--color-brand-black)] tracking-tight mb-8 ${isMalayalam ? 'leading-normal' : ''}`}>
                        {work.title}
                    </h1>
                    <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest font-semibold text-[var(--color-brand-gray)]">
                        BY <div><Link href="/contributors" className="hover:underline text-[var(--color-brand-red)]">{work.author}</Link></div>
                    </div>
                </div>

                {/* DYNAMIC CONTENT RENDER */}

                {isPoetry ? (
                    <div className="w-full max-w-xl mx-auto flex flex-col space-y-8 pb-32">
                        {/* Render poem abstractly */}
                        <p className={`font-serif text-xl sm:text-3xl leading-[2] sm:leading-[2.2] text-center ${isMalayalam ? 'tracking-normal text-2xl' : 'tracking-wide text-[var(--color-brand-black)]'}`}>
                            {isMalayalam ? (
                                <>
                                    ഇരുട്ടിൻറെ വക്കിലൂടെ നടക്കുമ്പോൾ <br />
                                    കണ്ടെത്തിയ ഒരു നക്ഷത്രം. <br /><br />
                                    അത് പറയാതെ പറഞ്ഞതെല്ലാം <br />
                                    ഞാൻ എൻറെ പുസ്തകത്തിൽ കുറിച്ചിട്ടു.<br />
                                    ഓരോ വരിയിലും <br />
                                    അതിൻറെ പ്രകാശം മങ്ങിത്തുടങ്ങിയിരുന്നു.
                                </>
                            ) : (
                                <>
                                    We measure time <br />
                                    not in seconds <br />
                                    but in the fading light <br />
                                    caught in the windowpanes. <br /><br />
                                    I left the door unlocked. <br />
                                    You brought the rain inside.
                                </>
                            )}
                        </p>
                    </div>
                ) : isVisualArt ? (
                    <div className="w-full max-w-2xl mx-auto pb-32">
                        <h2 className="text-[10px] uppercase font-semibold tracking-widest text-[var(--color-brand-red)] mb-6">Artist Statement</h2>
                        <p className="text-[15px] sm:text-[16px] leading-[2] text-[var(--color-foreground)]">
                            <span className="font-serif italic text-lg text-[var(--color-brand-gray)]">{work.excerpt}</span> Further extending the philosophical themes into physical topology, this visual project re-aligns cultural memories with mechanical structures. The objective is to decouple memory from its origin and treat it strictly as a visual artifact.
                        </p>
                    </div>
                ) : (
                    /* Fiction / Narrative */
                    <article className="w-full max-w-2xl mx-auto pb-32 text-[16px] sm:text-[18px] leading-[2] text-[var(--color-foreground)] flex flex-col gap-10 selection:bg-[var(--color-brand-red)] selection:text-white">
                        <p className={`font-serif italic text-2xl text-[var(--color-brand-gray)] ${isMalayalam ? 'tracking-normal text-[18px]' : 'tracking-tight'} border-l-[0.5px] border-[var(--color-brand-red)] pl-6`}>
                            {work.excerpt}
                        </p>
                        <p>
                            {isMalayalam
                                ? "കുറച്ചുനേരം ആ ഇരുട്ടിൽ നിന്നപ്പോൾ എന്റെ ഓർമ്മകൾ പതിയെ പുറത്തേക്ക് വരാൻ തുടങ്ങി. ഒരു പഴയ ഫോട്ടോ ആൽബം തുറക്കുന്നതുപോലെ. മങ്ങിയ ചിത്രങ്ങൾ, ഒരിക്കലും തിരിച്ചുവരാത്ത കാലത്തിന്റെ ചില അംശങ്ങൾ."
                                : "The hallway stretched longer than memory allowed. Dust motes hung suspended in the 3 PM light slicing through the broken blinds. It felt less like a room and more like a diorama of someone else's failed attempt at domesticity."}
                        </p>
                        <p>
                            {isMalayalam
                                ? "നമ്മൾ എപ്പോഴും സംസാരിക്കുന്നത് ഭാവിയിലേക്കാണ്. എന്നാൽ യഥാർത്ഥത്തിൽ നമ്മൾ ജീവിക്കുന്നത് കഴിഞ്ഞ കാലത്തിന്റെ ഓർമ്മകളിലാണ്. ഓരോ നിമിഷവും ഒരു പഴയ ഫ്രെയിം പോലെ പിന്നിലേക്ക് മറയുന്നു."
                                : "She stood near the kitchen counter. The silence was geometric—sharp edges, rigid coordinates, trapping us in a space where words lost their buoyancy and plummeted directly to the cracked linoleum floor."}
                        </p>
                    </article>
                )}

            </section>
        </main>
    );
}
