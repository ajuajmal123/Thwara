import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col md:flex-row px-4 sm:px-8 border-b-[0.5px] border-[var(--color-brand-border)] overflow-hidden">

            {/* Left Column: Image */}
            <div className="flex flex-col justify-center w-full md:w-[65%] lg:w-[70%] pt-24 pb-16 md:pr-12 md:border-r-[0.5px] border-[var(--color-brand-border)]">
                <div className="relative w-full aspect-[4/3] md:h-[70vh] overflow-hidden rounded-sm animate-[fadeIn_1s_ease-out]">
                    <Image
                        src="/WhatsApp Image 2026-08-31 at 7.58.15 PM.jpeg"
                        alt="Thwara Editorial"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 70vw"
                    />
                </div>
            </div>

            {/* Right Column: Rigid Supporting Structure */}
            <div className="flex flex-col w-full md:w-[35%] lg:w-[30%]">

                {/* Top block */}
                <div className="flex-1 flex flex-col justify-end p-6 md:p-12 pb-12 border-b-[0.5px] border-[var(--color-brand-border)] border-t-[0.5px] md:border-t-0 mt-8 md:mt-0 animate-[fadeIn_2s_ease-out_800ms_both]">
                    <p className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[var(--color-brand-gray)] mb-6">
                        Manifesto
                    </p>
                    <p className="text-base md:text-lg leading-[1.6] tracking-tight text-[var(--color-foreground)] text-balance">
                        An independent bilingual digital media collective exploring knowledge, culture, and society through critical thought and creative expression.
                    </p>
                </div>

                {/* Bottom block (Optional stylistic counterweight) */}
                <div className="hidden md:flex h-1/3 flex-col justify-end p-6 md:p-12 animate-[fadeIn_2s_ease-out_1s_both]">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-brand-red)] mb-4" />
                    <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-[var(--color-brand-gray)]">
                        Est. 2026
                    </p>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
        </section>
    );
}
