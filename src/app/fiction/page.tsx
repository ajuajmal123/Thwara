import Link from 'next/link';

export default function FictionPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">

                <div className="flex items-center gap-4 border-b-2 border-[var(--color-brand-border)] pb-4">

                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase">Fiction</h1>
                </div>

                <div className="flex flex-col gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="flex flex-col md:flex-row gap-6 border-2 border-[var(--color-brand-border)] rounded p-6 bg-white shrink-0 items-center hover:bg-neutral-50 transition-colors">
                            <img src={`https://picsum.photos/seed/fiction_pg${item}/300/300`} className="w-48 h-48 object-cover rounded border-2 border-[var(--color-brand-border)]" loading="lazy" />
                            <div className="flex flex-col text-left justify-center w-full">
                                <span className="text-[var(--color-brand-red)] font-bold text-xs tracking-widest uppercase mb-1">Short Story</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">Midnight City #{item}</h2>
                                <p className="text-black text-sm mb-4 leading-relaxed max-w-2xl">
                                    An evocative tale that explores memory and imagination, blurring the lines between reality and dreamscape in a rapidly evolving world.
                                </p>
                                <div className="flex justify-between items-center w-full border-t border-[var(--color-brand-border)] pt-4 mt-auto">
                                    <span className="font-bold text-black text-sm">Author • Feb 10, 2026</span>
                                    <Link href="#" className="flex items-center font-bold text-[var(--color-brand-red)] group">
                                        Read Story <span className="text-xl ml-2 group-hover:translate-x-2 transition-transform">→</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}