"use client";

import Link from "next/link";

export default function TellingsPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white gap-8">
            <section className="bg-neutral-50 text-[var(--color-brand-black)] border-b-[0.5px] border-[var(--color-brand-border)] p-4 sm:p-12 lg:p-24 flex flex-col md:flex-row justify-between w-full">
                <div className="max-w-2xl w-full">
                    <h1 className="font-serif text-[4rem] sm:text-[6rem] lg:text-[8rem] font-medium leading-[0.8] tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis w-full text-[var(--color-brand-red)]">
                        Tellings
                    </h1>
                    <p className="mt-8 text-sm md:text-base text-[var(--color-brand-gray)] max-w-md leading-relaxed selection:bg-[var(--color-brand-red)] selection:text-white">
                        Listen to our latest stories, in-depth podcasts, and intimate interviews directly from our creators.
                    </p>
                </div>
            </section>

            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-3 sm:p-6 bg-white flex flex-col gap-6">

                {/* Tellings Categories */}
                <div className="flex flex-row flex-nowrap overflow-x-auto gap-4 sm:gap-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--color-brand-black)] mb-2 sm:mb-4 border-b-2 border-[var(--color-brand-border)] pb-2 sm:pb-4 hide-scrollbar w-full">
                    <span className="text-[var(--color-brand-red)] border-b-2 border-[var(--color-brand-red)] pb-1 cursor-pointer flex-shrink-0">Stories</span>
                    <span className="cursor-pointer hover:text-[var(--color-brand-red)] transition-colors flex-shrink-0">Podcast</span>
                    <span className="cursor-pointer hover:text-[var(--color-brand-red)] transition-colors flex-shrink-0">Interview</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="flex flex-col gap-3 border-2 border-[var(--color-brand-border)] p-4 rounded bg-white hover:shadow-md transition-shadow">
                            <div className="w-full aspect-video bg-neutral-100 rounded border-2 border-[var(--color-brand-border)] flex items-center justify-center">
                                <span className="text-4xl text-[var(--color-brand-red)]">🎧</span>
                            </div>
                            <div className="flex flex-col gap-2 text-left">
                                <h3 className="text-xl font-bold text-black">Audio Series #{item}</h3>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Stories</span>
                                <p className="text-sm text-black line-clamp-2 mt-1">An engaging piece blending sound, narrative, and critical storytelling. Explore the depths of our audio catalog.</p>
                                <div className="mt-4 w-full">
                                    <iframe
                                        style={{ borderRadius: '8px' }}
                                        src={`https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5?utm_source=generator&theme=0`}
                                        width="100%"
                                        height="80"
                                        frameBorder="0"
                                        allowFullScreen
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
