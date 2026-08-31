import Image from "next/image";
import Link from "next/link";
import { Article } from "@/data/articles";

interface ArticleCardProps {
    article: Article;
    variant?: "default" | "featured" | "minimal";
    className?: string;
    hideBorder?: boolean;
}

export default function ArticleCard({ article, variant = "default", className = "", hideBorder = false }: ArticleCardProps) {
    // Optically scale down Malayalam slightly to match English x-heights
    const isMalayalam = article.language === "മലയാളം";
    const titleClass = isMalayalam
        ? "font-sans leading-relaxed text-[0.9em]"
        : "font-serif leading-[1.1] tracking-tight";

    if (variant === "minimal") {
        return (
            <Link href={`/article/${article.slug}`} className={`group flex flex-col md:flex-row p-6 md:p-8 outline-none hover:bg-neutral-50 transition-colors ${hideBorder ? '' : 'border-b-[0.5px] border-[var(--color-brand-border)]'} ${className}`}>
                {/* Number / Metadata Column */}
                <div className="w-full md:w-[15%] md:border-r-[0.5px] border-[var(--color-brand-border)] flex flex-col justify-start mb-4 md:mb-0 md:pr-4">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-gray)] group-hover:text-[var(--color-brand-black)] transition-colors">
                        {article.category}
                    </div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-brand-gray)] opacity-60 mt-2">
                        {article.language}
                    </div>
                </div>

                {/* Title Content */}
                <div className="w-full md:w-[60%] flex flex-col justify-center mb-4 md:mb-0 md:px-8">
                    <h3 className={`text-xl md:text-2xl font-medium text-[var(--color-foreground)] transition-colors ${titleClass}`}>
                        {article.title}
                    </h3>
                </div>

                {/* Author / Arrow */}
                <div className="w-full md:w-[25%] flex items-center justify-between md:justify-end md:pl-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-medium tracking-wide uppercase text-[var(--color-brand-gray)] mr-4">
                        {article.author}
                    </span>
                    <span className="text-[10px] transform transition-transform group-hover:translate-x-1 hidden sm:block text-[var(--color-brand-red)]">
                        →
                    </span>
                </div>
            </Link>
        );
    }

    if (variant === "featured") {
        return (
            <article className={`group flex flex-col h-full ${className}`}>
                {/* Rigid Grid Border Approach */}
                <div className="flex border-b-[0.5px] border-[var(--color-brand-border)] pb-2 mb-6">
                    <div className="w-1/2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-black)]">
                        {article.category}
                    </div>
                    <div className="w-1/2 text-right text-[9px] uppercase tracking-[0.2em] text-[var(--color-brand-gray)]">
                        {article.language}
                    </div>
                </div>

                <Link href={`/article/${article.slug}`} className="block relative w-full aspect-[4/3] sm:aspect-[3/2] overflow-hidden mb-8 bg-neutral-100">
                    <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.02]"
                        sizes="(max-width: 768px) 100vw, 60vw"
                        priority
                    />
                </Link>

                <Link href={`/article/${article.slug}`} className="outline-none block mb-6 px-2">
                    <h2 className={`text-4xl md:text-5xl lg:text-[4rem] font-medium text-[var(--color-foreground)] ${titleClass}`}>
                        {article.title}
                    </h2>
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
                    <div className="md:col-span-3">
                        <p className="text-sm md:text-base leading-relaxed text-[var(--color-brand-gray)] line-clamp-4">
                            {article.excerpt}
                        </p>
                    </div>
                    <div className="md:col-span-1 border-t-[0.5px] md:border-t-0 md:border-l-[0.5px] border-[var(--color-brand-border)] pt-4 md:pt-0 md:pl-4 flex flex-col justify-start">
                        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-[var(--color-foreground)] mb-2 block">{article.author}</span>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand-gray)] mb-2 block">{article.date}</span>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-brand-gray)] block">{article.readingTime}</span>
                    </div>
                </div>
            </article>
        );
    }

    // Default block variant
    return (
        <article className={`group flex flex-col h-full ${hideBorder ? '' : 'border-[0.5px] border-[var(--color-brand-border)]'} ${className}`}>

            {/* Top Metadata row in a grid cell */}
            <div className="flex justify-between items-center p-4 border-b-[0.5px] border-[var(--color-brand-border)]">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand-black)]">{article.category}</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--color-brand-gray)]">{article.language}</span>
            </div>

            <Link href={`/article/${article.slug}`} className="outline-none flex-1 p-6 lg:p-8 hover:bg-neutral-50 transition-colors">
                <h3 className={`text-2xl md:text-3xl font-medium text-[var(--color-foreground)] ${titleClass}`}>
                    {article.title}
                </h3>
                <p className="hidden md:block text-sm leading-relaxed text-[var(--color-brand-gray)] mt-6 line-clamp-2">
                    {article.excerpt}
                </p>
            </Link>

            <div className="p-4 border-t-[0.5px] border-[var(--color-brand-border)] flex items-center justify-between text-[10px] font-semibold tracking-wide uppercase text-[var(--color-brand-gray)]">
                <span className="text-[var(--color-foreground)]">{article.author}</span>
                <span>{article.readingTime}</span>
            </div>
        </article>
    );
}
