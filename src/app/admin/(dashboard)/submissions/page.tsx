"use client";

import { useState, useEffect } from "react";
import { getAdminSubmissions, updateSubmissionStatusAction } from "../../actions";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const STATUSES = ["All", "Pending", "Under Review", "Accepted", "Rejected"];

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAdminSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateSubmissionStatusAction(id, newStatus);
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
      );
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = activeFilter === "All"
    ? submissions
    : submissions.filter((s) => s.status === activeFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Under Review":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Accepted":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Rejected":
        return "bg-neutral-100 text-neutral-600 border-neutral-300";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-300";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Submissions Inbox</h1>
          <p className="text-xs text-neutral-500">Review pitches and submissions sent through the website</p>
        </div>

        <button
          onClick={fetchSubmissions}
          className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded border border-neutral-300 transition-colors cursor-pointer self-start sm:self-auto"
        >
          🔄 Refresh Inbox
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {STATUSES.map((status) => {
          const count = status === "All"
            ? submissions.length
            : submissions.filter((s) => s.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-3.5 py-2 rounded-lg border-2 transition-all cursor-pointer ${
                activeFilter === status
                  ? "bg-[var(--color-brand-green)] border-[var(--color-brand-green)] text-white shadow-sm"
                  : "bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400"
              }`}
            >
              <span>{status}</span>
              <span className="ml-2 text-[10px] opacity-80 px-1.5 py-0.5 rounded-full bg-black/10">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Submissions List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-12 text-center text-xs font-bold text-neutral-400">
            Loading submissions...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-neutral-300 rounded-xl p-12 text-center flex flex-col items-center gap-2">
            <span className="text-4xl">📭</span>
            <span className="text-sm font-bold text-neutral-700">No submissions found in this category.</span>
            <p className="text-xs text-neutral-400">Incoming pitches from writers will appear here automatically.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-neutral-200 hover:border-[var(--color-brand-border)] rounded-xl p-5 sm:p-6 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex flex-col gap-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(item.status)}`}>
                    {item.status || "Pending"}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    Submitted on {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-black">{item.title}</h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 font-medium">
                  <span className="flex items-center gap-1">
                    <span>✍ Author:</span>
                    <strong className="text-black">{item.author_name}</strong>
                  </span>

                  {item.email && (
                    <span className="flex items-center gap-1">
                      <span>✉ Email:</span>
                      <a href={`mailto:${item.email}`} className="text-[var(--color-brand-red)] hover:underline">
                        {item.email}
                      </a>
                    </span>
                  )}
                </div>

                {/* Attachments / Links */}
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-neutral-100">
                  {item.document_url && (
                    <a
                      href={item.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold rounded border border-neutral-300 transition-colors"
                    >
                      <span>📎</span>
                      <span>View Attached Document ({item.document_name || "Download"})</span>
                      <span>↗</span>
                    </a>
                  )}

                  {item.google_drive_link && (
                    <a
                      href={item.google_drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold rounded border border-neutral-300 transition-colors"
                    >
                      <span>📂</span>
                      <span>Google Drive Link</span>
                      <span>↗</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Status Update Action */}
              <div className="flex flex-col items-start md:items-end gap-2 border-t md:border-t-0 pt-4 md:pt-0 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Change Status:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Pending", "Under Review", "Accepted", "Rejected"].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(item.id, st)}
                      disabled={updatingId === item.id || item.status === st}
                      className={`text-xs px-2.5 py-1 rounded font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        item.status === st
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
