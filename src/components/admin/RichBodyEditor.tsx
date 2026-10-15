"use client";

import { useState } from "react";

interface RichBodyEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function RichBodyEditor({
  value,
  onChange,
  placeholder = "Write your story or article here. You can include Headings, Subheadings, Quotes, and Paragraphs...",
  label = "Full Article Body (Includes Headings, Subheadings & Content)",
}: RichBodyEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  const insertFormatting = (prefix: string, suffix: string = "", sample: string = "") => {
    const textarea = document.getElementById("rich-body-textarea") as HTMLTextAreaElement | null;
    if (!textarea) {
      onChange((value ? value + "\n\n" : "") + prefix + sample + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || sample;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const replacement = prefix + selectedText + suffix;
    const newValue = before + replacement + after;
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 10);
  };

  // Simple Markdown Parser for Live Preview
  const renderPreview = (content: string) => {
    if (!content.trim()) {
      return (
        <p className="text-neutral-400 italic text-sm py-8 text-center">
          No content written yet. Switch to "Write" to start crafting your piece.
        </p>
      );
    }

    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let currentParagraph: string[] = [];

    const flushParagraph = (key: number) => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ");
        elements.push(
          <p key={`p-${key}`} className="my-3 text-sm leading-relaxed text-neutral-800 font-serif">
            {formatInline(text)}
          </p>
        );
        currentParagraph = [];
      }
    };

    const formatInline = (text: string) => {
      // Basic bold and italic rendering
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|!\[.*?\]\(.*?\))/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} className="font-bold text-black">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i} className="italic text-neutral-700">{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("![") && part.includes("](") && part.endsWith(")")) {
          const match = part.match(/!\[(.*?)\]\((.*?)\)/);
          if (match) {
            return (
              <figure key={i} className="my-4 block">
                <img src={match[2]} alt={match[1]} className="max-w-full rounded border border-neutral-300 max-h-96 object-cover mx-auto" />
                {match[1] && <figcaption className="text-center text-[11px] text-neutral-500 mt-1">{match[1]}</figcaption>}
              </figure>
            );
          }
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("### ")) {
        flushParagraph(index);
        elements.push(
          <h3 key={`h3-${index}`} className="text-base font-bold text-neutral-900 mt-5 mb-2 font-sans border-b border-neutral-200 pb-1">
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        flushParagraph(index);
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl font-bold text-black mt-6 mb-2.5 font-sans tracking-tight text-[var(--color-brand-red)]">
            {trimmed.replace(/^##\s+/, "")}
          </h2>
        );
      } else if (trimmed.startsWith("# ")) {
        flushParagraph(index);
        elements.push(
          <h1 key={`h1-${index}`} className="text-2xl font-bold text-black mt-6 mb-3 font-sans">
            {trimmed.replace(/^#\s+/, "")}
          </h1>
        );
      } else if (trimmed.startsWith("> ")) {
        flushParagraph(index);
        elements.push(
          <blockquote key={`quote-${index}`} className="border-l-4 border-[var(--color-brand-green)] pl-4 py-1.5 my-3 italic text-neutral-700 bg-neutral-50 rounded-r text-sm font-serif">
            {formatInline(trimmed.replace(/^>\s+/, ""))}
          </blockquote>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        flushParagraph(index);
        elements.push(
          <li key={`li-${index}`} className="ml-5 list-disc text-sm text-neutral-800 my-1 font-serif">
            {formatInline(trimmed.replace(/^[-*]\s+/, ""))}
          </li>
        );
      } else if (trimmed === "") {
        flushParagraph(index);
      } else {
        currentParagraph.push(trimmed);
      }
    });

    flushParagraph(lines.length);
    return elements;
  };

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-neutral-700 uppercase font-bold text-xs tracking-wider">
          {label} *
        </label>

        {/* View Switcher: Write vs Preview */}
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-300 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              tab === "write"
                ? "bg-white text-black shadow-xs"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            ✍️ Editor
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
              tab === "preview"
                ? "bg-white text-[var(--color-brand-red)] shadow-xs"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            👁️ Live Preview
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <div className="border-2 border-neutral-300 rounded-lg overflow-hidden focus-within:border-[var(--color-brand-green)] transition-all bg-white">
          {/* Formatting Bar */}
          <div className="bg-neutral-50 border-b border-neutral-200 p-2 flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => insertFormatting("\n## ", "\n\n", "Main Heading")}
              title="Add Main Section Heading (H2)"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-neutral-800 text-[11px] cursor-pointer"
            >
              H2 Heading
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n### ", "\n\n", "Subsection Subheading")}
              title="Add Subsection Subheading (H3)"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-neutral-800 text-[11px] cursor-pointer"
            >
              H3 Subheading
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n\n", "\n\n", "Write body paragraph text here.")}
              title="Add Paragraph text"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-neutral-800 text-[11px] cursor-pointer"
            >
              Paragraph
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n> ", "\n\n", "Highlight quote or pull-quote")}
              title="Add Blockquote"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-neutral-800 text-[11px] cursor-pointer"
            >
              " Quote
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("**", "**", "bold text")}
              title="Bold"
              className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-[11px] cursor-pointer"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*", "italic text")}
              title="Italic"
              className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded italic font-bold text-[11px] cursor-pointer"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n- ", "\n- \n", "List item")}
              title="Bullet list"
              className="px-2 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-[11px] cursor-pointer"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("\n![Image Description](", ")\n\n", "https://...")}
              title="Insert inline image"
              className="px-2.5 py-1 bg-white hover:bg-neutral-200 border border-neutral-300 rounded font-bold text-neutral-800 text-[11px] cursor-pointer ml-auto"
            >
              🖼️ Embed Image
            </button>
          </div>

          <textarea
            id="rich-body-textarea"
            name="content"
            rows={10}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3 font-serif text-sm leading-relaxed text-black placeholder:text-neutral-400 outline-none resize-y min-h-[200px]"
          />

          <div className="bg-neutral-50 border-t border-neutral-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-neutral-500 font-sans">
            <span>
              💡 Use <strong>## Heading</strong> for main section titles and <strong>### Subheading</strong> for subsections.
            </span>
            <span className="font-bold text-neutral-700">
              {wordCount} words • ~{readTime} min read
            </span>
          </div>
        </div>
      ) : (
        <div className="border-2 border-neutral-300 rounded-lg p-5 bg-white min-h-[260px] max-h-[450px] overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-brand-green)] block mb-3">
              Preview Mode
            </span>
            {renderPreview(value)}
          </div>
        </div>
      )}
    </div>
  );
}
