"use client";

export default function SubmissionsPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-6 flex flex-col bg-white">

            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col">

                <div className="max-w-4xl mx-auto flex flex-col gap-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-black text-center underline decoration-[var(--color-brand-red)] underline-offset-8">
                        Got a Thwara? A few things first!
                    </h1>

                    <ul className="flex flex-col gap-4 mt-4">

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">What’s welcome at Thwara?</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    Articles, essays, short stories, poetry, reviews, and social, political, cultural, and literary commentary.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">Pick your language -</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    English or Malayalam.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">How long?</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    500-1,600 words. Short, sharp, and substantial.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">No copy-paste!</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    We want original work. Plagiarised, copied, or third-party content won’t make the cut. Use AI as a thinking partner, not a ghostwriter. Research and ideation are fine; the work you submit should be your own.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">Keep it fresh.</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    We accept work that hasn’t been published elsewhere.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">Got a story that lives in memory?</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    Bring it to us. Oral histories, folklore, myths, legends, and community narratives that have been passed down through generations but remain unwritten or undocumented are especially welcome and may receive special consideration.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">Words and Visuals, we love that!</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    Original artwork and illustrations that complement your work are welcome. Don’t have one? Our editorial team can help.
                                </span>
                            </div>
                        </li>

                        <li className="flex gap-4 items-start">
                            <span className="text-[var(--color-brand-red)] text-2xl font-bold mt-1">▸</span>
                            <div>
                                <span className="font-bold text-black text-xl mr-2">Ready to send your thwara our way?</span>
                                <span className="text-black text-lg font-medium leading-relaxed">
                                    Email your work to our official email address, along with your name and the title. Once it lands with us, our editorial team may make light language or structural edits while keeping your voice and intent intact.
                                </span>
                            </div>
                        </li>

                    </ul>

                    <form className="mt-6 border-t-2 border-[var(--color-brand-border)] pt-8 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="flex flex-col gap-2">
                            <label className="text-black font-bold uppercase text-sm">Upload Document <span className="text-[var(--color-brand-red)]">*</span></label>
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-brand-border)] rounded cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <span className="text-[var(--color-brand-red)] text-2xl font-bold mb-2 group-hover:-translate-y-1 transition-transform">↑</span>
                                    <p className="text-sm font-bold text-black mb-1">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500">DOCX, PDF, or TXT (Max 10MB)</p>
                                </div>
                                <input type="file" className="hidden" />
                            </label>
                        </div>

                        <div className="flex flex-col gap-2 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none">
                                <span className="bg-white px-2 text-xs font-bold text-black uppercase">OR</span>
                            </div>
                            <hr className="border-[var(--color-brand-border)]" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-black font-bold uppercase text-sm">Google Drive Link</label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                className="w-full border-2 border-[var(--color-brand-border)] rounded px-4 py-3 text-black focus:outline-none focus:border-[var(--color-brand-red)] transition-colors"
                            />
                            <p className="text-xs text-gray-500 font-medium">Please ensure the link access is set to "Anyone with the link can view".</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="privacy-submission" className="w-4 h-4 accent-black border-[var(--color-brand-border)] rounded cursor-pointer" required />
                            <label htmlFor="privacy-submission" className="text-sm text-black font-medium">
                                I have read and agree to the <a href="/privacy-policy.pdf" target="_blank" className="font-bold underline text-[var(--color-brand-red)]">Privacy Policy</a>
                            </label>
                        </div>

                        <div className="mt-2 flex justify-center">
                            <button type="submit" className="bg-black text-white font-bold text-lg py-4 px-12 rounded hover:bg-[var(--color-brand-red)] transition-colors flex items-center gap-2 group">
                                SUBMIT NOW <span className="text-2xl text-[var(--color-brand-border)] font-bold group-hover:translate-x-2 transition-transform">→</span>
                            </button>
                        </div>
                    </form>
                </div>

            </section>

        </main>
    );
}
