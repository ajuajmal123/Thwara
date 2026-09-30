export default function AuthorsPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8 text-center items-center">

                <h1 className="text-4xl md:text-6xl font-bold text-black uppercase">Authors <span className="text-[var(--color-brand-red)]">&</span> Voices</h1>
                <p className="max-w-xl text-black font-medium border-b-2 border-[var(--color-brand-border)] pb-8">
                    Discover the talented writers, researchers, and creators behind the content shaping THWARA's vision.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="flex flex-col items-center p-6 border-2 border-[var(--color-brand-border)] rounded bg-white group">
                            <img src={`https://picsum.photos/seed/author${item}/200/200`} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-[0_0_0_2px_var(--color-brand-border)] mb-4 grayscale group-hover:grayscale-0 transition-all" loading="lazy" />
                            <h2 className="text-lg font-bold text-black uppercase">Author Name {item}</h2>

                            <p className="text-black text-xs">
                                A critical researcher focusing on cultural phenomenon and digital media.
                            </p>
                        </div>
                    ))}
                </div>

            </section>
        </main>
    );
}