"use client";

import { useState } from "react";
import Image from "next/image";
import { loginAdminAction } from "../actions";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAdminAction(formData);
      if (res?.error) {
        setError(res.error);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      // In Next.js redirect() throws an internal NEXT_REDIRECT error which is expected
      if (err?.message?.includes("NEXT_REDIRECT")) return;
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-[var(--color-brand-border)] rounded-xl p-8 shadow-xl flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <Image
            src="/image.png"
            alt="Thwara"
            width={120}
            height={90}
            className="w-24 h-auto object-contain mb-2"
          />
          <h1 className="text-2xl font-bold tracking-tight text-black">Thwara Editorial Dashboard</h1>
          <p className="text-xs text-neutral-500 font-medium">Enter your private passkey to manage platform content</p>
        </div>

        {error && (
          <div className="w-full bg-red-50 border-2 border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
              Admin Passkey
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="••••••••••••"
              className="w-full px-4 py-3 border-2 border-[var(--color-brand-border)] rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] transition-all font-mono tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[var(--color-brand-red)] hover:bg-[#520e0e] text-white font-bold rounded-lg transition-all shadow-md active:scale-[0.99] disabled:opacity-50 text-sm uppercase tracking-wider mt-2 cursor-pointer"
          >
            {isSubmitting ? "Unlocking Dashboard..." : "Access Dashboard →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-200 w-full text-center">
          <a
            href="/"
            className="text-xs font-bold text-neutral-500 hover:text-[var(--color-brand-red)] transition-colors inline-flex items-center gap-1"
          >
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
