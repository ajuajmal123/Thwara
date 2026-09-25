"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Articles", href: "/articles" },
    { label: "Fiction", href: "/fiction" },
    { label: "Folklore", href: "/folklore" },
    { label: "Webzine", href: "/webzine" },
    { label: "Authors", href: "/authors" },
    { label: "Submissions", href: "/submissions" },
    { label: "Contact", href: "/contact" },
];

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-[var(--color-background)] border-b-2 border-b-[var(--color-brand-border)] p-4 shadow-sm">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between border-2 border-[var(--color-brand-border)] py-3 px-6 rounded-md">

                {/* Left: Navigation Menu */}
                <div className="flex items-center flex-1">
                    <button
                        aria-label="Toggle menu"
                        className="p-1 text-[var(--color-brand-red)] overflow-hidden mr-4 xl:hidden font-bold"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <div className="w-6 h-5 flex flex-col justify-between items-start">
                            <span className={`block h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'w-6 translate-y-[9px] rotate-45' : 'w-6'}`} />
                            <span className={`block h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'w-4'}`} />
                            <span className={`block h-[2px] bg-current transition-all duration-300 ${mobileMenuOpen ? 'w-6 -translate-y-[9px] -rotate-45' : 'w-5'}`} />
                        </div>
                    </button>

                    <nav className="hidden xl:flex items-center flex-wrap gap-x-4 gap-y-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-xs lg:text-sm font-bold text-black uppercase transition-colors hover:text-[var(--color-brand-red)] hover:underline decoration-[var(--color-brand-green)] underline-offset-4"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Center: Search Bar */}
                <div className="flex items-center justify-center mx-4">
                    <div className="relative border-2 border-[var(--color-brand-border)] rounded-md flex items-center bg-white">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none py-1 px-3 text-sm text-black placeholder:text-gray-400 focus:ring-0 w-32 md:w-48 lg:w-64"
                        />
                        <button aria-label="Search" className="px-3 text-[var(--color-brand-red)]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right: Actions / Logo */}
                <div className="flex items-center justify-end">
                    <Link href="/" className="flex items-center outline-none group border-2 border-[var(--color-brand-border)] p-1 rounded-sm bg-white">
                        <Image
                            src="/image.png"
                            alt="THWARA"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain transition-opacity duration-300"
                            priority
                        />
                    </Link>
                </div>
            </div>

            {/* Mobile Drawer */}
            <div className={`absolute top-full left-0 w-full bg-white border-b-2 border-b-[var(--color-brand-border)] border-t-[0.5px] transition-all duration-500 origin-top overflow-hidden xl:hidden ${mobileMenuOpen ? 'max-h-[600px] opacity-100 shadow-md' : 'max-h-0 opacity-0'}`}>
                <nav className="flex flex-col p-6 gap-4 border-l-2 border-r-2 border-b-2 border-[var(--color-brand-border)] mx-4 rounded-b-md">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-bold uppercase text-black transition-colors hover:text-[var(--color-brand-red)] border-b-2 border-dotted border-[var(--color-brand-border)] pb-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="text-[var(--color-brand-red)] mr-2">{"▸"}</span> {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
