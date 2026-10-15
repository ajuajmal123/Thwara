"use client";

import { useState, useEffect } from "react";
import { uploadMediaAction, listMediaFilesAction } from "../../actions";

export default function AdminMediaPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      const data = await listMediaFilesAction();
      setFiles(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedUrl(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await uploadMediaAction(formData);
      setUploadedUrl(res.url);
      fetchFiles();
    } catch (err: any) {
      alert("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Media Library</h1>
          <p className="text-xs text-neutral-500">
            Upload cover photos and graphics directly to Supabase Storage and copy their links
          </p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white border-4 border-dashed border-[var(--color-brand-border)] rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-[var(--color-brand-green)] flex items-center justify-center text-2xl text-[var(--color-brand-green)]">
          📷
        </div>

        <div>
          <h2 className="text-base font-bold text-black">Upload Image to Supabase Cloud</h2>
          <p className="text-xs text-neutral-500 max-w-sm mt-1">
            Supports PNG, JPG, WebP, SVG. Images are stored securely in your public Supabase Storage bucket.
          </p>
        </div>

        <label className="px-6 py-3 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md cursor-pointer transition-all active:scale-[0.99]">
          {uploading ? "Uploading Image..." : "Select & Upload File"}
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {uploadedUrl && (
          <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg max-w-xl w-full flex flex-col gap-2">
            <span className="text-xs font-bold text-emerald-800">✓ Upload Complete! Public URL:</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={uploadedUrl}
                className="w-full text-xs p-2 bg-white border border-emerald-200 rounded font-mono truncate"
              />
              <button
                onClick={() => copyToClipboard(uploadedUrl)}
                className="px-3 py-2 bg-[var(--color-brand-green)] text-white text-xs font-bold rounded shrink-0 cursor-pointer"
              >
                {copiedUrl === uploadedUrl ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Media Gallery */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-black flex items-center justify-between">
          <span>Uploaded Files ({files.length})</span>
          <button onClick={fetchFiles} className="text-xs text-neutral-500 hover:text-black">
            Refresh
          </button>
        </h2>

        {files.length === 0 ? (
          <div className="bg-white border-2 border-neutral-200 rounded-xl p-12 text-center text-xs font-bold text-neutral-400">
            No media uploads recorded yet. Upload an image above to start your gallery.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => (
              <div
                key={file.name}
                className="bg-white border-2 border-neutral-200 hover:border-[var(--color-brand-border)] rounded-lg overflow-hidden flex flex-col justify-between group transition-all"
              >
                <div className="h-32 bg-neutral-100 flex items-center justify-center overflow-hidden border-b">
                  <img
                    src={file.url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                <div className="p-2 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-neutral-700 truncate" title={file.name}>
                    {file.name}
                  </span>

                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="w-full py-1 text-[10px] font-bold bg-neutral-100 hover:bg-neutral-200 text-black rounded border border-neutral-300 transition-colors cursor-pointer"
                  >
                    {copiedUrl === file.url ? "✓ Copied" : "Copy URL"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
