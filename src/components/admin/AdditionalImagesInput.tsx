"use client";

import { useState } from "react";

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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-neutral-700 uppercase font-bold text-xs tracking-wider">
          {label} ({images.length})
        </label>
        <a
          href="/admin/media"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold text-[var(--color-brand-red)] hover:underline flex items-center gap-1"
        >
          <span>🖼️</span>
          <span>Upload Image in Media Library ↗</span>
        </a>
      </div>

      <div className="flex gap-2">
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
          placeholder="Paste image URL here (https://... or uploaded Supabase link)"
          className="w-full px-3 py-2 border-2 border-neutral-300 rounded font-normal text-sm focus:border-[var(--color-brand-green)] outline-none"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded text-xs shrink-0 cursor-pointer transition-colors"
        >
          + Add
        </button>
      </div>

      {/* Thumbnails of Added Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          {images.map((url, idx) => (
            <div key={idx} className="relative group rounded overflow-hidden border border-neutral-300 bg-white aspect-video flex items-center justify-center">
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
    </div>
  );
}
