"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminWebzines,
  saveWebzineAction,
  deleteWebzineAction,
  getAdminArticles,
  getAdminFictions,
  getAdminFolklores,
  getAdminTellings,
} from "../../actions";
import { generateSlug } from "@/lib/slug";
import DirectMediaUpload from "@/components/admin/DirectMediaUpload";

const DOMAINS = [
  "Visual Essay",
  "Digital Storytelling",
  "Experimental Archive",
  "Interactive Essay",
  "Image + Text",
  "Collaborative Fiction",
];

export default function AdminWebzinePage() {
  const [webzines, setWebzines] = useState<any[]>([]);
  const [allArticles, setAllArticles] = useState<any[]>([]);
  const [allFictions, setAllFictions] = useState<any[]>([]);
  const [allFolklores, setAllFolklores] = useState<any[]>([]);
  const [allTellings, setAllTellings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [issueNumber, setIssueNumber] = useState("01");
  const [domain, setDomain] = useState("Visual Essay");
  const [date, setDate] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [description, setDescription] = useState("");

  // Curation states (IDs of selected works)
  const [selectedArticles, setSelectedArticles] = useState<(string | number)[]>([]);
  const [selectedFictions, setSelectedFictions] = useState<(string | number)[]>([]);
  const [selectedFolklores, setSelectedFolklores] = useState<(string | number)[]>([]);
  const [selectedTellings, setSelectedTellings] = useState<(string | number)[]>([]);
  const [curationTab, setCurationTab] = useState<"articles" | "fictions" | "folklores" | "tellings">("articles");
  const [curationSearch, setCurationSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [wData, artData, ficData, folData, telData] = await Promise.all([
        getAdminWebzines(),
        getAdminArticles(),
        getAdminFictions(),
        getAdminFolklores(),
        getAdminTellings(),
      ]);
      setWebzines(wData);
      setAllArticles(artData);
      setAllFictions(ficData);
      setAllFolklores(folData);
      setAllTellings(telData);
    } catch (err) {
      console.error("[Webzine Data Load Error]:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setTitle("");
    const nextNum = String(webzines.length + 1).padStart(2, "0");
    setIssueNumber(nextNum);
    setDomain("Visual Essay");
    setDate(new Date().toLocaleString("en-US", { month: "short", year: "numeric" }));
    setCoverImage("");
    setExcerpt("");
    setDescription("");
    setSelectedArticles([]);
    setSelectedFictions([]);
    setSelectedFolklores([]);
    setSelectedTellings([]);
    setCurationTab("articles");
    setCurationSearch("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setIssueNumber(item.issue_number || "01");
    setDomain(item.domain || "Visual Essay");
    setDate(item.date || "");
    setCoverImage(item.cover_image || "");
    setExcerpt(item.excerpt || "");
    setDescription(item.description || "");

    // Extract selected IDs (handles either array of IDs or array of objects)
    const extractIds = (list: any) => {
      if (!Array.isArray(list)) return [];
      return list.map((x: any) => (typeof x === "object" && x !== null ? x.id : x));
    };

    setSelectedArticles(extractIds(item.articles));
    setSelectedFictions(extractIds(item.fictions));
    setSelectedFolklores(extractIds(item.folklores));
    setSelectedTellings(extractIds(item.tellings));
    setCurationTab("articles");
    setCurationSearch("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this webzine issue?")) return;
    try {
      await deleteWebzineAction(id);
      setMessage("Issue deleted successfully.");
      fetchData();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  // Helper toggle for selection
  const toggleItemSelection = (
    id: string | number,
    selectedList: (string | number)[],
    setSelectedList: (list: (string | number)[]) => void
  ) => {
    if (selectedList.includes(id)) {
      setSelectedList(selectedList.filter((item) => item !== id));
    } else {
      setSelectedList([...selectedList, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide an issue title.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    // Build curated items with titles & metadata for reliable rendering
    const curatedArticles = allArticles
      .filter((a) => selectedArticles.includes(a.id))
      .map((a) => ({ id: a.id, title: a.title, slug: a.slug, author: a.author_name, cover: a.cover_image }));

    const curatedFictions = allFictions
      .filter((f) => selectedFictions.includes(f.id))
      .map((f) => ({ id: f.id, title: f.title, slug: f.slug, author: f.author_name, genre: f.genre, cover: f.cover_image }));

    const curatedFolklores = allFolklores
      .filter((f) => selectedFolklores.includes(f.id))
      .map((f) => ({ id: f.id, title: f.title, slug: f.slug, narrator: f.narrator_name, category: f.category, cover: f.cover_image }));

    const curatedTellings = allTellings
      .filter((t) => selectedTellings.includes(t.id))
      .map((t) => ({ id: t.id, title: t.title, category: t.category, spotify: t.spotify_url, cover: t.cover_image }));

    try {
      await saveWebzineAction({
        id: editingItem?.id || undefined,
        title: title.trim(),
        webzine_name: `Issue ${issueNumber}: ${title.trim()}`,
        issue_number: issueNumber.trim() || "01",
        domain,
        date: date.trim() || "2026",
        cover_image: coverImage.trim() || null,
        excerpt: excerpt.trim() || null,
        description: description.trim() || null,
        articles: curatedArticles,
        fictions: curatedFictions,
        folklores: curatedFolklores,
        tellings: curatedTellings,
      });

      setMessage(editingItem?.id ? "Webzine issue updated successfully!" : "Webzine issue curated & published successfully!");
      setIsModalOpen(false);
      setEditingItem(null);
      fetchData();
    } catch (err: any) {
      alert("Error saving webzine issue: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const generatedSlug = generateSlug(title);
  const totalCurated =
    selectedArticles.length +
    selectedFictions.length +
    selectedFolklores.length +
    selectedTellings.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight flex items-center gap-2">
            <span>🗞️</span>
            <span>Webzine Issues</span>
          </h1>
          <p className="text-xs text-neutral-500">
            Curate thematic issues by grouping existing works from Articles, Fiction, Folklore, and Tellings
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[var(--color-brand-red)] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#520e0e] transition-all shadow-sm cursor-pointer self-start sm:self-auto"
        >
          + Curate New Issue
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

      {/* Modal for Curating / Editing an Issue */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-4xl w-full p-5 sm:p-7 my-auto max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  <span>🗞️</span>
                  <span>{editingItem?.id ? `Edit Webzine Issue #${editingItem.id}` : "Curate New Webzine Issue"}</span>
                </h2>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Group existing published works into a themed anthology issue.
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
              {/* Title & Auto Slug */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Monsoon Notes: Voices from the Margin"
                  className="w-full px-3.5 py-2.5 border-2 border-neutral-300 rounded-lg font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
                <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded border border-neutral-200">
                  <span className="font-sans font-bold text-neutral-700">Auto Slug:</span>
                  <span className="text-[var(--color-brand-red)] truncate">/webzine/{generatedSlug}</span>
                </div>
              </div>

              {/* Meta: Issue Number, Theme, Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Issue Number</label>
                  <input
                    type="text"
                    required
                    value={issueNumber}
                    onChange={(e) => setIssueNumber(e.target.value)}
                    placeholder="e.g. 01"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Format / Theme</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none bg-white cursor-pointer"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 uppercase mb-1">Publishing Date / Season</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. Oct 2026 or Monsoon 2026"
                    className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <DirectMediaUpload
                label="Cover Poster / Issue Artwork"
                value={coverImage}
                onChange={setCoverImage}
                type="image"
                helpText="Upload cover artwork directly from device, select from media library, or paste image URL."
              />

              {/* Excerpt */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Issue Synopsis / Editorial Lead</label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short introductory note explaining the theme and significance of this curated edition..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
                />
              </div>

              {/* ───────────────────────────────────────────────────────── */}
              {/* CURATION: SELECT EXISTING WORKS FROM OTHER SECTIONS      */}
              {/* ───────────────────────────────────────────────────────── */}
              <div className="border-2 border-[var(--color-brand-border)] rounded-xl p-4 bg-neutral-50/70 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-black uppercase tracking-tight flex items-center gap-1.5">
                      <span>📚</span>
                      <span>Group Existing Works into this Webzine</span>
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-normal">
                      Select which essays, fiction, folklore, and audio tellings belong to this issue.
                    </p>
                  </div>

                  <span className="bg-[var(--color-brand-red)] text-white text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap self-start sm:self-auto">
                    {totalCurated} Works Selected
                  </span>
                </div>

                {/* Section selection tabs */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurationTab("articles");
                      setCurationSearch("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      curationTab === "articles"
                        ? "bg-[var(--color-brand-green)] text-white shadow-xs"
                        : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    📝 Articles ({selectedArticles.length}/{allArticles.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurationTab("fictions");
                      setCurationSearch("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      curationTab === "fictions"
                        ? "bg-[var(--color-brand-green)] text-white shadow-xs"
                        : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    📖 Fiction ({selectedFictions.length}/{allFictions.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurationTab("folklores");
                      setCurationSearch("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      curationTab === "folklores"
                        ? "bg-[var(--color-brand-green)] text-white shadow-xs"
                        : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    🏛️ Folklore ({selectedFolklores.length}/{allFolklores.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurationTab("tellings");
                      setCurationSearch("");
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      curationTab === "tellings"
                        ? "bg-[var(--color-brand-green)] text-white shadow-xs"
                        : "bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100"
                    }`}
                  >
                    🎧 Tellings ({selectedTellings.length}/{allTellings.length})
                  </button>
                </div>

                {/* Search within current curation tab */}
                <input
                  type="text"
                  value={curationSearch}
                  onChange={(e) => setCurationSearch(e.target.value)}
                  placeholder={`Search ${curationTab} by title or author...`}
                  className="px-3 py-1.5 border border-neutral-300 rounded text-xs outline-none bg-white font-normal"
                />

                {/* List of items for current tab */}
                <div className="bg-white border rounded-lg max-h-56 overflow-y-auto divide-y divide-neutral-100 p-1">
                  {curationTab === "articles" && (
                    allArticles.length === 0 ? (
                      <div className="p-4 text-center text-neutral-400 text-xs font-normal">No articles available.</div>
                    ) : (
                      allArticles
                        .filter((a) => {
                          if (!curationSearch.trim()) return true;
                          const q = curationSearch.toLowerCase();
                          return (a.title || "").toLowerCase().includes(q) || (a.author_name || "").toLowerCase().includes(q);
                        })
                        .map((art) => {
                          const isSelected = selectedArticles.includes(art.id);
                          return (
                            <label
                              key={art.id}
                              className={`flex items-center justify-between p-2.5 rounded hover:bg-neutral-50 cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-50/80 font-bold" : "font-normal"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleItemSelection(art.id, selectedArticles, setSelectedArticles)
                                  }
                                  className="w-4 h-4 accent-[var(--color-brand-green)] cursor-pointer"
                                />
                                <div>
                                  <span className="text-xs text-black block">{art.title}</span>
                                  <span className="text-[10px] text-neutral-500 font-normal">
                                    By {art.author_name || "Thwara"} • {art.domain || "Literature"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-neutral-400 font-mono">#{art.id}</span>
                            </label>
                          );
                        })
                    )
                  )}

                  {curationTab === "fictions" && (
                    allFictions.length === 0 ? (
                      <div className="p-4 text-center text-neutral-400 text-xs font-normal">No fiction pieces available.</div>
                    ) : (
                      allFictions
                        .filter((f) => {
                          if (!curationSearch.trim()) return true;
                          const q = curationSearch.toLowerCase();
                          return (f.title || "").toLowerCase().includes(q) || (f.author_name || "").toLowerCase().includes(q);
                        })
                        .map((fic) => {
                          const isSelected = selectedFictions.includes(fic.id);
                          return (
                            <label
                              key={fic.id}
                              className={`flex items-center justify-between p-2.5 rounded hover:bg-neutral-50 cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-50/80 font-bold" : "font-normal"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleItemSelection(fic.id, selectedFictions, setSelectedFictions)
                                  }
                                  className="w-4 h-4 accent-[var(--color-brand-green)] cursor-pointer"
                                />
                                <div>
                                  <span className="text-xs text-black block">{fic.title}</span>
                                  <span className="text-[10px] text-neutral-500 font-normal">
                                    By {fic.author_name || "Thwara"} • {fic.genre || "Story"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-neutral-400 font-mono">#{fic.id}</span>
                            </label>
                          );
                        })
                    )
                  )}

                  {curationTab === "folklores" && (
                    allFolklores.length === 0 ? (
                      <div className="p-4 text-center text-neutral-400 text-xs font-normal">No folklore entries available.</div>
                    ) : (
                      allFolklores
                        .filter((fol) => {
                          if (!curationSearch.trim()) return true;
                          const q = curationSearch.toLowerCase();
                          return (fol.title || "").toLowerCase().includes(q) || (fol.narrator_name || "").toLowerCase().includes(q);
                        })
                        .map((fol) => {
                          const isSelected = selectedFolklores.includes(fol.id);
                          return (
                            <label
                              key={fol.id}
                              className={`flex items-center justify-between p-2.5 rounded hover:bg-neutral-50 cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-50/80 font-bold" : "font-normal"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleItemSelection(fol.id, selectedFolklores, setSelectedFolklores)
                                  }
                                  className="w-4 h-4 accent-[var(--color-brand-green)] cursor-pointer"
                                />
                                <div>
                                  <span className="text-xs text-black block">{fol.title}</span>
                                  <span className="text-[10px] text-neutral-500 font-normal">
                                    Narrated by {fol.narrator_name || "Thwara"} • {fol.category || "Oral Histories"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-neutral-400 font-mono">#{fol.id}</span>
                            </label>
                          );
                        })
                    )
                  )}

                  {curationTab === "tellings" && (
                    allTellings.length === 0 ? (
                      <div className="p-4 text-center text-neutral-400 text-xs font-normal">No audio tellings available.</div>
                    ) : (
                      allTellings
                        .filter((tel) => {
                          if (!curationSearch.trim()) return true;
                          const q = curationSearch.toLowerCase();
                          return (tel.title || "").toLowerCase().includes(q) || (tel.category || "").toLowerCase().includes(q);
                        })
                        .map((tel) => {
                          const isSelected = selectedTellings.includes(tel.id);
                          return (
                            <label
                              key={tel.id}
                              className={`flex items-center justify-between p-2.5 rounded hover:bg-neutral-50 cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-50/80 font-bold" : "font-normal"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    toggleItemSelection(tel.id, selectedTellings, setSelectedTellings)
                                  }
                                  className="w-4 h-4 accent-[var(--color-brand-green)] cursor-pointer"
                                />
                                <div>
                                  <span className="text-xs text-black block">{tel.title}</span>
                                  <span className="text-[10px] text-neutral-500 font-normal">
                                    {tel.category} • {tel.spotify_url ? "Spotify Linked" : "Direct Stream"}
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] text-neutral-400 font-mono">#{tel.id}</span>
                            </label>
                          );
                        })
                    )
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-700 uppercase mb-1">Curator Notes / Full Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed context and narrative architecture of this edition..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none font-serif"
                />
              </div>

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
                  {submitting ? "Saving..." : editingItem?.id ? "Update Issue" : "Publish Curated Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-8 text-center text-xs font-bold text-neutral-400">Loading issues...</div>
        ) : webzines.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-neutral-400 flex flex-col items-center gap-2">
            <span className="text-3xl">🗞️</span>
            <span>No webzine issues found.</span>
            <button
              onClick={handleOpenCreate}
              className="mt-2 text-[var(--color-brand-red)] hover:underline font-bold text-xs cursor-pointer"
            >
              + Curate the first Webzine issue
            </button>
          </div>
        ) : (
          webzines.map((issue) => {
            const artCount = Array.isArray(issue.articles) ? issue.articles.length : 0;
            const ficCount = Array.isArray(issue.fictions) ? issue.fictions.length : 0;
            const folCount = Array.isArray(issue.folklores) ? issue.folklores.length : 0;
            const telCount = Array.isArray(issue.tellings) ? issue.tellings.length : 0;
            const total = artCount + ficCount + folCount + telCount;

            return (
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
                  <div className="text-[10px] font-mono text-neutral-400 truncate">/webzine/{issue.slug}</div>

                  <p className="text-xs text-neutral-600 line-clamp-2 mt-1">
                    {issue.excerpt || issue.description || "Themed digital edition."}
                  </p>

                  {/* Curated works summary chips */}
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap gap-1.5">
                    {total === 0 ? (
                      <span className="text-[10px] text-neutral-400 italic">No works grouped yet</span>
                    ) : (
                      <>
                        {artCount > 0 && (
                          <span className="bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {artCount} {artCount === 1 ? "Article" : "Articles"}
                          </span>
                        )}
                        {ficCount > 0 && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {ficCount} Fiction
                          </span>
                        )}
                        {folCount > 0 && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {folCount} Folklore
                          </span>
                        )}
                        {telCount > 0 && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {telCount} Audio
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] bg-white border px-2 py-0.5 rounded font-bold text-neutral-700">
                    {issue.domain || "Visual Essay"}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleOpenEdit(issue)}
                      className="text-xs px-2.5 py-1 bg-white border border-neutral-300 rounded font-bold text-black hover:bg-neutral-100 cursor-pointer"
                    >
                      Edit & Curate
                    </button>
                    <button
                      onClick={() => handleDelete(issue.id)}
                      className="text-xs px-2.5 py-1 bg-red-50 border border-red-200 rounded font-bold text-red-700 hover:bg-red-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
