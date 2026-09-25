import Link from 'next/link';

export default function WebzinePage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-10">
                
                <div className="flex items-center justify-between border-b-2 border-[var(--color-brand-border)] pb-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase underline decoration-[var(--color-brand-green)] underline-offset-8">Webzine Issues</h1>
                    <span className="text-[var(--color-brand-red)] text-5xl font-bold hidden md:block">↓</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="flex flex-col items-center p-4 border-2 border-[var(--color-brand-border)] rounded bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                            <img src={`https://picsum.photos/seed/webzine_cover${item}/400/550`} className="w-full aspect-[3/4] object-cover border-2 border-black rounded shadow" loading="lazy" />
                            <h2 className="text-xl font-bold text-black mt-4">Issue #{item}: Awakening</h2>
                            <p className="text-[var(--color-brand-red)] font-bold text-xs mt-1 mb-4">October 2026</p>
                            <button className="w-full border-2 border-[var(--color-brand-red)] text-black py-2 rounded text-sm font-bold hover:bg-[var(--color-brand-red)] hover:text-white transition-colors uppercase">
                                Read Online
                            </button>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}