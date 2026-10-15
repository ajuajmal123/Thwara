"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAdminAction } from "../actions";

interface AdminShellProps {
  children: React.ReactNode;
  hasServiceRoleKey: boolean;
}

export default function AdminShell({ children, hasServiceRoleKey }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfigHelper, setShowConfigHelper] = useState(false);

  // Close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: "Overview", href: "/admin", icon: "📊", matchExact: true },
    { label: "Articles & Essays", href: "/admin/articles", icon: "📝" },
    { label: "Submissions Inbox", href: "/admin/submissions", icon: "📥" },
    { label: "Fiction & Folklore", href: "/admin/fiction", icon: "📖" },
    { label: "Tellings", href: "/admin/tellings", icon: "🎧" },
    { label: "Webzine Issues", href: "/admin/webzine", icon: "🗞️" },
    { label: "Authors Directory", href: "/admin/authors", icon: "👥" },
    { label: "Media Library", href: "/admin/media", icon: "🖼️" },
  ];

  const isCurrentActive = (itemHref: string, matchExact?: boolean) => {
    if (matchExact) {
      return pathname === itemHref;
    }
    return pathname === itemHref || pathname?.startsWith(`${itemHref}/`);
  };

  // Find active label for mobile header
  const currentNav = navItems.find((item) => isCurrentActive(item.href, item.matchExact)) || navItems[0];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row text-neutral-900 font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE TOP HEADER (visible on screens < md)                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b-2 border-[var(--color-brand-border)] px-4 py-3 flex items-center justify-between shadow-sm">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/image.png"
            alt="Thwara"
            width={32}
            height={24}
            className="w-8 h-auto object-contain"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-black">THWARA</span>
              <span className="text-[9px] uppercase font-bold tracking-wider bg-[var(--color-brand-red)] text-white px-1.5 py-0.2 rounded">
                Admin
              </span>
            </div>
            <span className="text-[11px] font-medium text-neutral-500 block truncate max-w-[150px]">
              {currentNav.label}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View public website"
            className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-1 rounded font-bold border border-neutral-300"
          >
            Live ↗
          </a>

          {/* Hamburger toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center">
              <span
                className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE DRAWER OVERLAY & MENU                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b-2 border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image
              src="/image.png"
              alt="Thwara"
              width={32}
              height={24}
              className="w-8 h-auto object-contain"
            />
            <span className="font-bold text-sm text-black">Menu Navigation</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200 flex items-center justify-center font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drawer Nav Items */}
        <nav className="p-3 flex flex-col gap-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const active = isCurrentActive(item.href, item.matchExact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                  active
                    ? "bg-[var(--color-brand-red)] text-white shadow-sm"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-[var(--color-brand-red)]"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Drawer Footer with status and sign out */}
        <div className="p-4 border-t-2 border-neutral-200 bg-neutral-50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-neutral-600">Admin Mode Active</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[var(--color-brand-green)] hover:underline"
            >
              Public Site ↗
            </a>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full text-center py-2.5 px-3 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>🔒</span>
              <span>Lock / Sign Out</span>
            </button>
          </form>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DESKTOP SIDEBAR (hidden on mobile, visible on md+)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-white border-r-4 border-[var(--color-brand-border)] flex-col shrink-0 min-h-screen sticky top-0 h-screen">
        {/* Brand bar */}
        <div className="p-5 border-b-2 border-neutral-200 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/image.png"
              alt="Thwara"
              width={40}
              height={30}
              className="w-10 h-auto object-contain"
            />
            <div>
              <span className="font-bold text-base text-black tracking-tight block">THWARA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)] block -mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title="View live website in new tab"
            className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded font-medium border border-neutral-300"
          >
            Live ↗
          </a>
        </div>

        {/* Navigation links */}
        <nav className="p-3 flex flex-col gap-1.5 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const active = isCurrentActive(item.href, item.matchExact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  active
                    ? "bg-[var(--color-brand-red)] text-white shadow-sm"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-[var(--color-brand-red)]"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom account / logout */}
        <div className="p-4 border-t-2 border-neutral-200 flex flex-col gap-3 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-600">Admin Mode Active</span>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full text-left py-2 px-3 text-xs font-bold text-neutral-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center gap-2 cursor-pointer border border-transparent hover:border-red-200"
            >
              <span>🔒</span>
              <span>Lock / Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT AREA                                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex bg-white border-b-2 border-neutral-200 px-8 py-4 items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-brand-green)]">
              Editorial Studio
            </span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs font-bold text-neutral-600">{currentNav.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-neutral-600 hover:text-black border border-neutral-300 px-3 py-1.5 rounded-md hover:bg-neutral-50 transition-colors"
            >
              Public Site ↗
            </Link>
          </div>
        </header>

        {/* Service Role Key Warning Banner (if missing) */}
        {!hasServiceRoleKey && (
          <div className="bg-amber-50 border-b-2 border-amber-300 px-4 py-3 sm:px-8 text-amber-900 text-xs">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="text-base leading-none">⚠️</span>
                <div>
                  <strong className="font-bold">SUPABASE_SERVICE_ROLE_KEY is missing in your .env:</strong>
                  <span className="ml-1 text-amber-800">
                    Content publishing, editing, and viewing submissions will fail because Supabase Row-Level Security (RLS) blocks anonymous modifications.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowConfigHelper(true)}
                className="self-start sm:self-auto px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-[11px] transition-colors cursor-pointer shrink-0"
              >
                How to Fix in 1 Min →
              </button>
            </div>
          </div>
        )}

        {/* Instructions Modal for SUPABASE_SERVICE_ROLE_KEY */}
        {showConfigHelper && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-xl w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <span>🔑</span>
                  <span>How to fix SUPABASE_SERVICE_ROLE_KEY</span>
                </h3>
                <button
                  onClick={() => setShowConfigHelper(false)}
                  className="text-neutral-400 hover:text-black font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-neutral-700 leading-relaxed flex flex-col gap-3">
                <p>
                  Supabase uses <strong>Row-Level Security (RLS)</strong>. The public anon key only allows reading public articles. Server actions need the privileged <code>service_role</code> secret key to write articles, approve pitches, and bypass RLS safely on the server.
                </p>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex flex-col gap-2 font-mono text-[11px]">
                  <span className="font-bold text-neutral-900 font-sans">Step 1: Open Supabase Project API Settings</span>
                  <a
                    href="https://supabase.com/dashboard/project/feorwlxolamiqvgwdalk/settings/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-brand-red)] underline font-sans font-bold"
                  >
                    Open Supabase Dashboard API Settings ↗
                  </a>
                  <span className="text-neutral-500 font-sans text-[11px]">
                    (Or go to Supabase Dashboard → Settings → API)
                  </span>
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex flex-col gap-1.5 font-mono text-[11px]">
                  <span className="font-bold text-neutral-900 font-sans">Step 2: Copy the "service_role" Secret Key</span>
                  <p className="font-sans text-neutral-600">
                    Find the key named <code>service_role</code> (marked <em>secret</em>). Click "Reveal" or "Copy".
                  </p>
                </div>

                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex flex-col gap-1.5 font-mono text-[11px]">
                  <span className="font-bold text-neutral-900 font-sans">Step 3: Paste into your .env file</span>
                  <div className="bg-neutral-900 text-green-400 p-2.5 rounded overflow-x-auto text-[11px]">
                    SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
                  </div>
                  <span className="font-sans text-neutral-500 text-[10px]">
                    After pasting, restart your Next.js server so the new environment variable is loaded.
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-end">
                <button
                  onClick={() => setShowConfigHelper(false)}
                  className="px-4 py-2 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white font-bold rounded-lg text-xs cursor-pointer"
                >
                  Got it, close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
