export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col md:flex-row px-4 sm:px-8 border-b-[0.5px] border-[var(--color-brand-border)] overflow-hidden">

            {/* Left Column: Massive Editorial Typography */}
            <div className="flex flex-col justify-center w-full md:w-[65%] lg:w-[70%] pt-24 pb-16 md:pr-12 md:border-r-[0.5px] border-[var(--color-brand-border)]">
                <h1 className="font-serif text-[14vw] sm:text-[12vw] lg:text-[10rem] font-medium leading-[0.85] tracking-tighter text-[var(--color-brand-black)] uppercase break-words w-full overflow-hidden">
                    <span className="block translate-y-0 animate-[fadeSlideUp_1s_ease-out]">Think.</span>
                    <span className="block text-[var(--color-brand-red)] translate-y-0 animate-[fadeSlideUp_1s_ease-out_100ms_both]">Write.</span>
                    <span className="block translate-y-0 animate-[fadeSlideUp_1s_ease-out_200ms_both]">Reimagine.</span>
                </h1>
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
