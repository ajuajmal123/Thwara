export default function AboutPage() {
    const teamMembers = [
        { id: 1, name: "Name 1", link: "#", initials: "IN" },
        { id: 2, name: "Name 2", link: "#", initials: "IN" },
        { id: 3, name: "Name 3", link: "#", initials: "IN" }
    ];

    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">

            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col">

                <div className="max-w-4xl w-full mx-auto flex flex-col gap-6 text-left text-justify">
                    <h1 className="text-3xl md:text-5xl font-bold text-black mb-6 underline decoration-[var(--color-brand-red)] underline-offset-8 text-left">
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

                <div className="max-w-4xl w-full mx-auto mt-16 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-black mb-10 underline decoration-[var(--color-brand-green)] underline-offset-8">
                        Our Team
                    </h2>

                    <div className="flex flex-wrap justify-center gap-8 w-full">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="flex flex-col items-center w-full sm:w-[250px] border-2 border-[var(--color-brand-border)] rounded p-6 bg-white relative">
                                <div className="absolute -top-3 -right-3 text-[var(--color-brand-red)] text-2xl">★</div>
                                <img src={`https://picsum.photos/seed/team${member.id}/250/250`} alt={member.name} className="w-32 h-32 rounded object-cover border-2 border-[var(--color-brand-border)] mb-4" loading="lazy" />
                                <h3 className="text-xl font-bold text-black">{member.name}</h3>
                                <div className="flex gap-2 mt-3">
                                    <a href="#" className="w-8 h-8 border-[1px] border-[var(--color-brand-border)] text-black rounded flex items-center justify-center text-sm font-bold hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)]">X</a>
                                    <a href="#" className="w-8 h-8 border-[1px] border-[var(--color-brand-border)] text-black rounded flex items-center justify-center text-sm font-bold hover:text-[var(--color-brand-red)] hover:border-[var(--color-brand-red)]">{member.initials}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

        </main>
    );
}
