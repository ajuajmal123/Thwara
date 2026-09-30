"use client";

export default function ContactPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-12 bg-white flex flex-col md:flex-row gap-12 items-center justify-between">

                <div className="w-full md:w-1/2 flex flex-col gap-6 text-left border-2 border-[var(--color-brand-border)] p-8 rounded relative">
                    <div className="absolute -top-4 -left-4 bg-white px-2">
                        <span className="text-[var(--color-brand-red)] text-4xl font-bold">✉</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-black underline decoration-[var(--color-brand-red)] underline-offset-8 mt-2 mb-4">Get In Touch</h1>

                    <p className="text-black font-medium leading-relaxed">
                        Have queries, suggestions, or want to collaborate? <br /> Send us a message and our team will get back to you!
                    </p>

                    <div className="flex flex-col gap-2 mt-4 text-black font-bold">
                        <span className="flex items-center gap-3">
                            <span className="text-[var(--color-brand-red)]">▸</span> thwaracollective@gmail.com
                        </span>
                        <span className="flex items-center gap-3">
                            <span className="text-[var(--color-brand-red)]">▸</span> Kerala, India.
                        </span>
                    </div>
                </div>

                <form onSubmit={e => e.preventDefault()} className="w-full md:w-1/2 flex flex-col gap-4 border-2 border-[var(--color-brand-border)] p-8 rounded">
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-bold text-xs uppercase">Full Name</label>
                        <input type="text" className="w-full border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black focus:outline-none focus:border-[var(--color-brand-red)]" placeholder="Jane Doe" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-bold text-xs uppercase">Email Address</label>
                        <input type="email" className="w-full border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black focus:outline-none focus:border-[var(--color-brand-red)]" placeholder="jane@example.com" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-bold text-xs uppercase">Message</label>
                        <textarea className="w-full border-2 border-[var(--color-brand-border)] rounded px-3 py-2 text-black h-32 focus:outline-none focus:border-[var(--color-brand-red)]" placeholder="I would like to discuss..."></textarea>
                    </div>
                    <div className="flex items-center gap-2 mt-1 mb-2">
                        <input type="checkbox" id="privacy-contact" className="w-4 h-4 accent-black border-[var(--color-brand-border)] rounded cursor-pointer" required />
                        <label htmlFor="privacy-contact" className="text-xs text-black font-medium">
                            I agree to the <a href="/privacy-policy.pdf" target="_blank" className="font-bold underline text-[var(--color-brand-red)]">Privacy Policy</a>
                        </label>
                    </div>
                    <button className="bg-black text-white font-bold py-3 mt-2 rounded flex items-center justify-center gap-2 hover:bg-[var(--color-brand-red)] transition-colors">
                        SEND MESSAGE <span className="text-xl text-[var(--color-brand-border)]">→</span>
                    </button>
                </form>

            </section>
        </main>
    );
}