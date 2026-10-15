"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminArticles, saveArticleAction, deleteArticleAction, getAdminAuthors } from "../../actions";
import { generateSlug } from "@/lib/slug";
import RichBodyEditor from "@/components/admin/RichBodyEditor";
import AdditionalImagesInput from "@/components/admin/AdditionalImagesInput";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [domain, setDomain] = useState("Literature");
  const [date, setDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [content, setContent] = useState("");

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [articlesData, authorsData] = await Promise.all([
        getAdminArticles(),
        getAdminAuthors(),
      ]);
      setArticles(articlesData);
      setAuthors(authorsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingArticle({ id: undefined });
    setTitle("");
    setAuthorName(authors[0]?.name || "");
    setDomain("Literature");
    setDate(new Date().toISOString().split("T")[0]);
    setCoverImage("");
    setAdditionalImages([]);
    setContent("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (art: any) => {
    setEditingArticle(art);
    setTitle(art.title || "");
    setAuthorName(art.author_name || (authors[0]?.name || ""));
    setDomain(art.domain || "Literature");
    setDate(art.date ? art.date.slice(0, 10) : new Date().toISOString().split("T")[0]);
    setCoverImage(art.cover_image || "");
    setAdditionalImages(Array.isArray(art.additional_images) ? art.additional_images : []);
    setContent(art.content || "");
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to permanently delete this article?")) return;
    try {
      await deleteArticleAction(id);
      setMessage("Article deleted successfully.");
      fetchData();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter an article title.");
      return;
    }
    if (!authorName) {
      alert("Please select an author.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    const payload = {
      id: editingArticle?.id || undefined,
      title: title.trim(),
      author_name: authorName,
      domain,
      date,
      cover_image: coverImage.trim() || null,
      additional_images: additionalImages,
      content,
    };

    try {
      await saveArticleAction(payload);
      setMessage(editingArticle?.id ? "Article updated successfully!" : "Article published successfully!");
      setIsFormOpen(false);
      setEditingArticle(null);
      fetchData();
    } catch (err: any) {
      alert("Error saving article: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const generatedSlug = generateSlug(title);
  const selectedAuthorObj = authors.find((a) => a.name === authorName);

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
          <button onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">✕</button>
        </div>
      )}

      {/* Editor Modal / Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-4xl w-full p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-black">
                  {editingArticle?.id ? `Edit Article #${editingArticle.id}` : "Publish New Article"}
                </h2>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Slug will automatically match the title. Select author from the registered authors directory.
                </span>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-xs font-bold">
              {/* 1. Article Title & Automatic Slug Preview */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Who Gets to Remember a City?"
                  className="w-full px-3.5 py-2.5 border-2 border-neutral-300 rounded-lg font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
                <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded border border-neutral-200">
                  <span className="font-sans font-bold text-neutral-700">Auto Slug:</span>
                  <span className="text-[var(--color-brand-red)] truncate">/articles/{generatedSlug}</span>
                </div>
              </div>

              {/* 2. Author Selection from Authors Data & Domain & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-700 uppercase">Author *</label>
                    <Link
                      href="/admin/authors"
                      target="_blank"
                      className="text-[10px] text-[var(--color-brand-red)] hover:underline font-bold"
                    >
                      + Manage Authors
                    </Link>
                  </div>

                  {authors.length === 0 ? (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-amber-900 text-xs">
                      No authors found.{" "}
                      <Link href="/admin/authors" target="_blank" className="font-bold underline">
                        Add an Author first ↗
                      </Link>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white cursor-pointer"
                      >
                        <option value="">-- Choose Author from Directory --</option>
                        {authors.map((a) => (
                          <option key={a.id} value={a.name}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedAuthorObj && (
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-600 bg-neutral-50 p-1.5 rounded border border-neutral-200">
                      {selectedAuthorObj.photo ? (
                        <img
                          src={selectedAuthorObj.photo}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover border"
                        />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px]">👤</span>
                      )}
                      <span className="font-bold truncate">{selectedAuthorObj.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Domain / Category</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
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
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              {/* 3. Cover Image */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-700 uppercase">Cover Image URL</label>
                  <Link
                    href="/admin/media"
                    target="_blank"
                    className="text-[11px] text-[var(--color-brand-red)] hover:underline font-bold"
                  >
                    Upload in Media Library ↗
                  </Link>
                </div>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... or uploaded image link from Media Library"
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              {/* 4. Additional Images Field */}
              <AdditionalImagesInput
                images={additionalImages}
                onChange={setAdditionalImages}
                label="Additional Images / Gallery"
              />

              {/* 5. Full Article Body (with Headings, Subheadings & Live Preview) */}
              <RichBodyEditor
                value={content}
                onChange={setContent}
                label="Full Article Body (Includes Headings, Subheadings & Text)"
                placeholder="Write your article here. Use the buttons above to insert ## H2 Headings, ### H3 Subheadings, blockquotes, images, or body paragraphs..."
              />

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
                  className="px-6 py-2.5 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white rounded font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingArticle?.id ? "Save Changes" : "Publish Article"}
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
            <div className="sm:hidden px-3 py-1.5 bg-neutral-50 text-[11px] text-neutral-500 border-b border-neutral-200 flex items-center gap-1.5 font-medium">
              <span>⟷</span>
              <span>Swipe horizontally to view all columns</span>
            </div>
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Cover</th>
                  <th className="p-3.5">Title & Slug</th>
                  <th className="p-3.5">Author</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Images</th>
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
                      <span className="block text-[10px] text-neutral-400 font-mono font-normal">
                        /articles/{art.slug}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-700">{art.author_name}</td>
                    <td className="p-3">
                      <span className="bg-neutral-100 border border-neutral-300 text-neutral-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {art.domain || "Article"}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-500">
                      {Array.isArray(art.additional_images) && art.additional_images.length > 0 ? (
                        <span className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          +{art.additional_images.length} images
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400">Cover only</span>
                      )}
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
