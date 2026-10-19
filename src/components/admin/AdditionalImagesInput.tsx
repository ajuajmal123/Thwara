"use client";

import { useState, useRef } from "react";
import { uploadMediaAction, listMediaFilesAction } from "@/app/admin/actions";

interface AdditionalImagesInputProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
}

export default function AdditionalImagesInput({
  images,
  onChange,
  label = "Additional Gallery Images",
}: AdditionalImagesInputProps) {
  const [inputUrl, setInputUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<any[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      alert("This image URL has already been added.");
      return;
    }
    onChange([...images, trimmed]);
    setInputUrl("");
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  // Direct multi-file upload handler
  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMessage(null);
    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${files.length}...`);
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await uploadMediaAction(formData);
        if (res?.url && !images.includes(res.url) && !newUrls.includes(res.url)) {
          newUrls.push(res.url);
        }
      }

      onChange([...images, ...newUrls]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload one or more images.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      e.target.value = "";
    }
  };

  // Open Media Library Modal
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
    if (!images.includes(url)) {
      onChange([...images, url]);
    }
  };

  const filteredLibraryFiles = libraryFiles.filter((file) => {
    if (!librarySearch.trim()) return true;
    return file.name.toLowerCase().includes(librarySearch.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-neutral-700 uppercase font-bold text-xs tracking-wider">
          {label} ({images.length})
        </label>
        <button
          type="button"
          onClick={openLibrary}
          className="text-[11px] font-bold text-[var(--color-brand-red)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>🖼️</span>
          <span>Pick from Media Library</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-2 bg-red-50 border border-red-300 text-red-800 text-xs rounded">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Direct File Upload & URL input Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleMultipleFiles}
          className="hidden"
          disabled={uploading}
        />

        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white font-bold rounded text-xs shrink-0 cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>📁</span>
          <span>{uploadProgress || (uploading ? "Uploading..." : "Direct Upload Images")}</span>
        </button>

        <div className="flex flex-1 gap-2">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Or paste image URL here and click + Add"
            className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-xs sm:text-sm focus:border-[var(--color-brand-green)] outline-none min-w-0"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded text-xs shrink-0 cursor-pointer transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {/* Thumbnails of Added Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative group rounded overflow-hidden border border-neutral-300 bg-white aspect-video flex items-center justify-center shadow-xs"
            >
              <img
                src={url}
                alt={`Additional ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="absolute bottom-1 left-1 text-[9px] bg-black/70 text-white px-1 rounded font-mono">
                #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                title="Remove image"
                className="absolute top-1 right-1 w-5 h-5 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-pointer opacity-90 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Media Library Picker Modal */}
      {isLibraryOpen && (
        <div className="fixed inset-0 bg-black/60 z-[75] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border-4 border-[var(--color-brand-border)] rounded-xl max-w-4xl w-full p-5 sm:p-6 my-auto max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b-2 border-neutral-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-black flex items-center gap-2">
                  <span>🖼️</span>
                  <span>Select Gallery Images from Library</span>
                </h3>
                <span className="text-[11px] text-neutral-500 font-medium">
                  Click any image to add it directly to this article&rsquo;s additional gallery.
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

            <div className="flex items-center gap-3">
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
                + Direct Upload File
              </button>
            </div>

            {libraryLoading ? (
              <div className="py-16 text-center text-xs font-bold text-neutral-400">
                Loading files from Supabase Storage...
              </div>
            ) : filteredLibraryFiles.length === 0 ? (
              <div className="py-16 text-center text-xs font-medium text-neutral-400 border-2 border-dashed rounded-lg">
                No uploads found. Upload images to add them to your gallery.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[50vh] overflow-y-auto p-1">
                {filteredLibraryFiles.map((file) => {
                  const alreadyAdded = images.includes(file.url);
                  return (
                    <div
                      key={file.name}
                      onClick={() => handleSelectFromLibrary(file.url)}
                      className={`border-2 rounded-lg overflow-hidden p-1.5 flex flex-col justify-between cursor-pointer group transition-all ${
                        alreadyAdded
                          ? "border-emerald-500 bg-emerald-50/50 opacity-80"
                          : "border-neutral-200 hover:border-[var(--color-brand-red)] bg-neutral-50"
                      }`}
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
                      <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">
                        {alreadyAdded ? "✓ Added" : "+ Add to Gallery"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xs font-bold text-neutral-600">
                Current Gallery: {images.length} images selected
              </span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="px-5 py-2 bg-neutral-900 hover:bg-black text-white rounded text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
