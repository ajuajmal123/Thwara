"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminTellings,
  saveTellingAction,
  deleteTellingAction,
} from "../../actions";
import DirectMediaUpload from "@/components/admin/DirectMediaUpload";

const CATEGORIES = ["Stories", "Podcast", "Interview"] as const;

export default function AdminTellingsPage() {
  const [tellings, setTellings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Stories");
  const [coverImage, setCoverImage] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAdminTellings();
      setTellings(data);
    } catch (err) {
      console.error("[Tellings Fetch Error]:", err);
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
    setCategory("Stories");
    setCoverImage("");
    setSpotifyUrl("");
    setAudioUrl("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setCategory(item.category || "Stories");
    setCoverImage(item.cover_image || "");
    setSpotifyUrl(item.spotify_url || "");
    setAudioUrl(item.audio_url || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this audio telling?")) return;
    try {
      await deleteTellingAction(id);
      setMessage("Audio piece deleted successfully.");
      loadData();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a title for this piece.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      await saveTellingAction({
        id: editingItem?.id || undefined,
        title: title.trim(),
        category,
        cover_image: coverImage.trim() || null,
        spotify_url: spotifyUrl.trim() || null,
        audio_url: audioUrl.trim() || null,
      });

      setMessage(
        editingItem?.id
          ? "Audio piece updated successfully!"
          : "New audio piece added successfully!"
      );
      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err: any) {
      alert("Error saving telling: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredItems = tellings.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = (item.title || "").toLowerCase().includes(q);
    const matchesCat = (item.category || "").toLowerCase().includes(q);
    return matchesTitle || matchesCat;
  });

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "Podcast":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Interview":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Stories":
      default:
        return "bg-sky-100 text-sky-800 border-sky-300";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
            <span>🎧</span>
            <span>Tellings & Audio Series</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Manage audio stories, podcasts, and creator interviews with Spotify embeds & direct audio
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          + Add New Telling
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-300 text-emerald-800 text-xs font-bold rounded-lg flex items-center justify-between">
          <span>✓ {message}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-3">
        <div className="flex gap-2 overflow-x-auto">
          {["All", ...CATEGORIES].map((cat) => {
            const count =
              cat === "All"
                ? tellings.length
                : tellings.filter((t) => t.category === cat).length;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[var(--color-brand-green)] text-white shadow-xs"
                    : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audio titles..."
            className="px-3 py-1.5 border-2 border-neutral-200 rounded-lg text-xs outline-none focus:border-[var(--color-brand-green)] bg-white w-full sm:w-56"
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
      </div>

      {/* Modal / Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-2xl w-full p-5 sm:p-7 my-auto max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>🎧</span>
                  <span>{editingItem?.id ? `Edit Telling #${editingItem.id}` : "Add New Audio Telling"}</span>
                </h2>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Connect audio episodes via Spotify embeds or direct audio streaming links.
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-bold">
              {/* Title & Category */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Voices of the River — Episode 01"
                  className="w-full px-3.5 py-2.5 border-2 border-neutral-300 rounded-lg font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-700 uppercase mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded-lg font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Cover Image (Direct Upload & Picker) */}
              <DirectMediaUpload
                label="Cover Image"
                value={coverImage}
                onChange={setCoverImage}
                type="image"
                helpText="Directly upload cover photo, select from library, or paste image URL."
              />

              {/* Spotify Embed URL */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-700 uppercase">Spotify Embed / Episode Link</label>
                  <span className="text-[10px] text-neutral-400 font-normal">e.g. open.spotify.com/embed/episode/...</span>
                </div>
                <input
                  type="text"
                  value={spotifyUrl}
                  onChange={(e) => setSpotifyUrl(e.target.value)}
                  placeholder="https://open.spotify.com/embed/episode/7makk4oTQel546B0PZlDM5"
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded-lg font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-mono"
                />
                {spotifyUrl && spotifyUrl.includes("spotify.com") && (
                  <div className="mt-2 p-2 bg-neutral-50 rounded border border-neutral-200">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">
                      Live Spotify Preview:
                    </span>
                    <iframe
                      style={{ borderRadius: "8px" }}
                      src={spotifyUrl}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>

              {/* Direct Audio URL (Direct Upload & Picker) */}
              <DirectMediaUpload
                label="Direct Audio File (MP3 / WAV / OGG)"
                value={audioUrl}
                onChange={setAudioUrl}
                type="audio"
                accept="audio/*"
                helpText="Directly upload an audio recording from your device, or paste a link."
              />

              {/* Actions */}
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
                  {submitting ? "Saving..." : editingItem?.id ? "Update Telling" : "Publish Telling"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border-2 border-[var(--color-brand-border)] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading audio tellings...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold text-neutral-400 flex flex-col items-center gap-2">
            <span className="text-3xl">🎧</span>
            <span>
              {searchQuery
                ? "No tellings matching your search."
                : `No tellings found in ${activeCategory}.`}
            </span>
            <button
              onClick={handleOpenCreate}
              className="mt-2 text-[var(--color-brand-red)] hover:underline font-bold text-xs cursor-pointer"
            >
              + Create the first {activeCategory === "All" ? "telling" : activeCategory}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="sm:hidden px-3 py-1.5 bg-neutral-50 text-[11px] text-neutral-500 border-b border-neutral-200 flex items-center gap-1.5 font-medium">
              <span>⟷</span>
              <span>Swipe horizontally to view all columns</span>
            </div>
            <table className="w-full min-w-[650px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 uppercase font-bold">
                  <th className="p-3.5">Cover</th>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Audio Source</th>
                  <th className="p-3.5">Date Added</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50/70">
                    <td className="p-3">
                      {item.cover_image ? (
                        <img
                          src={item.cover_image}
                          alt=""
                          className="w-11 h-11 object-cover rounded border"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-neutral-100 rounded border flex items-center justify-center text-lg text-neutral-400">
                          🎧
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-bold text-black max-w-xs">
                      <div className="truncate text-sm">{item.title}</div>
                      {item.spotify_url && (
                        <div className="text-[10px] font-mono text-emerald-700 truncate mt-0.5">
                          ✓ Spotify Linked
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`border px-2 py-0.5 rounded text-[10px] font-bold ${getCategoryBadgeClass(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-600">
                      <div className="flex items-center gap-1.5">
                        {item.spotify_url ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            Spotify
                          </span>
                        ) : null}
                        {item.audio_url ? (
                          <span className="bg-blue-50 text-blue-700 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            Direct MP3
                          </span>
                        ) : null}
                        {!item.spotify_url && !item.audio_url && (
                          <span className="text-neutral-400 text-[10px]">No stream link</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-neutral-500 whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                    </td>
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
