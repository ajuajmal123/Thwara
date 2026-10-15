"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getArticles, getFictions, getFolklore, getWebzines, getAuthors } from "@/services/strapiServices";
import { getStrapiMedia } from "@/lib/strapi";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HomeArticle { id: any; title: string; author: string; category: string; slug: string; coverImage: string; }
interface HomeFiction { id: any; title: string; author: string; type: string; slug: string; }
interface HomeFolklore { id: any; title: string; author: string; slug: string; coverImage: string; }
interface HomeWebzine { id: any; title: string; date: string; slug: string; coverImage: string; category: string; }
interface HomeAuthor { id: any; name: string; description: string; photoUrl: string; }

// ─── Empty / Coming-soon card ─────────────────────────────────────────────────
function ComingSoon({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-14 gap-3 border-2 border-dashed border-[var(--color-brand-border)] rounded-lg bg-neutral-50">
      <span className="text-4xl">✦</span>
      <p className="text-black font-bold text-lg">{label}</p>
      <p className="text-neutral-500 text-sm">Content is being prepared — check back soon.</p>
    </div>
  );
}

// ─── Section skeleton while loading ──────────────────────────────────────────
function LoadingDots() {
  return (
    <div className="col-span-full flex items-center justify-center py-12 gap-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 rounded-full bg-[var(--color-brand-red)] animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  // Splash
  const [showSplash, setShowSplash] = useState(false);
  const mounted = useRef(false);

  // Data
  const [articles, setArticles] = useState<HomeArticle[] | null>(null);
  const [fictions, setFictions] = useState<HomeFiction[] | null>(null);
  const [folklores, setFolklores] = useState<HomeFolklore[] | null>(null);
  const [webzines, setWebzines] = useState<HomeWebzine[] | null>(null);
  const [authors, setAuthors] = useState<HomeAuthor[] | null>(null);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Splash timer
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), 2500);

    // Fetch all sections in parallel — each fails gracefully
    Promise.allSettled([
      getArticles(1, 3),
      getFictions(1, 4),
      getFolklore(1, 3),
      getWebzines(),
      getAuthors(),
    ]).then(([artRes, ficRes, folRes, webRes, autRes]) => {
      // Articles
      if (artRes.status === "fulfilled" && artRes.value?.data?.length) {
        setArticles(artRes.value.data.slice(0, 3).map((e: any) => {
          const a = e.attributes || e;
          return {
            id: e.id,
            title: a.title || `Article #${e.id}`,
            author: a.authorName || a.author?.name || "Thwara Editorial",
            category: a.domain || "Article",
            slug: a.slug || String(e.id),
            coverImage: a.coverImage?.url
              ? getStrapiMedia(a.coverImage.url) || ""
              : a.coverImage?.data?.attributes?.url
                ? getStrapiMedia(a.coverImage.data.attributes.url) || ""
                : "",
          };
        }));
      } else {
        setArticles([]);
      }

      // Fiction
      if (ficRes.status === "fulfilled" && ficRes.value?.data?.length) {
        setFictions(ficRes.value.data.slice(0, 4).map((e: any) => {
          const a = e.attributes || e;
          return {
            id: e.id,
            title: a.title || `Fiction #${e.id}`,
            author: a.authorName || a.author?.name || "Thwara",
            type: a.domain || a.type || "Short Story",
            slug: a.slug || String(e.id),
          };
        }));
      } else {
        setFictions([]);
      }

      // Folklore
      if (folRes.status === "fulfilled" && folRes.value?.data?.length) {
        setFolklores(folRes.value.data.slice(0, 3).map((e: any) => {
          const a = e.attributes || e;
          return {
            id: e.id,
            title: a.title || `Folklore #${e.id}`,
            author: a.authorName || a.author?.name || "Thwara",
            slug: a.slug || String(e.id),
            coverImage: a.coverImage?.url
              ? getStrapiMedia(a.coverImage.url) || ""
              : a.coverImage?.data?.attributes?.url
                ? getStrapiMedia(a.coverImage.data.attributes.url) || ""
                : "",
          };
        }));
      } else {
        setFolklores([]);
      }

      // Webzine
      if (webRes.status === "fulfilled" && webRes.value?.data?.length) {
        setWebzines(webRes.value.data.slice(0, 3).map((e: any) => {
          const a = e.attributes || e;
          return {
            id: e.id,
            title: a.title || a.webzineName || `Issue #${e.id}`,
            date: a.date || "2026",
            slug: a.slug || String(e.id),
            category: a.domain || "Visual Essay",
            coverImage: a.coverImage?.url
              ? getStrapiMedia(a.coverImage.url) || ""
              : a.coverImage?.data?.attributes?.url
                ? getStrapiMedia(a.coverImage.data.attributes.url) || ""
                : "",
          };
        }));
      } else {
        setWebzines([]);
      }

      // Authors
      if (autRes.status === "fulfilled" && autRes.value?.data?.length) {
        setAuthors(autRes.value.data.slice(0, 3).map((e: any) => {
          const a = e.attributes || e;
          let photoUrl = "";
          if (a.photo?.url) photoUrl = getStrapiMedia(a.photo.url) || "";
          else if (a.photo?.data?.attributes?.url) photoUrl = getStrapiMedia(a.photo.data.attributes.url) || "";
          else if (typeof a.photo === "string") photoUrl = a.photo.startsWith("http") || a.photo.startsWith("/") ? a.photo : getStrapiMedia(a.photo) || "";
          return {
            id: e.id,
            name: a.name || a.authorName || "Contributing Author",
            description: a.description || a.bio || "",
            photoUrl: photoUrl || `/placeholder-author.jpg`,
          };
        }));
      } else {
        setAuthors([]);
      }
    });

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
        <Image
          src="/image.png"
          alt="THWARA Logo"
          width={160}
          height={135}
          className="animate-pulse w-[160px] h-[135px] md:w-auto md:h-32 object-contain"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col gap-4 sm:gap-8">

      {/* Quote */}
      <section className="border-4 border-[var(--color-brand-border)] p-4 sm:p-8 md:p-12 rounded-lg bg-white flex flex-col">
        <div className="flex flex-col gap-2 sm:gap-4 max-w-3xl mx-auto w-full">
          <span className="text-[var(--color-brand-red)] text-4xl sm:text-6xl font-serif leading-none h-2 sm:h-4 text-left">"</span>
          <h2 className="text-[15px] sm:text-base md:text-2xl lg:text-3xl font-bold text-black italic leading-normal sm:leading-relaxed text-justify px-1 sm:px-2 md:px-4">
            We never read with our eyes alone. We read through the social, cultural, and historical lenses we carry.
          </h2>
          <span className="text-[var(--color-brand-red)] text-4xl sm:text-6xl font-serif leading-none h-2 sm:h-4 text-right mt-2 sm:mt-0">"</span>
        </div>
      </section>

      {/* ── Articles ─────────────────────────────────────────────────────── */}
      <section className="border-4 border-[var(--color-brand-border)] p-3 sm:p-6 rounded-lg bg-white flex flex-col gap-4">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-brand-border)] pb-3">
          <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Articles</h2>
          <Link href="/articles" className="text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1">View All <span>→</span></Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {articles === null ? (
            <LoadingDots />
          ) : articles.length === 0 ? (
            <ComingSoon label="Articles & Essays" />
          ) : (
            articles.map((item) => (
              <Link
                key={item.id}
                href={`/articles/${item.slug}`}
                className="flex flex-col md:flex-row gap-4 border-2 border-[var(--color-brand-border)] rounded p-3 group hover:shadow-md transition-shadow bg-white"
              >
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="md:w-1/4 aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] shrink-0" loading="lazy" />
                ) : (
                  <div className="md:w-1/4 aspect-video bg-neutral-100 rounded border-2 border-[var(--color-brand-border)] shrink-0 flex items-center justify-center">
                    <span className="text-3xl text-[var(--color-brand-red)]">✦</span>
                  </div>
                )}
                <div className="flex flex-col gap-2 justify-center text-left">
                  <span className="text-[var(--color-brand-red)] font-bold text-xs uppercase">{item.category}</span>
                  <h3 className="text-xl font-bold text-black group-hover:text-[var(--color-brand-red)] transition-colors leading-tight">{item.title}</h3>
                  <div className="flex items-center gap-3 text-black text-xs">
                    <span className="font-bold">{item.author}</span>
                    <span className="text-[var(--color-brand-red)] font-bold group-hover:underline">Read Article →</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── Webzine ───────────────────────────────────────────────────────── */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-4 sm:p-6 bg-white flex flex-col gap-4 sm:gap-6">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-brand-border)] pb-3">
          <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-red)] underline-offset-8">Webzine</h2>
          <Link href="/webzine" className="text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1">View All <span>→</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {webzines === null ? (
            <LoadingDots />
          ) : webzines.length === 0 ? (
            <ComingSoon label="Webzine Issues" />
          ) : (
            webzines.map((item) => (
              <Link key={item.id} href={`/webzine/${item.slug}`} className="flex flex-col gap-3 border-2 border-[var(--color-brand-border)] p-3 rounded bg-white items-center text-center group hover:shadow-md transition-all hover:-translate-y-1">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="w-full aspect-[3/4] object-cover rounded border-2 border-[var(--color-brand-border)]" loading="lazy" />
                ) : (
                  <div className="w-full aspect-[3/4] bg-neutral-100 rounded border-2 border-[var(--color-brand-border)] flex items-center justify-center">
                    <span className="text-5xl text-[var(--color-brand-red)]">✦</span>
                  </div>
                )}
                <span className="text-[var(--color-brand-red)] font-bold text-[10px] uppercase tracking-widest">{item.category}</span>
                <h3 className="text-lg font-bold text-black group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-xs text-neutral-500 font-medium">{item.date}</p>
                <span className="border-2 border-[var(--color-brand-red)] text-black py-1 px-4 rounded text-sm font-bold group-hover:bg-[var(--color-brand-red)] group-hover:text-white transition-colors uppercase">READ NOW</span>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── Fiction ───────────────────────────────────────────────────────── */}
      <section className="border-4 border-[var(--color-brand-border)] p-3 sm:p-4 rounded-lg bg-white flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-brand-border)] pb-3">
          <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Fiction</h2>
          <Link href="/fiction" className="text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1">View All <span>→</span></Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fictions === null ? (
            <LoadingDots />
          ) : fictions.length === 0 ? (
            <ComingSoon label="Fiction & Stories" />
          ) : (
            fictions.map((item) => (
              <Link key={item.id} href={`/fiction/${item.slug}`} className="flex border-2 border-[var(--color-brand-border)] p-3 rounded bg-white items-center gap-4 group hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-full bg-neutral-100 border-2 border-[var(--color-brand-border)] shrink-0 flex items-center justify-center">
                  <span className="text-2xl text-[var(--color-brand-red)]">✦</span>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <h3 className="text-lg font-bold text-black group-hover:text-[var(--color-brand-red)] transition-colors leading-tight line-clamp-2">{item.title}</h3>
                  <span className="text-xs text-black font-bold">{item.type} · By {item.author}</span>
                  <span className="text-[var(--color-brand-red)] font-bold text-xs mt-1 flex gap-1 items-center">Read <span className="text-sm">→</span></span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── Folklore ──────────────────────────────────────────────────────── */}
      <section className="border-4 border-[var(--color-brand-border)] p-3 sm:p-4 rounded-lg bg-white flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between border-b-2 border-[var(--color-brand-border)] pb-3">
          <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-red)] underline-offset-8">Folklore</h2>
          <Link href="/folklore" className="text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1">View All <span>→</span></Link>
        </div>
        <div className="flex flex-col gap-4">
          {folklores === null ? (
            <LoadingDots />
          ) : folklores.length === 0 ? (
            <ComingSoon label="Folklore & Oral Studies" />
          ) : (
            folklores.map((item) => (
              <Link key={item.id} href={`/folklore/${item.slug}`} className="flex flex-col md:flex-row gap-4 border-2 border-[var(--color-brand-border)] rounded p-3 group hover:shadow-md transition-shadow bg-white">
                {item.coverImage ? (
                  <img src={item.coverImage} alt={item.title} className="md:w-1/4 aspect-video object-cover rounded border-2 border-[var(--color-brand-border)] shrink-0" loading="lazy" />
                ) : (
                  <div className="md:w-1/4 aspect-video bg-neutral-100 rounded border-2 border-[var(--color-brand-border)] shrink-0 flex items-center justify-center">
                    <span className="text-3xl text-[var(--color-brand-red)]">✦</span>
                  </div>
                )}
                <div className="flex flex-col gap-2 justify-center text-left w-full">
                  <h3 className="text-xl font-bold text-black group-hover:text-[var(--color-brand-red)] transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-3 text-black text-xs">
                    <span className="font-bold">{item.author}</span>
                    <span>|</span>
                    <span className="text-[var(--color-brand-red)] font-bold group-hover:underline">Explore →</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── Authors ───────────────────────────────────────────────────────── */}
      <section className="border-4 border-[var(--color-brand-border)] p-4 sm:p-8 rounded-lg bg-white flex flex-col gap-6 items-center text-center">
        <div className="flex items-center justify-between w-full border-b-2 border-[var(--color-brand-border)] pb-3">
          <h2 className="text-2xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Authors & Voices</h2>
          <Link href="/authors" className="text-[var(--color-brand-red)] font-bold text-sm flex items-center gap-1">View All <span>→</span></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {authors === null ? (
            <LoadingDots />
          ) : authors.length === 0 ? (
            <ComingSoon label="Authors & Voices" />
          ) : (
            authors.map((author) => (
              <div key={author.id} className="flex flex-col items-center p-6 border-2 border-[var(--color-brand-border)] rounded-lg bg-white group hover:shadow-lg transition-all hover:-translate-y-1 relative">
                <div className="absolute top-3 right-3 text-[var(--color-brand-red)] text-xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">★</div>
                <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[var(--color-brand-border)] mb-4 shadow-sm">
                  <img src={author.photoUrl} alt={author.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <h3 className="text-lg font-bold text-black uppercase group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1 mb-2">{author.name}</h3>
                <p className="text-neutral-700 text-sm line-clamp-3 text-center leading-relaxed">{author.description || "Contributing author at THWARA."}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-5 sm:p-8 bg-white flex flex-col items-center gap-4 sm:gap-6 justify-center">
        <h2 className="text-3xl font-bold text-black underline decoration-[var(--color-brand-green)] underline-offset-8">Join Our Newsletter</h2>
        <form className="w-full max-w-lg flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-1">
            <label className="text-black font-bold uppercase text-xs">Email Address</label>
            <input type="email" placeholder="hello@example.com" className="border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black focus:outline-none focus:border-[var(--color-brand-red)] transition-colors" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-black font-bold uppercase text-xs">WhatsApp Number</label>
            <input type="tel" placeholder="+1234567890" className="border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black focus:outline-none focus:border-[var(--color-brand-red)] transition-colors" />
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
