import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
    { label: "About", href: "/about" },
    { label: "Essays", href: "/essays" },
    { label: "Creative", href: "/creative" },
    { label: "Webzine", href: "/webzine" },
    { label: "Contributors", href: "/contributors" },
    { label: "Archive", href: "/archive" },
];

export default function Footer() {
    return (
        <footer className="bg-[var(--color-background)] w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-1 border-b-[0.5px] border-[var(--color-brand-border)]">

                {/* Brand Block */}
                <div className="md:col-span-1 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-10 flex flex-col bg-neutral-50/40">
                    <Link href="/" className="inline-block outline-none mb-16">
                        <Image
                            src="/image.png"
                            alt="THWARA Logo"
                            width={100}
                            height={30}
                            className="h-6 w-auto object-contain grayscale opacity-60 hover:opacity-100 transition-opacity"
                        />
                    </Link>
                    <p className="mt-auto max-w-[200px] text-[11px] leading-relaxed text-[var(--color-brand-gray)] font-medium">
                        An independent bilingual digital media collective.
                    </p>
                </div>

                {/* Directory Links */}
                <div className="md:col-span-1 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-10 flex flex-col">
                    <h3 className="mb-10 text-[9px] font-semibold tracking-[0.25em] text-[var(--color-brand-black)] uppercase">Directory</h3>
                    <ul className="flex flex-col gap-5 mt-auto">
                        {FOOTER_LINKS.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="text-[13px] font-medium tracking-wide text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] hover:ml-1 transition-all duration-300"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Connect */}
                <div className="md:col-span-1 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-10 flex flex-col">
                    <h3 className="mb-10 text-[9px] font-semibold tracking-[0.25em] text-[var(--color-brand-black)] uppercase">Connect</h3>
                    <ul className="flex flex-col gap-5 mt-auto">
                        <li>
                            <a href="#" className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] hover:italic transition-all duration-300">
                                Instagram
                            </a>
                        </li>
                        <li>
                            <a href="#" className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] hover:italic transition-all duration-300">
                                Twitter / X
                            </a>
                        </li>
                        <li>
                            <a href="mailto:hello@thwara.com" className="text-[12px] font-medium tracking-wide text-[var(--color-foreground)] border-b-[0.5px] border-[var(--color-brand-gray)] pb-[2px] hover:text-[var(--color-brand-red)] hover:border-transparent transition-all duration-300 mt-4 inline-block">
                                hello@thwara.com
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Language State */}
                <div className="md:col-span-1 p-8 sm:p-10 flex flex-col items-start md:items-end justify-between bg-neutral-50/40">
                    <h3 className="mb-10 text-[9px] font-semibold tracking-[0.25em] text-[var(--color-brand-black)] uppercase w-full md:text-right">Lang</h3>
                    <div className="flex flex-row md:flex-col md:items-end gap-3 text-[11px] font-semibold tracking-[0.15em] text-[var(--color-brand-gray)] w-full">
                        <button className="text-[var(--color-foreground)] md:w-full md:text-right">English</button>
                        <span className="hidden md:block w-[0.5px] h-4 bg-[var(--color-brand-border)]" />
                        <button className="hover:text-[var(--color-foreground)] transition-colors md:w-full md:text-right font-sans">മലയാളം</button>
                    </div>
                </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between px-8 sm:px-10 py-6 text-[9px] uppercase tracking-[0.25em] text-[var(--color-brand-gray)] font-semibold">
                <p>© {new Date().getFullYear()} THWARA. ALL RIGHTS RESERVED.</p>
                <div className="mt-4 sm:mt-0 flex gap-6">
                    <Link href="#" className="hover:text-[var(--color-brand-black)] transition-colors">Privacy</Link>
                    <Link href="#" className="hover:text-[var(--color-brand-black)] transition-colors">Terms</Link>
                </div>
            </div>
        </footer>
    );
}
