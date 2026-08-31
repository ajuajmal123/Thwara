import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ARTICLES } from "@/data/articles";

export function generateStaticParams() {
    return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = ARTICLES.find((a) => a.slug === slug);
    if (!article) return { title: 'Not Found' };
    return { title: `${article.title} - THWARA`, description: article.excerpt };
}

export default async function EssayDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = ARTICLES.find((a) => a.slug === slug);

    if (!article) {
        notFound();
    }

    const currentIndex = ARTICLES.findIndex(a => a.slug === slug);
    const prevArticle = currentIndex > 0 ? ARTICLES[currentIndex - 1] : null;
    const nextArticle = currentIndex < ARTICLES.length - 1 ? ARTICLES[currentIndex + 1] : null;

    // Hardcode some rich dummy content based on the excerpt so it looks like a real article
    const isMalayalam = article.language === "മലയാളം";

    return (
        <main className="flex-1 flex flex-col w-full bg-[var(--color-background)]">

            {/* Meta Header */}
            <section className="border-b-[0.5px] border-[var(--color-brand-border)] p-6 px-8 sm:px-12 flex justify-between items-center text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)]">
                <div>
                    <Link href="/essays" className="hover:text-[var(--color-brand-black)] transition-colors">ESSAYS</Link>
                    <span className="mx-3">/</span>
                    <span className="text-[var(--color-brand-black)]">{article.category}</span>
                </div>
                <div>{article.date}</div>
            </section>

            {/* Article Hero */}
            <section className="flex flex-col border-b-[0.5px] border-[var(--color-brand-border)]">
                <div className="p-8 sm:p-12 lg:p-24 max-w-5xl self-center text-center">
                    <h1 className={`font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-[var(--color-foreground)] tracking-tight mb-8 ${isMalayalam ? 'leading-normal' : ''}`}>
                        {article.title}
                    </h1>
                    <p className={`text-lg md:text-2xl font-serif italic text-neutral-500 max-w-2xl mx-auto mb-12 ${isMalayalam ? 'tracking-normal' : ''}`}>
                        {article.excerpt}
                    </p>
                    <div className="flex items-center justify-center gap-6 text-[11px] uppercase tracking-widest font-semibold text-[var(--color-brand-black)]">
                        <div>BY <span className="text-[var(--color-brand-red)] hover:underline"><Link href={`/contributors`}>{article.author}</Link></span></div>
                        <div className="w-[1px] h-3 bg-[var(--color-brand-border)]" />
                        <div>{article.readingTime}</div>
                    </div>
                </div>

                <div className="relative w-full aspect-[21/9] bg-neutral-100 mix-blend-multiply border-t-[0.5px] border-[var(--color-brand-border)]">
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover opacity-80"
                    />
                </div>
            </section>

            {/* Reading Container */}
            <section className="w-full flex justify-center p-8 sm:p-12 lg:p-24 selection:bg-[var(--color-brand-red)] selection:text-white">
                <article className={`w-full max-w-2xl text-[16px] md:text-[18px] leading-[1.8] md:leading-[2] text-neutral-800 flex flex-col gap-8 ${isMalayalam ? 'text-[18px] md:text-[20px] leading-[2.2]' : ''}`}>

                    <p>
                        {isMalayalam
                            ? "ഒരു നഗരത്തിന്റെ വാസ്തുവിദ്യ എന്നത് അതിന്റെ ശില്പചാരുത മാത്രമല്ല, അതിൽ ജീവിക്കുന്ന മനുഷ്യരുടെ രാഷ്ട്രീയവും സംസ്കാരവും കൂടിയാണ്. ഇരുപതാം നൂറ്റാണ്ടിന്റെ അവസാനത്തോടെ നമ്മുടെ നഗരങ്ങളിൽ ഉണ്ടായ മാറ്റങ്ങൾ ഈ വൈരുദ്ധ്യങ്ങളെ രേഖപ്പെടുത്തുന്നു."
                            : "The architecture of any given urban environment is never merely structural; it is deeply ideological. When we examine the shifting foundations of the late 20th-century metropolis, what we are truly observing is the physical manifestation of capital rewriting public boundaries."}
                    </p>

                    <p>
                        {isMalayalam
                            ? "പഴയകാല സ്മാരകങ്ങൾ ഓർമ്മപ്പെടുത്തുന്നത് ചരിത്രത്തിലെ ചില പ്രത്യേക അദ്ധ്യായങ്ങൾ മാത്രമാണ്. ബാക്കിയുള്ളവ ബോധപൂർവ്വം വിസ്മരിക്കപ്പെടുന്നു."
                            : "Historical monuments serve as deliberate anchor points of collective memory. They dictate not only what a society chooses to remember, but more importantly, what it systematically agrees to forget. Memory, in this sense, becomes a curated exhibition."}
                    </p>

                    {/* Pull Quote */}
                    <aside className="my-12 flex">
                        <span className="text-[60px] font-serif text-[var(--color-brand-red)] leading-[0.5] mr-4 block mt-4">“</span>
                        <h3 className={`font-serif text-2xl md:text-[2rem] leading-tight text-[var(--color-brand-black)] ${isMalayalam ? '' : 'tracking-tight'}`}>
                            {isMalayalam
                                ? "കാലം മാറുമ്പോൾ ഓർമ്മകളും മായ്ച്ചുകളയപ്പെടുന്നു, അത് ബോധപൂർവമായ ഒരു പ്രക്രിയയാണ്."
                                : "The archive is not a passive repository; it is an active instrument of exclusion."}
                        </h3>
                    </aside>

                    <h2 className="text-xl md:text-2xl font-serif text-[var(--color-brand-black)] mt-8 uppercase tracking-wide">
                        {isMalayalam ? "ഇടങ്ങളുടെ രാഷ്ട്രീയം" : "The Geography of Belonging"}
                    </h2>

                    <p>
                        {isMalayalam
                            ? "പൊതു ഇടങ്ങൾ എല്ലാവർക്കും ഒരുപോലെയല്ല അനുഭവപ്പെടുന്നത്. അധികാരമുള്ളവർക്ക് അത് സ്വാതന്ത്രത്തിന്റെ ഇടമാണെങ്കിൽ, പാർശ്വവൽക്കരിക്കപ്പെട്ടവർക്ക് അത് പ്രതിരോധത്തിന്റെ സ്ഥലമാണ്."
                            : "Public spaces are experienced disparately. For the privileged, the plaza is a domain of leisure; for the marginalized, it is a contested zone of survival and political resistance. This bifurcation is designed into the concrete itself."}
                    </p>

                    {/* Structural Insert */}
                    <div className="w-full flex flex-col items-center my-8">
                        <div className="relative w-full aspect-video bg-neutral-200 border-[0.5px] border-[var(--color-brand-border)]">
                            <Image src="/mock-2.svg" alt="Diagram" fill className="object-cover mix-blend-multiply opacity-50" />
                        </div>
                        <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-500 mt-4 text-center">
                            Fig 1. Cultural sedimentation via architectural decay (2026).
                        </span>
                    </div>

                    <p>
                        {isMalayalam
                            ? "നഗരങ്ങളിലെ പുതിയ നിർമ്മാണങ്ങൾ പലപ്പോഴും പഴയ ഓർമ്മകളെ മായ്ച്ചു കളയുന്നു. നമ്മൾ ജീവിക്കുന്ന ഇടങ്ങൾ നമ്മെ എങ്ങനെ രൂപപ്പെടുത്തുന്നു എന്നത് ഒരു നിരന്തരമായ പ്രശ്നമാണ്."
                            : "Ultimately, when we ask who gets to remember the city, we are asking who is allowed to exist in its future. The spaces we inhabit silently mold our cognitive maps, directing our paths long after the architects have left."}
                    </p>

                </article>
            </section>

            {/* Next / Prev Navigation */}
            <section className="flex flex-col md:flex-row w-full border-t-[0.5px] border-[var(--color-brand-border)] bg-neutral-50/20">
                <div className="w-full md:w-1/2 p-8 sm:p-12 border-b-[0.5px] md:border-b-0 md:border-r-[0.5px] border-[var(--color-brand-border)] h-full flex flex-col items-start justify-center group hover:bg-neutral-100 transition-colors">
                    {prevArticle && (
                        <Link href={`/essays/${prevArticle.slug}`} className="w-full">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] block mb-4">← Previous</span>
                            <h4 className="font-serif text-xl sm:text-2xl text-[var(--color-foreground)] group-hover:text-[var(--color-brand-red)] transition-colors">{prevArticle.title}</h4>
                        </Link>
                    )}
                </div>
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col items-end justify-center group hover:bg-neutral-100 transition-colors">
                    {nextArticle && (
                        <Link href={`/essays/${nextArticle.slug}`} className="w-fulltext-right flex flex-col items-end w-full">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] block mb-4">Next →</span>
                            <h4 className="font-serif text-xl sm:text-2xl text-[var(--color-foreground)] text-right group-hover:text-[var(--color-brand-red)] transition-colors">{nextArticle.title}</h4>
                        </Link>
                    )}
                </div>
            </section>
        </main>
    );
}
