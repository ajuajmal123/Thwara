import Link from 'next/link';

export default function FolklorePage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8">
                
                <div className="flex flex-col border-b-2 border-[var(--color-brand-border)] pb-6 items-center text-center">
                    <span className="text-[var(--color-brand-red)] text-3xl font-bold mb-4">❦</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-black uppercase underline decoration-[var(--color-brand-red)] underline-offset-8">Folklore & Myths</h1>
                    <p className="max-w-2xl text-black font-medium mt-6 text-sm">Documenting oral histories, community narratives, and ancient tales for the upcoming generations.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex flex-col border-2 border-[var(--color-brand-border)] rounded overflow-hidden group">
                            <img src={`https://picsum.photos/seed/folklore_pg${item}/800/400`} className="w-full aspect-video object-cover border-b-2 border-[var(--color-brand-border)]" loading="lazy" />
                            <div className="p-6 bg-white flex flex-col h-full">
                                <span className="text-[var(--color-brand-red)] font-bold text-xs uppercase">Field Notes</span>
                                <h2 className="text-2xl font-bold text-black my-2">The Legend of the Coast #{item}</h2>
                                <p className="text-black text-sm mb-4 flex-grow">
                                    Exploring stories rooted deeply in local tradition, investigating meaning that transcended generations...
                                </p>
                                <Link href="#" className="font-bold text-sm text-black flex items-center gap-2 group-hover:text-[var(--color-brand-red)] border-t border-[var(--color-brand-border)] pt-4">
                                    Explore Feature <span className="text-[var(--color-brand-red)] text-xl">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}