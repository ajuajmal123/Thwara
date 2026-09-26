import Link from "next/link";
import Image from "next/image";

const COL1_LINKS = [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Article", href: "/articles" },
    { label: "Folklore", href: "/folklore" },
    { label: "Fiction", href: "/fiction" },
    { label: "Webzine", href: "/webzine" },
];

const COL2_LINKS = [
    { label: "Submissions", href: "/submissions" },
    { label: "Guidelines", href: "/guidelines" },
    { label: "Privacy and Policy", href: "/privacy-policy.pdf" },
    { label: "Contact", href: "/contact" },
];

export default function Footer() {
    return (
        <footer className="bg-white w-full border-t-4 border-[var(--color-brand-border)] p-4">
            <div className="max-w-[1400px] mx-auto border-4 border-[var(--color-brand-border)] rounded-md p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">

                    {/* Brand Info & Logos */}
                    <div className="flex flex-col gap-4">
                        <Link href="/" className="inline-block outline-none">
                            <Image
                                src="/image.png"
                                alt="THWARA Logo"
                                width={120}
                                height={40}
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm font-bold text-black max-w-[250px]">
                            Think, Write, Reimagine all.
                        </p>
                    </div>

                    {/* Column 1 Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-black uppercase underline decoration-[var(--color-brand-red)] underline-offset-4">Explore</h3>
                        <ul className="flex flex-col gap-2 mt-2">
                            {COL1_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-bold text-black hover:text-[var(--color-brand-red)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-[var(--color-brand-red)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2 Links */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-bold text-black uppercase underline decoration-[var(--color-brand-red)] underline-offset-4">Information</h3>
                        <ul className="flex flex-col gap-2 mt-2">
                            {COL2_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm font-bold text-black hover:text-[var(--color-brand-red)] transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="text-[var(--color-brand-red)] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect & Region */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-black uppercase">Follow Us</h3>
                        <div className="flex gap-4 flex-wrap">
                            {["X/Twitter", "Facebook", "Instagram", "YouTube", "LinkedIn"].map((platform) => (
                                <a key={platform} href="#" className="w-8 h-8 rounded-full border-2 border-[var(--color-brand-border)] flex items-center justify-center text-[var(--color-brand-red)] hover:bg-[var(--color-brand-red)] hover:text-white transition-colors" title={platform}>
                                    <span className="text-xs font-bold">{platform[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-[1400px] mx-auto mt-4 text-center">
                <p className="text-xs font-bold text-black">© {new Date().getFullYear()} THWARA. ALL RIGHTS RESERVED.</p>
            </div>
        </footer>
    );
}
