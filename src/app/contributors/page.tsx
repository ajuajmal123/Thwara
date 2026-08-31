import Link from "next/link";
import Image from "next/image";
import { CONTRIBUTORS } from "@/data/contributors";

export default function ContributorsIndex() {
    return (
        <main className="flex flex-col w-full bg-[var(--color-background)]">

            {/* Header section */}
            <section className="bg-neutral-50 border-b-[0.5px] border-[var(--color-brand-border)] p-8 sm:p-12 lg:p-24 pt-16 lg:pt-24 flex flex-col md:flex-row justify-between w-full">
                <div className="max-w-2xl">
                    <h1 className="font-serif text-[clamp(2rem,12vw,10rem)] font-medium leading-[0.8] tracking-tighter text-[var(--color-brand-black)] uppercase whitespace-nowrap w-full">
                        <span className="text-[var(--color-brand-red)]">Con</span>tributors
                    </h1>
                    <p className="mt-8 text-[15px] text-[var(--color-brand-gray)] max-w-md leading-relaxed selection:bg-[var(--color-brand-red)] selection:text-white">
                        THWARA brings together writers, researchers, artists and thinkers working across disciplines and forms.
                    </p>
                </div>
            </section>

            {/* Grid of Contributors */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
                {CONTRIBUTORS.map((contributor, i) => (
                    <Link
                        href={`/contributors/${contributor.slug}`}
                        key={contributor.id}
                        className={`group relative flex flex-col aspect-[4/5] overflow-hidden border-b-[0.5px] border-[var(--color-brand-border)] 
              ${(i + 1) % 4 !== 0 ? 'lg:border-r-[0.5px]' : ''} 
              ${(i + 1) % 3 !== 0 ? 'md:border-r-[0.5px] lg:border-r-[0.5px]' : ''} 
              ${(i + 1) % 2 !== 0 ? 'sm:border-r-[0.5px]' : ''}
              hover:bg-neutral-50 transition-colors duration-500`}
                    >
                        {/* Image layer */}
                        <div className="absolute inset-0 w-full h-full p-8 md:p-12 mix-blend-multiply opacity-10 group-hover:opacity-30 transition-opacity duration-700">
                            <Image
                                src={contributor.imageUrl}
                                alt={contributor.name}
                                fill
                                className="object-contain p-8 object-center"
                            />
                        </div>

                        {/* Content overlay */}
                        <div className="relative z-10 p-8 md:p-10 flex flex-col h-full justify-between items-start">
                            <div className="flex justify-between w-full">
                                <span className="text-[10px] font-bold text-[var(--color-brand-red)] mr-2 group-hover:-translate-y-2 transition-transform duration-300">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[10px] uppercase font-semibold tracking-widest text-[var(--color-brand-red)]">
                                    View Profile
                                </div>
                            </div>

                            <div className="mt-auto">
                                <h3 className="font-serif text-2xl md:text-3xl text-[var(--color-foreground)] leading-none group-hover:italic transition-all duration-300 group-hover:text-[var(--color-brand-red)]">
                                    {contributor.name}
                                </h3>
                                <p className="text-[11px] uppercase tracking-widest font-semibold text-[var(--color-brand-gray)] mt-3">
                                    {contributor.role}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </main>
    );
}
