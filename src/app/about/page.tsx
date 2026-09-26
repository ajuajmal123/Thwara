export default function AboutPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">

            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col items-center">

                <div className="max-w-3xl flex flex-col gap-6 text-left">
                    <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 underline decoration-[var(--color-brand-red)] underline-offset-8">
                        About THWARA
                    </h1>

                    <p className="text-black text-lg md:text-xl leading-relaxed font-medium">
                        THWARA (Think Write and Reimagine All) is an independent bilingual digital media collective.
                    </p>

                    <p className="text-black text-lg md:text-xl leading-relaxed font-medium">
                        The Malayalam word ത്വര (Thwara) means an urge-to explore, to act, to create. We come together with that same urge: to think, write, and reimagine the world with curiosity and critical care.
                    </p>

                    <p className="text-black text-lg md:text-xl leading-relaxed font-medium">
                        We publish research and critical essays alongside poetry, fiction, personal narratives, visual art, social commentary, and experimental storytelling in Malayalam and English.
                        Our work sits at the meeting point of scholarship and creativity.
                    </p>

                    <p className="text-black text-lg md:text-xl leading-relaxed font-medium">
                        THWARA supports emerging writers and researchers and foster conversations across disciplines and forms. We aim to make knowledge more accessible, local, and democratic-and to grow from a publishing platform into a living community rooted in dialogue, curiosity, and critical thought.
                    </p>
                </div>

            </section>

        </main>
    );
}
