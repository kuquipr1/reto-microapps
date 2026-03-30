"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
      <button
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
          language === "en"
            ? "bg-[var(--color-primary)] text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]"
            : "text-white/40 hover:text-white/80 hover:bg-white/5"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("es")}
        className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
          language === "es"
            ? "bg-[var(--color-primary)] text-white shadow-[0_0_10px_rgba(124,58,237,0.5)]"
            : "text-white/40 hover:text-white/80 hover:bg-white/5"
        }`}
      >
        ES
      </button>
    </div>
  );
}
