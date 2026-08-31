export default function Newsletter() {
    return (
        <section className="bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)]">
            <div className="flex flex-col md:flex-row w-full h-full">

                {/* Call to action side */}
                <div className="w-full md:w-1/2 p-12 sm:p-16 lg:p-24 flex flex-col justify-center border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--color-brand-border)]">
                    <h2 className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-brand-gray)] font-semibold mb-8">
                        Stay With the Conversation
                    </h2>
                    <p className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight text-[var(--color-foreground)] max-w-[400px]">
                        Follow new writing, research, and creative work delivered strictly when ready.
                    </p>
                </div>

                {/* Form side */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-neutral-50/30">
                    <div className="w-full max-w-sm">
                        <form className="flex flex-col gap-8 w-full group">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="w-full bg-transparent border-b-[0.5px] border-[var(--color-brand-border)] pb-4 outline-none text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-foreground)] placeholder-[var(--color-brand-gray)] focus:border-[var(--color-brand-black)] transition-colors"
                                required
                                aria-label="Email address"
                            />

                            <div className="flex justify-between items-center w-full">
                                <p className="text-[9px] text-[var(--color-brand-gray)] uppercase tracking-widest font-medium">
                                    No spam. Only editorial collections.
                                </p>
                                <button
                                    type="submit"
                                    className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] hover:text-[var(--color-brand-red)] transition-colors group/btn relative overflow-hidden"
                                >
                                    <span>Subscribe</span>
                                    <span className="block w-4 h-[1px] bg-current group-hover/btn:w-6 transition-all duration-300"></span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </section>
    );
}
