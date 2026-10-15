"use client";

import { useState, useEffect } from "react";
import { getAdminArticles, saveArticleAction, deleteArticleAction } from "../../actions";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const DOMAINS = [
    "Literature",
    "Library",
    "Psychology",
    "History",
    "Politics",
    "Culture",
    "Fashion",
    "Photo story",
    "Travelogue",
    "Memoir",
  ];

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getAdminArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingArticle({
      title: "",
      slug: "",
      author_name: "Thwara Editorial",
      domain: "Literature",
      date: new Date().toISOString().split("T")[0],
      subheading: "",
      cover_image: "",
      content: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (art: any) => {
    setEditingArticle(art);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      await deleteArticleAction(id);
      setMessage("Article deleted successfully.");
      fetchArticles();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      id: editingArticle?.id || undefined,
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      author_name: formData.get("author_name") as string,
      domain: formData.get("domain") as string,
      date: formData.get("date") as string,
      subheading: formData.get("subheading") as string,
      cover_image: formData.get("cover_image") as string,
      content: formData.get("content") as string,
    };

    try {
      await saveArticleAction(payload);
      setMessage(editingArticle?.id ? "Article updated successfully!" : "Article published successfully!");
      setIsFormOpen(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (err: any) {
      alert("Error saving article: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Articles & Essays</h1>
          <p className="text-xs text-neutral-500">Manage, edit, or publish written editorial pieces</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          + Write New Article
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center justify-between">
          <span>✓ {message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Editor Modal / Form */}
      {isFormOpen && editingArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-3xl w-full p-6 sm:p-8 my-8 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-black">
                {editingArticle.id ? `Edit Article #${editingArticle.id}` : "Publish New Article"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-xs font-bold">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Article Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingArticle.title}
                    placeholder="e.g. Who Gets to Remember a City?"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">URL Slug (Optional)</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingArticle.slug}
                    placeholder="e.g. who-gets-to-remember-a-city"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Author, Domain, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Author Name *</label>
                  <input
                    type="text"
                    name="author_name"
                    required
                    defaultValue={editingArticle.author_name}
                    placeholder="e.g. Ananya Menon"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Domain / Category</label>
                  <select
                    name="domain"
                    defaultValue={editingArticle.domain || "Literature"}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Publication Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingArticle.date?.slice(0, 10)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Cover Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cover_image"
                    defaultValue={editingArticle.cover_image}
                    placeholder="https://... or /mock-1.svg (upload image in Media Library)"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              {/* Subheading */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Subheading / Excerpt</label>
                <textarea
                  name="subheading"
                  rows={2}
                  defaultValue={editingArticle.subheading}
                  placeholder="Brief synopsis appearing on article cards..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Full Article Body</label>
                <textarea
                  name="content"
                  rows={8}
                  defaultValue={editingArticle.content}
                  placeholder="Type or paste the complete article text here..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-serif leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border-2 border-neutral-300 rounded text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white rounded font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingArticle.id ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-white border-2 border-[var(--color-brand-border)] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <span className="text-4xl">📄</span>
            <span className="text-sm font-bold text-neutral-700">No articles found in database.</span>
            <p className="text-xs text-neutral-400">Click "+ Write New Article" to add your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Cover</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-3">
                      {art.cover_image ? (
                        <img
                          src={art.cover_image}
                          alt=""
                          className="w-12 h-8 object-cover rounded border border-neutral-200 bg-neutral-100"
                        />
                      ) : (
                        <div className="w-12 h-8 bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-400">
                          None
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-bold text-neutral-900 max-w-xs truncate">
                      {art.title}
                      {art.slug && <span className="block text-[10px] text-neutral-400 font-mono font-normal">/{art.slug}</span>}
                    </td>
                    <td className="p-3 text-neutral-700">{art.author_name}</td>
                    <td className="p-3">
                      <span className="bg-neutral-100 border border-neutral-300 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {art.domain || "Article"}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500 whitespace-nowrap">{art.date}</td>
                    <td className="p-3 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleOpenEdit(art)}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-black font-bold rounded border border-neutral-300 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded border border-red-200 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
