import { notFound } from "next/navigation";
import Link from "next/link";
import { TEAM_MEMBERS } from "@/data/team";

export function generateStaticParams() {
    return TEAM_MEMBERS.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const member = TEAM_MEMBERS.find((m) => m.slug === slug);
    if (!member) return { title: "Member Not Found — THWARA" };

    return {
        title: `${member.name} — Core Team | THWARA`,
        description: member.shortBio,
    };
}

export default async function TeamMemberProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const member = TEAM_MEMBERS.find((m) => m.slug === slug);

    if (!member) {
        notFound();
    }

    return (
        <main className="w-full max-w-[1200px] mx-auto px-4 py-8 sm:py-12 flex flex-col bg-white">
            {/* Top Navigation */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-[var(--color-brand-red)] transition-colors"
                >
                    <span className="text-base">←</span> Back to About Us
                </Link>

                <div className="hidden sm:flex text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                    <span>About</span>
                    <span className="mx-2">/</span>
                    <span>Team</span>
                    <span className="mx-2">/</span>
                    <span className="text-black font-bold">{member.name}</span>
                </div>
            </div>

            {/* Profile Card Container */}
            <section className="border-4 border-[var(--color-brand-border)] rounded-xl p-6 sm:p-12 bg-white flex flex-col md:flex-row gap-10 lg:gap-14 shadow-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 text-[var(--color-brand-red)] text-3xl font-bold opacity-30 select-none">
                    ★
                </div>

                {/* Left: Avatar Column */}
                <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[var(--color-brand-border)] shadow-md mb-6">
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight mb-2">
                        {member.name}
                    </h1>

                    {member.location && (
                        <span className="text-xs text-neutral-500 font-medium mt-1 flex items-center gap-1">
                            📍 {member.location}
                        </span>
                    )}

                    {member.education && (
                        <div className="mt-4 p-3 bg-neutral-50 border border-[var(--color-brand-border)] rounded-lg text-xs text-neutral-700 w-full text-center">
                            <span className="font-bold text-black block mb-0.5 uppercase tracking-wide text-[10px]">Education</span>
                            {member.education}
                        </div>
                    )}
                </div>

                {/* Right: Detailed Biography Column */}
                <div className="w-full md:w-2/3 flex flex-col justify-start">
                    <div className="border-b-2 border-[var(--color-brand-border)] pb-4 mb-6">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-green)]">
                            Biography & Profile
                        </h2>
                    </div>

                    {/* Full Narrative Biography */}
                    <div className="prose prose-neutral max-w-none">
                        <p className="text-base sm:text-lg text-black font-normal leading-relaxed text-justify whitespace-pre-line">
                            {member.fullBio}
                        </p>
                    </div>

                    {/* Research & Focus Areas */}
                    {member.interests && member.interests.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-[var(--color-brand-border)]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-3">
                                Areas of Interest & Research
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {member.interests.map((interest, idx) => (
                                    <span
                                        key={idx}
                                        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--color-brand-border)] bg-neutral-50 text-neutral-800"
                                    >
                                        #{interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-10 pt-6 border-t-2 border-dotted border-[var(--color-brand-border)] flex flex-wrap items-center justify-between gap-4">
                        <Link
                            href="/submissions"
                            className="text-xs font-bold uppercase tracking-wider text-black hover:text-[var(--color-brand-red)] transition-colors flex items-center gap-1"
                        >
                            Collaborate with THWARA <span>→</span>
                        </Link>

                        <Link
                            href="/about"
                            className="px-5 py-2 rounded bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-[var(--color-brand-red)] transition-colors"
                        >
                            View All Team Members
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
