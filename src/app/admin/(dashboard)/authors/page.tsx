"use client";

import { useState, useEffect } from "react";
import { getAdminAuthors, saveAuthorAction, deleteAuthorAction } from "../../actions";
import DirectMediaUpload from "@/components/admin/DirectMediaUpload";

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuthors();
      setAuthors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleOpenCreate = () => {
    setEditingAuthor({
      name: "",
      photo: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (author: any) => {
    setEditingAuthor(author);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await deleteAuthorAction(id);
      fetchAuthors();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);

    try {
      await saveAuthorAction({
        id: editingAuthor?.id || undefined,
        name: formData.get("name"),
        photo: formData.get("photo"),
        description: formData.get("description"),
      });
      setIsModalOpen(false);
      setEditingAuthor(null);
      fetchAuthors();
    } catch (err: any) {
      alert("Error saving author: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Authors & Contributors</h1>
          <p className="text-xs text-neutral-500">Manage writer profiles, biographic details, and portrait photos</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          + Add Author
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && editingAuthor && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-lg w-full p-5 sm:p-6 my-auto max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-black">
                {editingAuthor.id ? "Edit Author Profile" : "Add New Author"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Author Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingAuthor.name}
                  placeholder="e.g. Athira Bhanu"
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              <DirectMediaUpload
                label="Author Photo / Portrait"
                name="photo"
                value={editingAuthor.photo || ""}
                onChange={(url) => setEditingAuthor({ ...editingAuthor, photo: url })}
                type="image"
                helpText="Upload author portrait directly from device, select from media library, or paste image URL."
              />

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Biography / Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingAuthor.description}
                  placeholder="Writer, essayist and researcher exploring..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
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
                  {submitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs font-bold text-neutral-400">Loading authors...</div>
        ) : authors.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-neutral-400">No authors found.</div>
        ) : (
          authors.map((author) => (
            <div
              key={author.id}
              className="bg-white border-2 border-[var(--color-brand-border)] rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <img
                  src={author.photo || `https://picsum.photos/seed/${encodeURIComponent(author.name)}/100/100`}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover border-2 border-[var(--color-brand-border)] shrink-0"
                />
                <div className="flex flex-col gap-1">
                  <h2 className="text-base font-bold text-black">{author.name}</h2>
                  <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">{author.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(author)}
                  className="text-xs px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-black font-bold rounded border cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(author.id)}
                  className="text-xs px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded border cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
