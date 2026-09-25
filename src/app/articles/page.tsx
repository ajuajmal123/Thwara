import Link from 'next/link';

export default function ArticlesPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">
                
                <div className="flex items-center gap-4 border-b-2 border-[var(--color-brand-border)] pb-4">
                    <span className="text-[var(--color-brand-red)] text-3xl font-bold">★</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase">Articles & Essays</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="flex flex-col border-2 border-[var(--color-brand-border)] rounded p-4 group bg-white shadow-sm hover:shadow-md transition-shadow">
                            <img src={`https://picsum.photos/seed/articles${item}/600/400`} className="w-full aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] mb-4" loading="lazy" />
                            <h2 className="text-xl font-bold text-black mb-2 leading-tight">Critical Analysis on Subject #{item}</h2>
                            <p className="text-black text-sm mb-4 line-clamp-3">
                                A comprehensive look at the intersection of modern culture and traditional practices, highlighting key insights and perspectives.
                            </p>
                            <div className="mt-auto flex justify-between items-center text-black border-t-2 border-dotted border-[var(--color-brand-border)] pt-4">
                                <span className="font-bold text-xs uppercase text-[var(--color-brand-red)]">John Doe</span>
                                <Link href="#" className="font-bold text-xs flex items-center gap-1 group-hover:text-[var(--color-brand-red)]">
                                    READ <span className="text-lg">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}