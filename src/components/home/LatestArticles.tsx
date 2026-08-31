import Link from "next/link";
import { ARTICLES } from "@/data/articles";
import ArticleCard from "@/components/ui/ArticleCard";

export default function LatestArticles() {
    const recentArticles = ARTICLES.slice(0, 4);

    return (
        <section className="border-b-[0.5px] border-[var(--color-brand-border)]">

            <div className="flex border-b-[0.5px] border-[var(--color-brand-border)] px-4 sm:px-8 py-3">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-black)]">
                    Latest Index
                </h2>
            </div>

            <div className="flex flex-col w-full">
                {recentArticles.map((article, index) => (
                    <div key={article.id} className="relative flex w-full">
                        {/* Number grid column */}
                        <div className="w-16 sm:w-24 border-r-[0.5px] border-b-[0.5px] border-[var(--color-brand-border)] flex items-center justify-center bg-neutral-50/30 text-[10px] font-sans font-medium text-[var(--color-brand-gray)] opacity-60">
                            {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* Minimal card column */}
                        <div className="flex-1 w-full bg-[var(--color-background)] border-b-[0.5px] border-[var(--color-brand-border)] -mb-[0.5px]">
                            <ArticleCard article={article} variant="minimal" hideBorder />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center p-8 bg-neutral-50/30">
                <Link href="/archive" className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-brand-gray)] hover:text-[var(--color-brand-black)] transition-colors group">
                    <span>Explore All</span>
                    <span className="block w-4 h-[1px] bg-current group-hover:w-8 transition-all duration-300"></span>
                </Link>
            </div>
        </section>
    );
}
