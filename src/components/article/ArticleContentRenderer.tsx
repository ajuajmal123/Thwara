"use client";

import { useState } from "react";

interface ArticleContentRendererProps {
  content?: string | null;
  additionalImages?: string[] | null;
  reference?: string | null;
  isMalayalam?: boolean;
}

export default function ArticleContentRenderer({
  content = "",
  additionalImages = [],
  reference,
  isMalayalam = false,
}: ArticleContentRendererProps) {
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  // Helper for inline markdown: **bold**, *italic*, [link](url), ![img](url)
  const formatInline = (text: string) => {
    // 1. Process bold: **text**
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-black">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="italic text-neutral-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-brand-red)] underline hover:text-[#520e0e]"
          >
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  // Render structured markdown lines
  const renderMarkdown = () => {
    if (!content || !content.trim()) {
      return (
        <p className="text-neutral-500 italic py-4">
          This piece does not have extended body text.
        </p>
      );
    }

    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = (keyIndex: number) => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ");
        elements.push(
          <p
            key={`p-${keyIndex}`}
            className={`text-neutral-900 leading-[1.8] sm:leading-[2] mb-6 text-base sm:text-lg ${
              isMalayalam ? "font-sans leading-relaxed" : "font-serif"
            }`}
          >
            {formatInline(text)}
          </p>
        );
        currentParagraph = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Heading 1: # Title
      if (trimmed.startsWith("# ")) {
        flushParagraph(index);
        elements.push(
          <h1
            key={`h1-${index}`}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mt-10 mb-4 font-sans tracking-tight border-b-2 border-neutral-200 pb-2"
          >
            {trimmed.replace(/^#\s+/, "")}
          </h1>
        );
      }
      // Heading 2: ## Section
      else if (trimmed.startsWith("## ")) {
        flushParagraph(index);
        elements.push(
          <h2
            key={`h2-${index}`}
            className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mt-10 mb-4 font-sans tracking-tight text-[var(--color-brand-red)] flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand-red)] inline-block shrink-0" />
            <span>{trimmed.replace(/^##\s+/, "")}</span>
          </h2>
        );
      }
      // Subheading 3: ### Subsection
      else if (trimmed.startsWith("### ")) {
        flushParagraph(index);
        elements.push(
          <h3
            key={`h3-${index}`}
            className="text-lg sm:text-xl font-bold text-neutral-800 mt-8 mb-3 font-sans tracking-tight"
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }
      // Blockquote: > Quote
      else if (trimmed.startsWith("> ")) {
        flushParagraph(index);
        elements.push(
          <blockquote
            key={`quote-${index}`}
            className="border-l-4 border-[var(--color-brand-green)] pl-5 py-2 my-6 italic text-neutral-800 bg-neutral-50/80 rounded-r-lg text-base sm:text-lg font-serif"
          >
            {formatInline(trimmed.replace(/^>\s+/, ""))}
          </blockquote>
        );
      }
      // Embedded image: ![caption](url)
      else if (trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)) {
        flushParagraph(index);
        const match = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (match) {
          const caption = match[1];
          const imgUrl = match[2];
          elements.push(
            <figure key={`img-${index}`} className="my-8 flex flex-col items-center">
              <img
                src={imgUrl}
                alt={caption || "Embedded image"}
                className="w-full max-h-[550px] object-cover rounded-lg border-2 border-[var(--color-brand-border)] shadow-sm cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => setActiveModalImage(imgUrl)}
              />
              {caption && (
                <figcaption className="text-xs text-neutral-500 mt-2 italic text-center">
                  {caption}
                </figcaption>
              )}
            </figure>
          );
        }
      }
      // Bullet list item
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph(index);
        elements.push(
          <li
            key={`li-${index}`}
            className="ml-6 list-disc text-base sm:text-lg text-neutral-900 my-1.5 font-serif"
          >
            {formatInline(trimmed.replace(/^[-*]\s+/, ""))}
          </li>
        );
      }
      // Empty line -> paragraph separator
      else if (trimmed === "") {
        flushParagraph(index);
      } else {
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph(lines.length);
    return elements;
  };

  const imagesList = Array.isArray(additionalImages)
    ? additionalImages.filter((img) => typeof img === "string" && img.trim().length > 0)
    : [];

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Article Body */}
      <div className="prose max-w-none text-neutral-900 leading-relaxed">
        {renderMarkdown()}
      </div>

      {/* Additional Images / Visual Gallery */}
      {imagesList.length > 0 && (
        <section className="mt-8 pt-8 border-t-2 border-[var(--color-brand-border)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <span>🖼️</span>
              <span>Visual Archive & Additional Images ({imagesList.length})</span>
            </h3>
            <span className="text-[11px] text-neutral-500 font-medium">Click to enlarge</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imagesList.map((imgUrl, idx) => (
              <div
                key={`gallery-${idx}`}
                onClick={() => setActiveModalImage(imgUrl)}
                className="group relative aspect-video bg-neutral-100 rounded-lg border-2 border-[var(--color-brand-border)] overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <img
                  src={imgUrl}
                  alt={`Additional image ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                  <span>🔍 View Full</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Archival Reference / Notes */}
      {reference && reference.trim() && (
        <section className="mt-6 p-4 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-lg text-xs flex flex-col gap-1.5">
          <span className="font-bold uppercase tracking-wider text-neutral-700">
            Notes & References
          </span>
          <p className="text-neutral-600 whitespace-pre-line leading-relaxed">
            {reference}
          </p>
        </section>
      )}

      {/* Image Lightbox Modal */}
      {activeModalImage && (
        <div
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <img
              src={activeModalImage}
              alt="Expanded view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg border-2 border-white/20 shadow-2xl"
            />
            <button
              onClick={() => setActiveModalImage(null)}
              className="mt-3 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
