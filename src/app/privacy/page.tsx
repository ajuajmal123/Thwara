export default function PrivacyPage() {
    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-12 bg-white flex flex-col gap-6 text-left">
                
                <h1 className="text-3xl md:text-5xl font-bold text-black border-b-2 border-black pb-4 mb-4">
                    <span className="text-[var(--color-brand-red)] mr-2">■</span> Privacy & Policy
                </h1>

                <div className="flex flex-col gap-6 text-black font-medium leading-relaxed max-w-4xl">
                    <p>
                        At THWARA, we respect and prioritize your privacy. This policy outlines exactly how we handle, process, and collect your data while protecting your freedom as a reader and digital citizen.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-4">1. Data Collection</h2>
                    <p>
                        We limit data collection exclusively to analytics required for delivering our content properly. We might collect email numbers and WhatsApp formats securely exclusively whenever you volunteer this information via our Newsletter form.
                    </p>
                    
                    <h2 className="text-2xl font-bold mt-4">2. Cookies</h2>
                    <p>
                        Our application framework uses standardized authentication and preference cookies to save your settings like UI layout caching. Third party widgets might use tracking pixels; you have full autonomy to opt-out utilizing browser settings.
                    </p>

                    <h2 className="text-2xl font-bold mt-4">3. Data Integrity & Usage</h2>
                    <p>
                        We <span className="text-[var(--color-brand-red)] font-bold">never</span> sell your data to third party marketing organizations. You are not a product.
                    </p>
                </div>

            </section>
        </main>
    );
}