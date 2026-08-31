"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
    { label: "ESSAYS", href: "/essays" },
    { label: "CREATIVE", href: "/creative" },
    { label: "WEBZINE", href: "/webzine" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTRIBUTORS", href: "/contributors" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)]">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 sm:px-8">

                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2 outline-none group">
                    <Image
                        src="/image.png"
                        alt="THWARA"
                        width={100}
                        height={30}
                        className="h-6 w-auto object-contain transition-opacity duration-300"
                        priority
                    />
                </Link>

                {/* Center: Metadata / Nav (Desktop) */}
                <nav className="hidden md:flex flex-1 justify-center gap-10">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-[9px] font-semibold tracking-[0.25em] text-[var(--color-foreground)] transition-colors hover:text-[var(--color-brand-red)]"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center justify-end gap-6 sm:w-[150px]">
                    <div className="hidden sm:flex items-center text-[10px] font-semibold tracking-[0.2em] text-[var(--color-brand-gray)]">
                        <button className="text-[var(--color-foreground)] hover:text-[var(--color-brand-red)] transition-colors">EN</button>
                        <span className="mx-1 select-none font-sans font-light">/</span>
                        <button className="hover:text-[var(--color-brand-red)] transition-colors text-[11px]">മലയാളം</button>
                    </div>

                    <Link
                        href="/search"
                        aria-label="Global Search"
                        className="hidden sm:block text-[var(--color-foreground)] transition-colors hover:text-[var(--color-brand-red)]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </Link>

                    <button
                        aria-label="Toggle menu"
                        className="block md:hidden p-1 text-[var(--color-foreground)] overflow-hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <div className="w-5 h-4 flex flex-col justify-between items-end">
                            <span className={`block h-[1px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'w-5 translate-y-[7.5px] rotate-45' : 'w-5'}`} />
                            <span className={`block h-[1px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
                            <span className={`block h-[1px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'w-5 -translate-y-[7.5px] -rotate-45' : 'w-3'}`} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Thin elegant border separating header content */}
            <div className="w-full h-[0.5px] bg-[var(--color-brand-border)] opacity-50" />

            {/* Mobile Drawer (Absolute overlay for premium feel) */}
            <div className={`absolute top-full left-0 w-full bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)] transition-all duration-500 origin-top overflow-hidden md:hidden ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <nav className="flex flex-col p-6 gap-6">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-[11px] font-semibold tracking-[0.25em] text-[var(--color-foreground)] transition-colors hover:text-[var(--color-brand-red)] border-b-[0.5px] border-[var(--color-brand-border)] pb-3"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                        <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.2em] text-[var(--color-foreground)] group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-[var(--color-brand-red)] transition-colors">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <span className="group-hover:text-[var(--color-brand-red)] transition-colors">SEARCH</span>
                        </Link>

                        <div className="flex items-center text-[10px] font-semibold tracking-[0.2em] text-[var(--color-brand-gray)]">
                            <button className="text-[var(--color-foreground)] hover:text-[var(--color-brand-red)] transition-colors">EN</button>
                            <span className="mx-2 select-none font-light">/</span>
                            <button className="text-[11px] hover:text-[var(--color-brand-red)] transition-colors">മലയാളം</button>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
