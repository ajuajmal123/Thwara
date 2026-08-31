import Link from "next/link";
import Image from "next/image";

export default function AboutPreview() {
    return (
        <section className="bg-[var(--color-brand-black)] text-[var(--color-background)] border-b-[0.5px] border-neutral-800">
            <div className="flex flex-col lg:flex-row w-full">

                <div className="w-full lg:w-[40%] flex flex-col justify-end p-8 sm:p-12 lg:p-16 border-b-[0.5px] lg:border-b-0 lg:border-r-[0.5px] border-neutral-800">
                    <div className="mb-auto">
                        <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                            The Collective
                        </h2>
                    </div>
                    <div className="relative aspect-[4/5] w-full max-w-[280px] rounded-xs overflow-hidden bg-neutral-900 mt-16 grayscale opacity-80 mix-blend-lighten hidden md:block">
                        <Image
                            src="/image.png"
                            alt="Editorial Collection"
                            fill
                            sizes="(max-width: 1024px) 100vw, 30vw"
                            className="object-contain p-4"
                        />
                    </div>
                </div>

                <div className="w-full lg:w-[60%] flex flex-col justify-center p-8 sm:p-12 lg:p-24 selection:bg-white selection:text-[var(--color-brand-black)]">
                    <h3 className="font-serif text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem] leading-[1.05] tracking-tight text-white mb-12 max-w-2xl">
                        THWARA is an independent bilingual digital media collective.
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-24">
                        <p className="text-[14px] sm:text-[15px] text-neutral-400 leading-[1.8] max-w-[320px]">
                            We believe we never read with our eyes alone. We read through the social, cultural, and historical lenses we carry.
                        </p>
                        <div className="flex flex-col justify-between items-start pt-2">
                            <p className="text-[14px] sm:text-[15px] text-neutral-400 leading-[1.8] max-w-[320px] mb-12">
                                From these situated places we engage knowledge, culture, and society—and make space for other ways of seeing and knowing.
                            </p>

                            <Link href="/about" className="inline-flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white hover:text-[var(--color-brand-red)] transition-all group">
                                <span>Read Manifesto</span>
                                <span className="block w-4 h-[1px] bg-current group-hover:w-8 transition-all duration-300"></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
