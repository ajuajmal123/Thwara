import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <main className="flex-1 flex flex-col min-h-[80vh] items-center justify-center p-8 bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)]">
            <div className="flex flex-col items-center justify-center text-center max-w-lg w-full">
                <Link href="/" className="inline-block outline-none opacity-50 hover:opacity-100 transition-opacity mb-24">
                    <Image
                        src="/image.png"
                        alt="THWARA"
                        width={100}
                        height={30}
                        className="h-6 w-auto object-contain grayscale mix-blend-multiply"
                    />
                </Link>

                <h1 className="font-serif text-[10rem] sm:text-[14rem] leading-[0.7] tracking-tighter text-[var(--color-brand-black)] font-medium mb-8">
                    4<span className="text-[var(--color-brand-red)]">0</span>4
                </h1>

                <h2 className="text-[12px] uppercase font-semibold tracking-[0.25em] text-[var(--color-brand-red)] mb-6">
                    This page has gone elsewhere.
                </h2>

                <p className="text-[15px] leading-relaxed text-[var(--color-brand-gray)] mb-16">
                    The page you're looking for could not be found. It may have been relocated to the archive or permanently removed.
                </p>

                <Link href="/" className="inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)] hover:text-[var(--color-brand-red)] transition-all group">
                    <span>Return To Thwara</span>
                    <span className="block w-4 h-[1px] bg-[var(--color-brand-red)] group-hover:w-8 transition-all duration-300"></span>
                </Link>
            </div>
        </main>
    );
}
