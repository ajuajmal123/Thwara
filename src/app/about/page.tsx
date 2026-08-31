import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">
            {/* 1. Header / Manifesto Origin */}
            <section className="bg-[var(--color-background)] text-[var(--color-foreground)] border-b-[0.5px] border-[var(--color-brand-border)]">
                <div className="flex flex-col lg:flex-row w-full">
                    <div className="w-full lg:w-[40%] flex flex-col p-8 sm:p-12 lg:p-16 border-b-[0.5px] lg:border-b-0 lg:border-r-[0.5px] border-[var(--color-brand-border)] lg:min-h-[70vh] bg-neutral-50/50">
                        <h1 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] mb-auto">
                            About THWARA
                        </h1>
                        <div className="mt-24 lg:mt-0">
                            <span className="block text-2xl font-serif text-[var(--color-brand-red)] mb-4 italic transition-colors">The Urge</span>
                            <h2 className="font-sans text-[clamp(5rem,30vw,220px)] leading-none mb-0 text-[var(--color-brand-black)] translate-x-[-8px] pointer-events-none md:break-keep">
                                ത്വര
                            </h2>
                            <div className="flex items-center gap-4 mt-6">
                                <span className="text-xl md:text-3xl font-serif italic text-[var(--color-brand-gray)]">/</span>
                                <span className="text-xl md:text-3xl font-serif text-[var(--color-brand-black)] tracking-widest uppercase">thwa·ra</span>
                                <span className="text-xl md:text-3xl font-serif italic text-[var(--color-brand-gray)]">/</span>
                            </div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-brand-gray)] mt-4 font-semibold">
                                an urge
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-[60%] flex flex-col justify-center p-8 sm:p-12 lg:p-24">
                        <h3 className="font-serif text-[4rem] sm:text-[6rem] lg:text-[8rem] leading-[0.8] tracking-tighter text-[var(--color-brand-black)] mb-16 uppercase break-words w-full">
                            <span className="block text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] transition-colors duration-500">To Explore.</span>
                            <span className="block text-neutral-500 hover:text-[var(--color-brand-black)] transition-colors duration-500">To Act.</span>
                            <span className="block text-[var(--color-brand-red)] transition-colors duration-500 italic">To Create.</span>
                        </h3>
                        <p className="text-[16px] sm:text-[18px] text-[var(--color-brand-gray)] leading-[1.8] max-w-xl">
                            THWARA is an independent bilingual digital media collective bridging critical scholarship with profound creative expression. We sit at the intersection of observation and action.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. What We Publish */}
            <section className="bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)]">
                <div className="flex flex-col lg:flex-row w-full">
                    <div className="w-full lg:w-[40%] flex flex-col p-8 sm:p-12 lg:p-16 border-b-[0.5px] lg:border-b-0 lg:border-r-[0.5px] border-[var(--color-brand-border)] bg-neutral-50/20">
                        <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] mb-auto">
                            What We Publish
                        </h2>
                    </div>
                    <div className="w-full lg:w-[60%] p-8 sm:p-12 lg:p-24">
                        <ul className="flex flex-col gap-4">
                            {["Research", "Critical Essays", "Poetry", "Fiction", "Personal Narratives", "Visual Art", "Social Commentary", "Experimental Storytelling"].map((item, i) => (
                                <li key={item} className="flex gap-6 items-baseline border-b-[0.5px] border-[var(--color-brand-border)] pb-4 group cursor-default">
                                    <span className="text-[10px] font-bold text-[var(--color-brand-red)] w-4 font-serif block group-hover:pl-2 transition-all">0{i + 1}</span>
                                    <span className="font-serif text-2xl md:text-3xl lg:text-4xl tracking-tight leading-none text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-red)] group-hover:italic transition-colors duration-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. Framework & Vision */}
            <section className="bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)]">

                {/* Core Philosophy */}
                <div className="flex flex-col lg:flex-row w-full border-b-[0.5px] border-[var(--color-brand-border)]">
                    <div className="w-full lg:w-[40%] flex flex-col p-8 sm:p-12 lg:p-16 border-b-[0.5px] lg:border-b-0 lg:border-r-[0.5px] border-[var(--color-brand-border)] bg-neutral-50/50">
                        <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                            How We Read
                        </h2>
                    </div>
                    <div className="w-full lg:w-[60%] p-8 sm:p-12 lg:p-24">
                        <h3 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight text-[var(--color-foreground)] max-w-3xl mb-12">
                            We believe we never read with our eyes alone. We read through the <span className="text-[var(--color-brand-red)] italic">social, cultural, and historical</span> lenses we carry.
                        </h3>
                        <div className="max-w-2xl text-[14px] leading-relaxed text-[var(--color-brand-gray)] flex flex-col gap-6">
                            <p>Everything published in THWARA—whether an academic breakdown of coastal ecology or a free-verse poem about midnight buses—acknowledges the subjective positioning of the author. Objectivity is a myth established by those who have never had to view the world from outside the center.</p>
                        </div>
                    </div>
                </div>

                {/* Community & Goals */}
                <div className="flex flex-col lg:flex-row w-full bg-neutral-50/30">

                    <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-24 border-b-[0.5px] lg:border-b-0 lg:border-r-[0.5px] border-[var(--color-brand-border)]">
                        <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-12">
                            Knowledge, Culture & Society
                        </h2>
                        <p className="text-[15px] text-[var(--color-brand-gray)] leading-relaxed max-w-sm">
                            Our approach bypasses the sterile walls of academia to bring deep research and aesthetic literature directly to the public domain. We fund our efforts via the collective support of readers who share our urgency.
                        </p>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col p-8 sm:p-12 lg:p-24">
                        <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-12">
                            Our Community
                        </h2>
                        <p className="text-[15px] text-[var(--color-brand-gray)] leading-relaxed max-w-sm mb-12">
                            By supporting emerging and marginalized voices across Kerala and its diaspora, THWARA creates a scaffold for untested ideas, radical art, and vital documentation.
                        </p>
                        <Link href="/contributors" className="inline-flex max-w-max items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] hover:text-[var(--color-brand-red)] transition-colors group">
                            <span>View Directory</span>
                            <span className="block w-4 h-[1px] bg-current group-hover:w-8 transition-all duration-300"></span>
                        </Link>
                    </div>

                </div>

            </section>

            {/* 4. Footer Mantra */}
            <section className="bg-neutral-100 text-[var(--color-brand-black)] border-b-[0.5px] border-[var(--color-brand-border)]">
                <div className="p-8 sm:p-16 lg:p-32 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-red)] mb-8">
                        Our Vision
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl italic tracking-tight mb-24 max-w-2xl text-[var(--color-brand-gray)]">
                        "To make knowledge more accessible, local and democratic."
                    </h2>

                    <h1 className="font-serif text-[12vw] sm:text-[10vw] lg:text-[8rem] font-medium leading-[0.8] tracking-tighter uppercase w-full">
                        <span className="block hover:text-[var(--color-brand-red)] transition-colors duration-300">Think.</span>
                        <span className="block text-[var(--color-brand-red)] transition-colors duration-300">Write.</span>
                        <span className="block text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] transition-colors duration-300">Reimagine.</span>
                    </h1>
                </div>
            </section>

        </main>
    );
}
