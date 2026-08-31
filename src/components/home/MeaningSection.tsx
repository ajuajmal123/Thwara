export default function MeaningSection() {
    return (
        <section className="bg-[var(--color-brand-black)] text-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-black)] overflow-hidden">
            <div className="flex flex-col md:flex-row w-full">

                {/* Dictionary Entry Visual Block */}
                <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col justify-end p-8 sm:p-12 lg:p-16 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-neutral-800 lg:min-h-[600px]">
                    <div className="mb-auto">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                            Etymology & Definition
                        </span>
                    </div>
                    <div className="mt-24 md:mt-0">
                        <h2 className="font-sans text-[clamp(5rem,30vw,220px)] leading-none mb-0 text-white translate-x-[-8px] pointer-events-none md:break-keep">
                            ത്വര
                        </h2>
                        <div className="flex items-center gap-4 mt-6">
                            <span className="text-xl md:text-3xl font-serif italic text-neutral-400">/</span>
                            <span className="text-xl md:text-3xl font-serif text-white tracking-widest uppercase">thwa·ra</span>
                            <span className="text-xl md:text-3xl font-serif italic text-neutral-400">/</span>
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mt-4 font-semibold">
                            noun • malayalam
                        </p>
                    </div>
                </div>

                {/* Encyclopedic Meaning Execution */}
                <div className="w-full md:w-1/2 lg:w-[60%] flex flex-col justify-center p-8 sm:p-12 lg:p-24 selection:bg-white selection:text-[var(--color-brand-black)]">

                    <div className="flex gap-4 items-baseline mb-6">
                        <span className="text-[10px] font-bold text-[var(--color-brand-red)] w-4 font-serif">1.</span>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-white leading-tight max-w-sm">
                            An intense urge; an inner compulsion.
                        </h3>
                    </div>

                    <div className="flex gap-4 items-baseline mb-12">
                        <span className="text-[10px] font-bold text-[var(--color-brand-red)] w-4 font-serif">2.</span>
                        <div className="flex flex-col gap-3">
                            <span className="text-lg md:text-2xl font-serif text-neutral-300 italic max-w-md">
                                "An urge to explore, to act, to create."
                            </span>
                            <p className="text-[13px] md:text-sm leading-relaxed text-neutral-400 max-w-md mt-4 border-l-[0.5px] border-neutral-800 pl-4 py-1">
                                We come together with that same urge: to think, write, and reimagine the world. Our spaces are built for critical engagement and cultural reflection.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
