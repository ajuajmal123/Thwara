"use client";

import { useState, useEffect } from "react";
import { getAdminWebzines, saveWebzineAction, deleteWebzineAction } from "../../actions";

export default function AdminWebzinePage() {
  const [webzines, setWebzines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchWebzines = async () => {
    setLoading(true);
    try {
      const data = await getAdminWebzines();
      setWebzines(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebzines();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem({
      title: "",
      webzine_name: "",
      issue_number: "01",
      slug: "",
      domain: "Visual Essay",
      date: "Oct 2026",
      cover_image: "",
      excerpt: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this issue?")) return;
    try {
      await deleteWebzineAction(id);
      fetchWebzines();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await saveWebzineAction({
        id: editingItem?.id || undefined,
        title: formData.get("title"),
        webzine_name: formData.get("webzine_name"),
        issue_number: formData.get("issue_number"),
        slug: formData.get("slug"),
        domain: formData.get("domain"),
        date: formData.get("date"),
        cover_image: formData.get("cover_image"),
        excerpt: formData.get("excerpt"),
        description: formData.get("description"),
      });
      setIsModalOpen(false);
      setEditingItem(null);
      fetchWebzines();
    } catch (err: any) {
      alert("Error saving issue: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Webzine Issues</h1>
          <p className="text-xs text-neutral-500">Curate and publish themed editorial webzine editions</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          + Curate New Issue
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-black">
                {editingItem.id ? `Edit Issue #${editingItem.id}` : "Curate New Webzine Issue"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Issue Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingItem.title}
                    placeholder="e.g. Monsoon Notes"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Issue Number</label>
                  <input
                    type="text"
                    name="issue_number"
                    defaultValue={editingItem.issue_number}
                    placeholder="e.g. 01"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Webzine Name / Tagline</label>
                  <input
                    type="text"
                    name="webzine_name"
                    defaultValue={editingItem.webzine_name}
                    placeholder="e.g. Issue 01: Monsoon Notes"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Theme / Format</label>
                  <input
                    type="text"
                    name="domain"
                    defaultValue={editingItem.domain}
                    placeholder="e.g. Visual Essay"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Date</label>
                  <input
                    type="text"
                    name="date"
                    defaultValue={editingItem.date}
                    placeholder="e.g. Oct 2026"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Cover Image URL</label>
                <input
                  type="text"
                  name="cover_image"
                  defaultValue={editingItem.cover_image}
                  placeholder="https://... or /mock-1.svg"
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Excerpt / Synopsis</label>
                <textarea
                  name="excerpt"
                  rows={2}
                  defaultValue={editingItem.excerpt}
                  placeholder="Short introductory summary of this edition..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Curator Notes / Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingItem.description}
                  placeholder="Detailed description and editorial context..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-serif"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white rounded font-bold"
                >
                  {submitting ? "Saving..." : "Save Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs font-bold text-neutral-400">Loading issues...</div>
        ) : webzines.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-neutral-400">No webzine issues found.</div>
        ) : (
          webzines.map((issue) => (
            <div
              key={issue.id}
              className="bg-white border-2 border-[var(--color-brand-border)] rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              {issue.cover_image && (
                <img src={issue.cover_image} alt="" className="w-full h-44 object-cover border-b" />
              )}
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-brand-red)]">
                    Issue {issue.issue_number || "01"}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400">{issue.date}</span>
                </div>
                <h2 className="text-base font-bold text-black">{issue.title}</h2>
                <p className="text-xs text-neutral-500 line-clamp-2">{issue.excerpt || issue.description}</p>
              </div>

              <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] bg-white border px-2 py-0.5 rounded font-bold text-neutral-700">
                  {issue.domain || "Visual Essay"}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleOpenEdit(issue)}
                    className="text-xs px-2.5 py-1 bg-white border border-neutral-300 rounded font-bold text-black hover:bg-neutral-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="text-xs px-2.5 py-1 bg-red-50 border border-red-200 rounded font-bold text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
