"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface AutofillPreset {
  label_es: string;
  label_en: string;
  values: Record<string, string>;
}

interface AutofillBadgesProps {
  presets: AutofillPreset[];
  onFill: (values: Record<string, string>) => void;
}

export function AutofillBadges({ presets, onFill }: AutofillBadgesProps) {
  const { language } = useLanguage();

  if (!presets || presets.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-xs text-white/40 mb-3 font-semibold uppercase tracking-wider">
        {language === "en" ? "Quick Presets" : "Plantillas Rápidas"}
      </p>
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onFill(preset.values)}
            className="px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 text-white hover:bg-[var(--color-primary)] hover:border-[var(--color-primary)] hover:text-white transition-all shadow-sm"
          >
            {language === "en" ? preset.label_en : preset.label_es}
          </button>
        ))}
      </div>
    </div>
  );
}
