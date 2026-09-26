"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds duration for splash screen
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center transition-opacity duration-1000">
        <Image
          src="/image.png"
          alt="THWARA Logo"
          width={400}
          height={150}
          className="animate-pulse w-auto h-16 md:h-24"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6 flex flex-col gap-8">

      {/* 3.5 Client Quote Section */}
      <section className="border-4 border-[var(--color-brand-border)] p-8 md:p-12 rounded-lg bg-white flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-[var(--color-brand-red)] text-6xl font-serif leading-none h-8">“</span>
          <h2 className="text-xl md:text-3xl font-bold text-black max-w-4xl italic leading-relaxed">
            We believe we never read with our eyes alone. We read through the social, cultural, and historical lenses we carry.
          </h2>
          <span className="text-[var(--color-brand-red)] text-6xl font-serif leading-none h-8 rotate-180 mt-2">“</span>
        </div>
      </section>

      {/* 4. Latest Works (Featured Carousel) */}
      <section className="relative border-4 border-[var(--color-brand-border)] p-4 rounded-lg bg-white overflow-hidden">
        <h2 className="text-2xl font-bold text-black mb-4 underline decoration-[var(--color-brand-red)] underline-offset-8">Featured / Latest Works</h2>

        {/* Auto Scrolling Container */}
        <div className="w-full flex overflow-hidden py-2 -mx-4 px-4 mask-edges relative">
          <div className="flex gap-4 animate-scrollx whitespace-nowrap min-w-max hover:[animation-play-state:paused]">
            {[1, 2, 3, 4, 1, 2, 3, 4].map((item, index) => (
              <div key={index} className="shrink-0 w-[280px] md:w-[350px] flex flex-col gap-3 border-2 border-[var(--color-brand-border)] p-3 rounded bg-white whitespace-normal shadow-sm transition-shadow hover:shadow-md">
                <img src={`https://picsum.photos/seed/latest${item}/600/350`} alt={`Latest ${item}`} className="w-full aspect-video object-cover rounded border-2 border-[var(--color-brand-border)]" loading="lazy" />
                <h3 className="text-xl font-bold text-black leading-tight">Latest Work Title {item}</h3>
                <div className="flex justify-between items-center text-black">
                  <span className="font-bold text-xs">By Author</span>
                  <span className="text-xs">Sep 25, 2026</span>
                </div>
                <Link href="#" className="self-end mt-1 text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1 group">
                  READ MORE <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Articles Section */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-4 bg-white flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Articles</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col md:flex-row gap-4 border-2 border-[var(--color-brand-border)] rounded p-3 group hover:shadow-md transition-shadow bg-white">
              <img src={`https://picsum.photos/seed/article${item}/400/250`} alt={`Article ${item}`} className="md:w-1/4 aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] shrink-0" loading="lazy" />
              <div className="flex flex-col gap-3 justify-center text-left">
                <h3 className="text-xl font-bold text-black">Article Title #{item} Exploring The Depths</h3>
                <p className="text-black text-sm leading-relaxed line-clamp-2">
                  This is a brief summary of the article. It talks about many fascinating aspects of literature, psychology, and culture.
                </p>
                <div className="flex items-center gap-3 text-black text-xs">
                  <span className="font-bold">Author Name</span>
                  <span>|</span>
                  <span className="text-[var(--color-brand-red)] font-bold cursor-pointer group-hover:underline">Read Article →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Webzine Section */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 bg-white flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-red)] underline-offset-8">Webzine</h2>
          <Link href="/webzine" className="text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1">View All <span>→</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col gap-3 border-2 border-[var(--color-brand-border)] p-3 rounded bg-white items-center text-center">
              <img src={`https://picsum.photos/seed/webzine${item}/400/500`} alt={`Webzine ${item}`} className="w-full aspect-[3/4] object-cover rounded border-2 border-[var(--color-brand-border)]" loading="lazy" />
              <h3 className="text-lg font-bold text-black mt-1">Webzine Issue {item}</h3>
              <button className="border-2 border-[var(--color-brand-red)] text-[var(--color-brand-red)] py-1 px-4 rounded text-sm font-bold hover:bg-[var(--color-brand-red)] hover:text-white transition-colors">
                READ NOW
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Fictions Section */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-4 bg-white flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Fictions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex border-2 border-[var(--color-brand-border)] p-3 rounded bg-white items-center gap-4">
              <img src={`https://picsum.photos/seed/fiction${item}/200/200`} alt={`Fiction ${item}`} className="w-24 h-24 object-cover rounded border-2 border-[var(--color-brand-border)] shrink-0" loading="lazy" />
              <div className="flex flex-col gap-1 text-left">
                <h3 className="text-lg font-bold text-black">A Tale of Two Worlds {item}</h3>
                <span className="text-xs text-black font-bold">Short Story • By John Doe</span>
                <Link href="#" className="text-[var(--color-brand-red)] font-bold text-xs mt-1 flex gap-1 items-center">
                  Read <span className="text-sm">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Folklore Section (Matches Articles Style) */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-4 bg-white flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-red)] underline-offset-8">Folklore</h2>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col md:flex-row gap-4 border-2 border-[var(--color-brand-border)] rounded p-3 group hover:shadow-md transition-shadow bg-white">
              <img src={`https://picsum.photos/seed/folklore${item}/400/250`} alt={`Folklore ${item}`} className="md:w-1/4 aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] shrink-0" loading="lazy" />
              <div className="flex flex-col gap-3 justify-center text-left">
                <h3 className="text-xl font-bold text-black">Folklore Chronicles: Myth #{item}</h3>
                <p className="text-black text-sm leading-relaxed line-clamp-2">
                  Delve into oral histories, myths, and field notes exploring ancient roots and traditional tales passed down through generations.
                </p>
                <div className="flex items-center gap-3 text-black text-xs">
                  <span className="font-bold">Field Notes</span>
                  <span>|</span>
                  <span className="text-[var(--color-brand-red)] font-bold cursor-pointer group-hover:underline">Explore →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Newsletter Section */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-8 bg-white flex flex-col items-center gap-6 justify-center">
        <h2 className="text-3xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Join Our Newsletter</h2>

        <form className="w-full max-w-lg flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1">
            <label className="text-black font-bold uppercase text-xs">Email Address</label>
            <input
              type="email"
              placeholder="hello@example.com"
              className="border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black focus:outline-none focus:border-[var(--color-brand-red)] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-black font-bold uppercase text-xs">WhatsApp Number</label>
            <input
              type="tel"
              placeholder="+1234567890"
              className="border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black focus:outline-none focus:border-[var(--color-brand-red)] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" id="privacy-newsletter" className="w-4 h-4 accent-black border-[var(--color-brand-border)] rounded cursor-pointer" required />
            <label htmlFor="privacy-newsletter" className="text-xs text-black font-medium">
              I agree to the <Link href="/privacy-policy.pdf" target="_blank" className="font-bold underline text-[var(--color-brand-red)]">Privacy Policy</Link>
            </label>
          </div>
          <button className="bg-black text-white font-bold text-sm py-3 rounded hover:bg-[var(--color-brand-red)] transition-colors mt-2 flex items-center justify-center gap-2">
            SUBSCRIBE <span className="text-lg text-[var(--color-brand-border)] font-bold">→</span>
          </button>
        </form>
      </section>

    </div>
  );
}
