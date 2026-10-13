import Link from "next/link";
import { getAuthors } from "@/services/strapiServices";
import { getStrapiMedia } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export default async function AuthorsPage() {
    let authors: any[] = [];
    let fetchError = false;

    try {
        const response = await getAuthors();
        if (response && response.data && Array.isArray(response.data)) {
            authors = response.data.map((item: any) => {
                const attrs = item.attributes || item;
                const name = attrs.name || attrs.authorName || "Contributing Author";
                const description = attrs.description || attrs.bio || "";

                // Resolve photo URL (handles Strapi v5 and v4 formats)
                let photoUrl: string | null = null;
                if (attrs.photo?.url) {
                    photoUrl = getStrapiMedia(attrs.photo.url);
                } else if (attrs.photo?.data?.attributes?.url) {
                    photoUrl = getStrapiMedia(attrs.photo.data.attributes.url);
                } else if (typeof attrs.photo === "string") {
                    photoUrl = attrs.photo.startsWith("http") || attrs.photo.startsWith("/")
                        ? attrs.photo
                        : getStrapiMedia(attrs.photo);
                }

                // Related works count
                const worksCount = (attrs.articles?.length || 0) +
                    (attrs.folklores?.length || 0) +
                    (attrs.fictions?.length || 0);

                return {
                    id: item.id || item.documentId || name,
                    name,
                    description,
                    photoUrl: photoUrl || `https://picsum.photos/seed/${encodeURIComponent(name)}/300/300`,
                    worksCount,
                };
            });
        }
    } catch (err) {
        console.error("[AuthorsPage] Error fetching authors:", err);
        fetchError = true;
    }

    // Fallback if no authors in database yet
    const displayAuthors = authors.length > 0 ? authors : [
        {
            id: "fallback-1",
            name: "Athira Bhanu",
            description: "Writer and consultant psychologist exploring the emotional landscapes of human experience and sociocultural realities.",
            photoUrl: "/athirabhanu.jpeg",
            worksCount: 0,
        },
        {
            id: "fallback-2",
            name: "Nandana Maya Sachidanandan",
            description: "Postgraduate in English Literature, exploring intersections of literature, culture, and society.",
            photoUrl: "/nandana.jpeg",
            worksCount: 0,
        },
        {
            id: "fallback-3",
            name: "Muhammed Munavver",
            description: "Librarian curious about folklore, oral studies, cinema, and human knowledge systems.",
            photoUrl: "/munavver.jpeg",
            worksCount: 0,
        }
    ];

    return (
        <main className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col bg-white">
            <section className="border-4 border-[var(--color-brand-border)] rounded-lg p-6 sm:p-10 bg-white flex flex-col gap-8 text-center items-center">

                <div>
                    <h1 className="text-4xl md:text-6xl font-bold text-black uppercase">
                        Authors <span className="text-[var(--color-brand-red)]">&</span> Voices
                    </h1>
                    <p className="max-w-xl mx-auto text-black font-medium border-b-2 border-[var(--color-brand-border)] pb-6 mt-4">
                        Discover the writers, researchers, and thinkers shaping the critical discourse at THWARA.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 w-full">
                    {displayAuthors.map((author) => (
                        <div
                            key={author.id}
                            className="flex flex-col items-center p-6 border-2 border-[var(--color-brand-border)] rounded-lg bg-white group hover:shadow-lg transition-all hover:-translate-y-1 relative"
                        >
                            <div className="absolute top-3 right-3 text-[var(--color-brand-red)] text-xl font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                                ★
                            </div>

                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[var(--color-brand-border)] mb-4 shadow-sm">
                                <img
                                    src={author.photoUrl}
                                    alt={author.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                            </div>

                            <h2 className="text-xl font-bold text-black uppercase group-hover:text-[var(--color-brand-red)] transition-colors line-clamp-1 mb-2">
                                {author.name}
                            </h2>

                            <p className="text-neutral-700 text-sm line-clamp-3 text-center leading-relaxed flex-grow">
                                {author.description || "Contributing author and thinker at THWARA platform."}
                            </p>

                            {author.worksCount > 0 && (
                                <span className="mt-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-[var(--color-brand-border)]">
                                    {author.worksCount} Published {author.worksCount === 1 ? "Work" : "Works"}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t-2 border-dotted border-[var(--color-brand-border)] w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-neutral-500">
                        Want to contribute your writing, research, or storytelling to THWARA?
                    </p>
                    <Link
                        href="/submissions"
                        className="px-5 py-2.5 rounded bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-brand-red)] transition-colors"
                    >
                        Submit Your Work →
                    </Link>
                </div>

            </section>
        </main>
    );
}