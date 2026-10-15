"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminFictions,
  saveFictionAction,
  deleteFictionAction,
  getAdminFolklores,
  saveFolkloreAction,
  deleteFolkloreAction,
  getAdminAuthors,
} from "../../actions";
import { generateSlug } from "@/lib/slug";
import RichBodyEditor from "@/components/admin/RichBodyEditor";
import AdditionalImagesInput from "@/components/admin/AdditionalImagesInput";

export default function AdminFictionPage() {
  const [activeTab, setActiveTab] = useState<"fiction" | "folklore">("fiction");
  const [fictions, setFictions] = useState<any[]>([]);
  const [folklores, setFolklores] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [authorOrNarrator, setAuthorOrNarrator] = useState("");
  const [genreOrCategory, setGenreOrCategory] = useState("Story");
  const [date, setDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [notesOrReference, setNotesOrReference] = useState("");
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [content, setContent] = useState("");

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
      const [ficData, folData, authData] = await Promise.all([
        getAdminFictions(),
        getAdminFolklores(),
        getAdminAuthors(),
      ]);
      setFictions(ficData);
      setFolklores(folData);
      setAuthors(authData);
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
    setEditingItem(null);
    setTitle("");
    setAuthorOrNarrator(authors[0]?.name || "");
    setGenreOrCategory(activeTab === "fiction" ? "Story" : "Oral Histories");
    setDate(new Date().toISOString().split("T")[0]);
    setCoverImage("");
    setSpotifyUrl("");
    setNotesOrReference("");
    setAdditionalImages([]);
    setContent("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || "");
    const authorVal = activeTab === "fiction" ? item.author_name : item.narrator_name;
    setAuthorOrNarrator(authorVal || authors[0]?.name || "");
    setGenreOrCategory(
      (activeTab === "fiction" ? item.genre : item.category) ||
        (activeTab === "fiction" ? "Story" : "Oral Histories")
    );
    setDate(item.date ? item.date.slice(0, 10) : new Date().toISOString().split("T")[0]);
    setCoverImage(item.cover_image || "");
    setSpotifyUrl(item.spotify_url || "");
    setNotesOrReference(
      (activeTab === "fiction" ? item.notes : item.reference) || ""
    );
    setAdditionalImages(
      Array.isArray(item.additional_images) ? item.additional_images : []
    );
    setContent(item.content || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab === "fiction" ? "fiction piece" : "folklore entry"}?`)) {
      return;
    }
    try {
      if (activeTab === "fiction") {
        await deleteFictionAction(id);
      } else {
        await deleteFolkloreAction(id);
      }
      setMessage("Item deleted successfully.");
      loadData();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!authorOrNarrator.trim()) {
      alert(`Please select an ${activeTab === "fiction" ? "author" : "narrator / author"} from the directory.`);
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      if (activeTab === "fiction") {
        await saveFictionAction({
          id: editingItem?.id || undefined,
          title: title.trim(),
          author_name: authorOrNarrator,
          genre: genreOrCategory,
          date,
          cover_image: coverImage.trim() || null,
          additional_images: additionalImages,
          notes: notesOrReference.trim() || null,
          content,
        });
        setMessage(editingItem?.id ? "Fiction piece updated successfully!" : "Fiction piece published successfully!");
      } else {
        await saveFolkloreAction({
          id: editingItem?.id || undefined,
          title: title.trim(),
          narrator_name: authorOrNarrator,
          category: genreOrCategory,
          date,
          cover_image: coverImage.trim() || null,
          spotify_url: spotifyUrl.trim() || null,
          additional_images: additionalImages,
          reference: notesOrReference.trim() || null,
          content,
        });
        setMessage(editingItem?.id ? "Folklore entry updated successfully!" : "Folklore entry published successfully!");
      }

      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      alert("Error saving: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const generatedSlug = generateSlug(title);
  const selectedAuthorObj = authors.find((a) => a.name === authorOrNarrator);

  const currentList = (activeTab === "fiction" ? fictions : folklores).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleMatch = (item.title || "").toLowerCase().includes(q);
    const authorMatch = ((item.author_name || item.narrator_name) || "").toLowerCase().includes(q);
    const catMatch = ((item.genre || item.category) || "").toLowerCase().includes(q);
    return titleMatch || authorMatch || catMatch;
  });

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
          + Add New {activeTab === "fiction" ? "Fiction Piece" : "Folklore Entry"}
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center justify-between">
          <span>✓ {message}</span>
          <button onClick={() => setMessage(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 border-b-2 border-neutral-200">
        <button
          onClick={() => {
            setActiveTab("fiction");
            setSearchQuery("");
          }}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "fiction"
              ? "border-[var(--color-brand-green)] text-[var(--color-brand-green)]"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Fiction ({fictions.length})
        </button>

        <button
          onClick={() => {
            setActiveTab("folklore");
            setSearchQuery("");
          }}
          className={`pb-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
            activeTab === "folklore"
              ? "border-[var(--color-brand-green)] text-[var(--color-brand-green)]"
              : "border-transparent text-neutral-500 hover:text-black"
          }`}
        >
          Folklore ({folklores.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab === "fiction" ? "stories, poems, authors..." : "myths, oral histories, narrators..."}`}
          className="w-full max-w-sm px-3.5 py-2 border-2 border-neutral-200 rounded-lg text-xs outline-none focus:border-[var(--color-brand-green)] bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-neutral-400 hover:text-black font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-4xl w-full p-5 sm:p-8 my-auto max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-black">
                  {editingItem?.id
                    ? `Edit ${activeTab === "fiction" ? "Fiction" : "Folklore"} #${editingItem.id}`
                    : `Publish New ${activeTab === "fiction" ? "Fiction Piece" : "Folklore Entry"}`}
                </h2>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Slug will automatically match the title. Author is selected from the registered directory.
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-xs font-bold">
              {/* 1. Title & Automatic Slug Preview */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">
                  {activeTab === "fiction" ? "Title *" : "Title / Folklore Topic *"}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={activeTab === "fiction" ? "e.g. Midnight City" : "e.g. The Legend of the Coast"}
                  className="w-full px-3.5 py-2.5 border-2 border-neutral-300 rounded-lg font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
                <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded border border-neutral-200">
                  <span className="font-sans font-bold text-neutral-700">Auto Slug:</span>
                  <span className="text-[var(--color-brand-red)] truncate">
                    /{activeTab}/{generatedSlug}
                  </span>
                </div>
              </div>

              {/* 2. Author / Narrator Selection from Authors directory & Genre & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-700 uppercase">
                      {activeTab === "fiction" ? "Author *" : "Narrator / Author *"}
                    </label>
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
                    <select
                      required
                      value={authorOrNarrator}
                      onChange={(e) => setAuthorOrNarrator(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white cursor-pointer"
                    >
                      <option value="">-- Choose from Authors Directory --</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
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
                        <span className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px]">
                          👤
                        </span>
                      )}
                      <span className="font-bold truncate">{selectedAuthorObj.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">
                    {activeTab === "fiction" ? "Genre *" : "Category *"}
                  </label>
                  <select
                    value={genreOrCategory}
                    onChange={(e) => setGenreOrCategory(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white cursor-pointer"
                  >
                    {(activeTab === "fiction" ? FICTION_GENRES : FOLKLORE_CATEGORIES).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              {/* 3. Cover Image URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-700 uppercase">Cover Image URL</label>
                  <Link
                    href="/admin/media"
                    target="_blank"
                    className="text-[10px] text-[var(--color-brand-red)] hover:underline font-bold"
                  >
                    Open Media Library ↗
                  </Link>
                </div>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://... or uploaded image URL"
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-mono"
                />
                {coverImage && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-neutral-50 rounded border border-neutral-200">
                    <img src={coverImage} alt="Cover preview" className="w-12 h-12 object-cover rounded border" />
                    <span className="text-[11px] text-neutral-600 font-mono truncate">{coverImage}</span>
                  </div>
                )}
              </div>

              {/* Spotify Embed (Folklore only) */}
              {activeTab === "folklore" && (
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">
                    Spotify Embed / Audio Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={spotifyUrl}
                    onChange={(e) => setSpotifyUrl(e.target.value)}
                    placeholder="https://open.spotify.com/embed/episode/..."
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-mono"
                  />
                </div>
              )}

              {/* 4. Additional Images Field */}
              <AdditionalImagesInput
                images={additionalImages}
                onChange={setAdditionalImages}
              />

              {/* 5. Full Body Content Editor with H2, H3, Paragraphs & Live Preview */}
              <RichBodyEditor
                value={content}
                onChange={setContent}
                label={activeTab === "fiction" ? "Full Fiction Text (Headings, Paragraphs, Verses)" : "Full Folklore Narrative / Oral Transcript"}
              />

              {/* Optional Archival Notes / Footnotes (No Subheading) */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">
                  {activeTab === "fiction" ? "Notes / Footnotes (Optional)" : "Archival Reference / Field Notes (Optional)"}
                </label>
                <textarea
                  rows={2}
                  value={notesOrReference}
                  onChange={(e) => setNotesOrReference(e.target.value)}
                  placeholder={
                    activeTab === "fiction"
                      ? "Glossary, references, or footnotes..."
                      : "Archival reference, collector notes, or audio transcript source..."
                  }
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border-2 border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-100 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white rounded-lg font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingItem?.id ? "Update Item" : "Publish Item"}
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
        ) : currentList.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-neutral-400">
            {searchQuery ? "No items matching your search." : `No items found in ${activeTab === "fiction" ? "fiction" : "folklore"}.`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="sm:hidden px-3 py-1.5 bg-neutral-50 text-[11px] text-neutral-500 border-b border-neutral-200 flex items-center gap-1.5 font-medium">
              <span>⟷</span>
              <span>Swipe horizontally to view all columns</span>
            </div>
            <table className="w-full min-w-[700px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 uppercase font-bold">
                  <th className="p-3.5">Cover</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">{activeTab === "fiction" ? "Author" : "Narrator"}</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Additional Imgs</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {currentList.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70">
                    <td className="p-3">
                      {item.cover_image ? (
                        <img src={item.cover_image} alt="" className="w-10 h-10 object-cover rounded border" />
                      ) : (
                        <div className="w-10 h-10 bg-neutral-100 rounded border flex items-center justify-center text-[10px] text-neutral-400">
                          None
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-bold text-black max-w-xs">
                      <div className="truncate">{item.title}</div>
                      <div className="text-[10px] font-mono text-neutral-400 truncate">/{item.slug}</div>
                    </td>
                    <td className="p-3 text-neutral-700">
                      <span className="font-semibold">{item.author_name || item.narrator_name}</span>
                    </td>
                    <td className="p-3">
                      <span className="bg-neutral-100 border px-2 py-0.5 rounded text-[10px] font-bold">
                        {item.genre || item.category}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-600">
                      {Array.isArray(item.additional_images) && item.additional_images.length > 0 ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.additional_images.length} imgs
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="p-3 text-neutral-500 whitespace-nowrap">{item.date}</td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
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
          </div>
        )}
      </div>
    </div>
  );
}
