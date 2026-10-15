"use client";

import { useState, useEffect } from "react";
import {
  getAdminFictions,
  saveFictionAction,
  deleteFictionAction,
  getAdminFolklores,
  saveFolkloreAction,
  deleteFolkloreAction,
} from "../../actions";

export default function AdminFictionPage() {
  const [activeTab, setActiveTab] = useState<"fiction" | "folklore">("fiction");
  const [fictions, setFictions] = useState<any[]>([]);
  const [folklores, setFolklores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const FICTION_GENRES = ["Story", "Poem", "Cartoon"];
  const FOLKLORE_CATEGORIES = [
    "Oral Histories",
    "Folk Practices",
    "Folk Literature",
    "Myths",
    "Legends",
    "Field notes",
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const [ficData, folData] = await Promise.all([getAdminFictions(), getAdminFolklores()]);
      setFictions(ficData);
      setFolklores(folData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    if (activeTab === "fiction") {
      setModalItem({
        title: "",
        slug: "",
        author_name: "Thwara",
        genre: "Story",
        date: new Date().toISOString().split("T")[0],
        cover_image: "",
        subheading: "",
        notes: "",
        content: "",
      });
    } else {
      setModalItem({
        title: "",
        slug: "",
        narrator_name: "Thwara Archive",
        category: "Oral Histories",
        date: new Date().toISOString().split("T")[0],
        cover_image: "",
        spotify_url: "",
        subheading: "",
        reference: "",
        content: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this piece?")) return;
    try {
      if (activeTab === "fiction") {
        await deleteFictionAction(id);
      } else {
        await deleteFolkloreAction(id);
      }
      loadData();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      if (activeTab === "fiction") {
        await saveFictionAction({
          id: modalItem?.id || undefined,
          title: formData.get("title"),
          slug: formData.get("slug"),
          author_name: formData.get("author_name"),
          genre: formData.get("genre"),
          date: formData.get("date"),
          cover_image: formData.get("cover_image"),
          subheading: formData.get("subheading"),
          notes: formData.get("notes"),
          content: formData.get("content"),
        });
      } else {
        await saveFolkloreAction({
          id: modalItem?.id || undefined,
          title: formData.get("title"),
          slug: formData.get("slug"),
          narrator_name: formData.get("narrator_name"),
          category: formData.get("category"),
          date: formData.get("date"),
          cover_image: formData.get("cover_image"),
          spotify_url: formData.get("spotify_url"),
          subheading: formData.get("subheading"),
          reference: formData.get("reference"),
          content: formData.get("content"),
        });
      }
      setIsModalOpen(false);
      setModalItem(null);
      loadData();
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Fiction & Folklore</h1>
          <p className="text-xs text-neutral-500">Manage short stories, poetry, myths, and oral narratives</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          + Add New {activeTab === "fiction" ? "Fiction Piece" : "Folklore Recording"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b-2 border-neutral-200">
        <button
          onClick={() => setActiveTab("fiction")}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "fiction"
              ? "border-[var(--color-brand-green)] text-[var(--color-brand-green)]"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Fiction & Poetry ({fictions.length})
        </button>

        <button
          onClick={() => setActiveTab("folklore")}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "folklore"
              ? "border-[var(--color-brand-green)] text-[var(--color-brand-green)]"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Folklore & Oral Histories ({folklores.length})
        </button>
      </div>

      {/* Modal / Form */}
      {isModalOpen && modalItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-2xl w-full p-6 sm:p-8 my-8 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <h2 className="text-lg font-bold text-black">
                {modalItem.id ? "Edit Item" : `Add New ${activeTab === "fiction" ? "Fiction" : "Folklore"}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={modalItem.title}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={modalItem.slug}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">
                    {activeTab === "fiction" ? "Author Name" : "Narrator / Source"}
                  </label>
                  <input
                    type="text"
                    name={activeTab === "fiction" ? "author_name" : "narrator_name"}
                    required
                    defaultValue={activeTab === "fiction" ? modalItem.author_name : modalItem.narrator_name}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Category / Genre</label>
                  <select
                    name={activeTab === "fiction" ? "genre" : "category"}
                    defaultValue={activeTab === "fiction" ? modalItem.genre : modalItem.category}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white"
                  >
                    {(activeTab === "fiction" ? FICTION_GENRES : FOLKLORE_CATEGORIES).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={modalItem.date?.slice(0, 10)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Cover Image URL</label>
                <input
                  type="text"
                  name="cover_image"
                  defaultValue={modalItem.cover_image}
                  placeholder="https://... or /mock-1.svg"
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              {activeTab === "folklore" && (
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Spotify Embed / Audio Link (Optional)</label>
                  <input
                    type="text"
                    name="spotify_url"
                    defaultValue={modalItem.spotify_url}
                    placeholder="https://open.spotify.com/embed/..."
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Excerpt / Notes</label>
                <textarea
                  name={activeTab === "fiction" ? "notes" : "reference"}
                  rows={2}
                  defaultValue={activeTab === "fiction" ? modalItem.notes : modalItem.reference}
                  placeholder="Short note or glossaries..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Content Body</label>
                <textarea
                  name="content"
                  rows={6}
                  defaultValue={modalItem.content}
                  placeholder="Full text..."
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
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border-2 border-[var(--color-brand-border)] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading...</div>
        ) : (activeTab === "fiction" ? fictions : folklores).length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-neutral-400">No items found in this section.</div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 uppercase font-bold">
                <th className="p-3.5">Cover</th>
                <th className="p-3.5">Title</th>
                <th className="p-3.5">{activeTab === "fiction" ? "Author" : "Narrator"}</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 font-medium">
              {(activeTab === "fiction" ? fictions : folklores).map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/70">
                  <td className="p-3">
                    {item.cover_image ? (
                      <img src={item.cover_image} alt="" className="w-10 h-10 object-cover rounded border" />
                    ) : (
                      <div className="w-10 h-10 bg-neutral-100 rounded border flex items-center justify-center text-[10px]">
                        None
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-bold text-black max-w-xs truncate">{item.title}</td>
                  <td className="p-3 text-neutral-700">{item.author_name || item.narrator_name}</td>
                  <td className="p-3">
                    <span className="bg-neutral-100 border px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.genre || item.category}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-500">{item.date}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-black font-bold rounded border cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded border cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
