import Link from "next/link";
import { getAdminOverviewStats } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    {
      title: "Articles & Essays",
      count: stats?.articlesCount ?? 0,
      description: "Published critical commentaries, essays & memoirs",
      href: "/admin/articles",
      color: "border-[var(--color-brand-border)]",
      badgeColor: "bg-[var(--color-brand-green)]",
      icon: "📝",
    },
    {
      title: "Submissions Inbox",
      count: stats?.totalSubmissions ?? 0,
      badgeText: stats?.pendingSubmissions ? `${stats.pendingSubmissions} Pending` : "All Reviewed",
      description: "Incoming pitches, articles and uploaded documents",
      href: "/admin/submissions",
      color: stats?.pendingSubmissions ? "border-[var(--color-brand-red)]" : "border-neutral-300",
      badgeColor: stats?.pendingSubmissions ? "bg-[var(--color-brand-red)]" : "bg-neutral-600",
      icon: "📥",
    },
    {
      title: "Fiction & Folklore",
      count: (stats?.fictionsCount ?? 0) + (stats?.folkloresCount ?? 0),
      description: "Short stories, poems, oral histories and myths",
      href: "/admin/fiction",
      color: "border-[var(--color-brand-border)]",
      badgeColor: "bg-[var(--color-brand-green)]",
      icon: "📖",
    },
    {
      title: "Tellings & Audio",
      count: stats?.tellingsCount ?? 0,
      description: "Audio stories, podcasts, and creator interviews",
      href: "/admin/tellings",
      color: "border-[var(--color-brand-border)]",
      badgeColor: "bg-[var(--color-brand-green)]",
      icon: "🎧",
    },
    {
      title: "Webzine Issues",
      count: stats?.webzinesCount ?? 0,
      description: "Curated digital issues and multimedia exhibits",
      href: "/admin/webzine",
      color: "border-[var(--color-brand-border)]",
      badgeColor: "bg-[var(--color-brand-green)]",
      icon: "🗞️",
    },
    {
      title: "Authors & Contributors",
      count: stats?.authorsCount ?? 0,
      description: "Writers, translators, narrators & biographers",
      href: "/admin/authors",
      color: "border-[var(--color-brand-border)]",
      badgeColor: "bg-[var(--color-brand-green)]",
      icon: "👥",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-red)]">
            Platform Management
          </span>
          <h1 className="text-3xl font-bold text-black tracking-tight">Editorial Control Room</h1>
          <p className="text-sm text-neutral-600 max-w-xl">
            Welcome to the Thwara content management studio. Create, edit, and publish stories, or review incoming submissions from writers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/articles"
            className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-colors shadow-sm"
          >
            + New Article
          </Link>
          <Link
            href="/admin/media"
            className="px-4 py-2.5 bg-white border-2 border-[var(--color-brand-border)] text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Upload Media
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`bg-white border-2 ${card.color} rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-all group`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl p-2 bg-neutral-50 rounded-lg border border-neutral-200">{card.icon}</span>
              {card.badgeText && (
                <span className={`text-[11px] font-bold text-white px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                  {card.badgeText}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-black">{card.count}</span>
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-400">Total</span>
              </div>
              <h2 className="text-lg font-bold text-black group-hover:text-[var(--color-brand-red)] transition-colors">
                {card.title}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">{card.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-[var(--color-brand-green)] group-hover:translate-x-1 transition-transform">
              <span>Open Manager</span>
              <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Helpful Instructions for Client */}
      <div className="bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl p-6 flex flex-col gap-3">
        <h3 className="font-bold text-sm text-black flex items-center gap-2">
          <span>💡</span>
          <span>Quick Editorial Guidelines</span>
        </h3>
        <ul className="text-xs text-neutral-600 flex flex-col gap-2">
          <li>• <strong>Publishing an Article:</strong> Use the Articles manager. Slugs are automatically created from titles, and images can be pasted via URL or uploaded through the Media Library.</li>
          <li>• <strong>Reviewing Pitches:</strong> When users submit articles on the public website, they appear in the Submissions Inbox where you can read their details and download attached documents.</li>
          <li>• <strong>Editing Existing Content:</strong> Click "Edit" next to any record, modify the text, and click "Save Changes". It will instantly update across the live website.</li>
        </ul>
      </div>
    </div>
  );
}
