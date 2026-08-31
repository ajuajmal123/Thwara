const FORMS = [
    "RESEARCH",
    "CRITICAL ESSAYS",
    "POETRY",
    "FICTION",
    "PERSONAL NARRATIVES",
    "VISUAL ART",
    "SOCIAL COMMENTARY",
    "EXPERIMENTAL STORYTELLING"
];

export default function FormsSection() {
    return (
        <section className="bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)]">
            <div className="flex flex-col md:flex-row w-full">

                {/* Title side / Left Col */}
                <div className="w-full md:w-[30%] lg:w-[25%] border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--color-brand-border)] flex flex-col pt-4 px-4 sm:px-8 pb-12 bg-neutral-50/20">
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] mb-20 md:mb-32">
                        Across Forms
                    </h2>
                    <p className="text-[12px] md:text-[13px] text-[var(--color-brand-gray)] leading-relaxed max-w-[200px] mb-8 mt-auto font-medium">
                        At the intersection of rigorous scholarship and unbound creativity.
                    </p>
                    <a href="/creative" className="inline-flex max-w-max items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-foreground)] hover:text-[var(--color-brand-red)] transition-colors group">
                        <span>View Library</span>
                        <span className="block w-4 h-[1px] bg-current group-hover:w-6 transition-all duration-300"></span>
                    </a>
                </div>

                {/* Forms grid */}
                <div className="w-full md:w-[70%] lg:w-[75%] p-8 sm:p-12 lg:p-20">
                    <ul className="flex flex-col w-full border-t-[0.5px] border-[var(--color-brand-border)]">
                        {FORMS.map((form) => (
                            <li
                                key={form}
                                className="py-6 sm:py-8 border-b-[0.5px] border-[var(--color-brand-border)] group flex items-center justify-between cursor-default hover:pl-4 transition-all duration-500 ease-out"
                            >
                                <div className="flex items-center gap-6">
                                    <span className="opacity-0 w-0 h-[1px] bg-[var(--color-brand-red)] group-hover:opacity-100 group-hover:w-8 transition-all duration-500 delay-100" />
                                    <span className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] tracking-tight leading-none text-[var(--color-brand-gray)] group-hover:text-[var(--color-foreground)] group-hover:italic transition-colors duration-300">
                                        {form}.
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
