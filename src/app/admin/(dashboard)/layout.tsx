import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { logoutAdminAction } from "../actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const navItems = [
    { label: "Overview", href: "/admin", icon: "📊" },
    { label: "Articles & Essays", href: "/admin/articles", icon: "📝" },
    { label: "Submissions Inbox", href: "/admin/submissions", icon: "📥" },
    { label: "Fiction & Folklore", href: "/admin/fiction", icon: "📖" },
    { label: "Webzine Issues", href: "/admin/webzine", icon: "🗞️" },
    { label: "Authors Directory", href: "/admin/authors", icon: "👥" },
    { label: "Media Library", href: "/admin/media", icon: "🖼️" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row text-neutral-900 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r-4 border-[var(--color-brand-border)] flex flex-col shrink-0">
        {/* Brand bar */}
        <div className="p-5 border-b-2 border-neutral-200 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/image.png"
              alt="Thwara"
              width={40}
              height={30}
              className="w-10 h-auto object-contain"
            />
            <div>
              <span className="font-bold text-base text-black tracking-tight block">THWARA</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-red)] block -mt-1">
                Admin Panel
              </span>
            </div>
          </Link>
          <a
            href="/"
            target="_blank"
            title="View live website in new tab"
            className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded font-medium border border-neutral-300"
          >
            Live ↗
          </a>
        </div>

        {/* Navigation links */}
        <nav className="p-3 flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar md:overflow-visible">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-bold text-neutral-700 hover:bg-neutral-100 hover:text-[var(--color-brand-red)] transition-colors whitespace-nowrap"
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom account / logout */}
        <div className="mt-auto p-4 border-t-2 border-neutral-200 hidden md:flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-neutral-600">Admin Mode Active</span>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full text-left py-2 px-3 text-xs font-bold text-neutral-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>🔒</span>
              <span>Lock / Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b-2 border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-brand-green)]">
              Editorial Studio
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-neutral-600 hover:text-black border border-neutral-300 px-3 py-1.5 rounded-md hover:bg-neutral-50"
            >
              Public Site ↗
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
