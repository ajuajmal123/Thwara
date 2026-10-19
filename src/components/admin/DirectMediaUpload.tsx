"use client";

import { useState, useRef, useEffect } from "react";
import { uploadMediaAction, listMediaFilesAction } from "@/app/admin/actions";

interface DirectMediaUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  helpText?: string;
  accept?: string;
  type?: "image" | "audio" | "any";
  name?: string;
  required?: boolean;
}

export default function DirectMediaUpload({
  value,
  onChange,
  label,
  placeholder = "https://... or upload directly",
  helpText,
  accept = "image/*",
  type = "image",
  name,
  required = false,
}: DirectMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<any[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload handler for direct file
  const handleFile = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadMediaAction(formData);
      if (res?.url) {
        onChange(res.url);
      } else {
        throw new Error("No URL returned from upload server action");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload file to storage.");
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // reset input so same file can be re-selected if needed
    e.target.value = "";
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Open Media Library Modal & fetch files
  const openLibrary = async () => {
    setIsLibraryOpen(true);
    setLibraryLoading(true);
    try {
      const files = await listMediaFilesAction();
      setLibraryFiles(files || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLibraryLoading(false);
    }
  };

  const handleSelectFromLibrary = (url: string) => {
    onChange(url);
    setIsLibraryOpen(false);
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLibraryFiles = libraryFiles.filter((file) => {
    if (!librarySearch.trim()) return true;
    return file.name.toLowerCase().includes(librarySearch.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Hidden input for FormData compatibility */}
      {name && <input type="hidden" name={name} value={value || ""} />}

      {/* Field Label & Top Actions */}
      <div className="flex items-center justify-between">
        <label className="text-neutral-700 uppercase font-bold text-xs tracking-wider">
          {label} {required && <span className="text-[var(--color-brand-red)]">*</span>}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openLibrary}
            className="text-[11px] font-bold text-[var(--color-brand-red)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>🖼️</span>
            <span>Browse Library</span>
          </button>
          <span className="text-neutral-300 text-xs">|</span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-bold text-neutral-500 hover:text-black cursor-pointer"
          >
            {showUrlInput ? "Hide URL Input" : "Paste URL"}
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-2.5 bg-red-50 border border-red-300 rounded text-red-800 text-xs font-medium flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-800 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Direct Upload Box or Preview Card */}
      {!value ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center gap-3 transition-colors ${
            dragOver
              ? "border-[var(--color-brand-red)] bg-red-50/50"
              : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100/60"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept={accept}
            onChange={onFileInputChange}
            className="hidden"
            disabled={uploading}
          />

          <div className="w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-lg shadow-xs text-neutral-700">
            {type === "audio" ? "🎧" : "📷"}
          </div>

          <div>
            <p className="text-xs font-bold text-neutral-800">
              {uploading ? (
                <span className="text-[var(--color-brand-red)] flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-[var(--color-brand-red)] border-t-transparent rounded-full animate-spin inline-block" />
                  Uploading to Supabase Storage...
                </span>
              ) : (
                `Drag & drop or directly upload ${type === "audio" ? "audio" : "image"}`
              )}
            </p>
            {helpText && !uploading && (
              <p className="text-[11px] text-neutral-500 mt-0.5">{helpText}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>📁</span>
              <span>{uploading ? "Uploading..." : `Choose ${type === "audio" ? "Audio" : "File"} from Device`}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Preview Card when media URL is set */
        <div className="p-3 bg-neutral-50 border-2 border-[var(--color-brand-border)] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {type === "image" ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-neutral-300 bg-white shrink-0 flex items-center justify-center">
                <img
                  src={value}
                  alt="Media preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            ) : type === "audio" ? (
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700">
                  <span>🎧 Audio Attached</span>
                </div>
                <audio controls src={value} className="w-full h-8 max-w-md" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded bg-neutral-200 flex items-center justify-center text-lg shrink-0">
                📎
              </div>
            )}

            <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded w-fit">
                ✓ Media Attached
              </span>
              <span className="text-xs font-mono text-neutral-600 truncate block mt-0.5 max-w-md">
                {value}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <input
              type="file"
              ref={fileInputRef}
              accept={accept}
              onChange={onFileInputChange}
              className="hidden"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={handleCopyUrl}
              className="px-2.5 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded text-xs font-bold text-neutral-700 cursor-pointer"
              title="Copy URL"
            >
              {copied ? "Copied!" : "Copy URL"}
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-black text-white rounded text-xs font-bold cursor-pointer transition-colors"
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded text-xs font-bold cursor-pointer transition-colors"
              title="Remove media"
            >
              ✕ Remove
            </button>
          </div>
        </div>
      )}

      {/* Optional direct URL input field */}
      {(showUrlInput || (!value && showUrlInput)) && (
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-xs sm:text-sm focus:border-[var(--color-brand-green)] outline-none font-mono"
          />
        </div>
      )}

      {/* Media Library Inline Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-4xl w-full p-5 sm:p-6 my-auto max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <span>🖼️</span>
                  <span>Media Library Picker</span>
                </h3>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Click any previously uploaded file to select it directly into this field.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="text-neutral-400 hover:text-black font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal search bar and direct upload */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Search uploads by filename..."
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                className="px-3 py-2 border-2 border-neutral-300 rounded-lg text-xs font-normal outline-none focus:border-[var(--color-brand-green)] flex-1"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
              >
                + Upload New File
              </button>
            </div>

            {/* Gallery grid */}
            {libraryLoading ? (
              <div className="py-16 text-center text-xs font-bold text-neutral-400">
                Loading files from Supabase Storage...
              </div>
            ) : filteredLibraryFiles.length === 0 ? (
              <div className="py-16 text-center text-xs font-medium text-neutral-400 border-2 border-dashed rounded-lg">
                No matching media uploads found. Click &ldquo;Upload New File&rdquo; to add one.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {filteredLibraryFiles.map((file) => (
                  <div
                    key={file.name}
                    onClick={() => handleSelectFromLibrary(file.url)}
                    className="border-2 border-neutral-200 hover:border-[var(--color-brand-red)] rounded-lg overflow-hidden p-1.5 flex flex-col justify-between cursor-pointer group bg-neutral-50 hover:bg-red-50/20 transition-all"
                  >
                    <div className="aspect-video w-full rounded overflow-hidden bg-neutral-200 flex items-center justify-center">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-neutral-700 truncate mt-1.5 block">
                      {file.name}
                    </span>
                    <span className="text-[9px] text-[var(--color-brand-red)] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                      Select ↗
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
