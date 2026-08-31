import ArticleCard from "@/components/ui/ArticleCard";
import { ARTICLES } from "@/data/articles";
import Link from "next/link";

export default function Featured() {
    const featuredArticles = ARTICLES.filter(article => article.featured);

    const primaryArticle = featuredArticles[0] || ARTICLES[0];
    const secondaryArticles = featuredArticles.slice(1, 3).length > 0 ? featuredArticles.slice(1, 3) : ARTICLES.slice(1, 3);

    return (
        <section className="border-b-[0.5px] border-[var(--color-brand-border)] relative">
            <div className="flex border-b-[0.5px] border-[var(--color-brand-border)] items-center justify-between px-4 sm:px-8 py-3 bg-[var(--color-background)]">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                    Featured
                </h2>
                <Link href="/essays" className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] transition-colors">
                    View Archive
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row w-full">
                {/* Left Side: Primary Big Featured */}
                <div className="w-full lg:w-[65%] lg:border-r-[0.5px] border-b-[0.5px] lg:border-b-0 border-[var(--color-brand-border)] p-4 sm:p-8 lg:p-12">
                    <ArticleCard article={primaryArticle} variant="featured" className="h-full" hideBorder />
                </div>

                {/* Right Side: Minor Featured */}
                <div className="w-full lg:w-[35%] flex flex-col bg-neutral-50/30">
                    {secondaryArticles.map((article, idx) => (
                        <div key={article.id} className={`flex-1 ${idx === 0 ? 'border-b-[0.5px] border-[var(--color-brand-border)]' : ''}`}>
                            <ArticleCard article={article} variant="default" className="border-none" hideBorder />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
