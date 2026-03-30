"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";

export interface FormFieldSchema {
  id?: string;
  name?: string; // Payload from the DB might use "name"
  type: "textarea" | "select" | "text" | "number" | "toggle";
  label_es: string;
  label_en: string;
  placeholder_es?: string;
  placeholder_en?: string;
  options_es?: string[];
  options_en?: string[];
  required?: boolean;
}

interface DynamicFormProps {
  fields: FormFieldSchema[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  responseLanguage: "es" | "en";
  onChangeLanguage: (val: "es" | "en") => void;
}

export function DynamicForm({ fields, values, onChange, responseLanguage, onChangeLanguage }: DynamicFormProps) {
  const { language } = useLanguage();

  return (
    <div className="space-y-6">
      {fields.map((field, idx) => {
        const fieldName = field.name || field.id || `field_${idx}`;
        const label = language === "en" ? field.label_en : field.label_es;
        const placeholder = language === "en" ? field.placeholder_en : field.placeholder_es;
        const value = values[fieldName] || "";

        return (
          <div key={fieldName} className="space-y-2">
            <label className="block text-sm font-medium text-white/90">
              {label} {field.required && <span className="text-red-400">*</span>}
            </label>

            {field.type === "textarea" && (
              <textarea
                value={value}
                onChange={(e) => onChange(fieldName, e.target.value)}
                placeholder={placeholder}
                rows={4}
                required={field.required}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all resize-none"
              />
            )}

            {field.type === "text" && (
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(fieldName, e.target.value)}
                placeholder={placeholder}
                required={field.required}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all"
              />
            )}

            {field.type === "select" && (
              <select
                value={value}
                onChange={(e) => onChange(fieldName, e.target.value)}
                required={field.required}
                className="w-full bg-[#1A1429] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]/50 transition-all appearance-none"
              >
                <option value="" disabled>
                  {language === "en" ? "Select an option..." : "Selecciona una opción..."}
                </option>
                {(language === "en" ? field.options_en : field.options_es)?.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === "toggle" && (
              <label className="flex items-center cursor-pointer mt-2 group relative">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={value === "true"}
                    onChange={(e) => onChange(fieldName, e.target.checked ? "true" : "false")}
                  />
                  <div className={`block w-12 h-6 rounded-full transition-colors ${value === "true" ? "bg-[var(--color-primary)]" : "bg-white/10"}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${value === "true" ? "transform translate-x-6" : ""}`}></div>
                </div>
                <span className="ml-3 text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                  {value === "true" 
                    ? (language === "en" ? "Yes" : "Sí") 
                    : (language === "en" ? "No" : "No")}
                </span>
              </label>
            )}
          </div>
        );
      })}

      <div className="pt-4 border-t border-white/5">
        <label className="block text-sm font-medium text-white/90 mb-3">
          {language === "en" ? "Output Generation Language" : "Idioma de Generación"}
        </label>
        <div className="flex items-center gap-6 text-sm text-white/70">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="responseLanguage"
              value="es"
              checked={responseLanguage === "es"}
              onChange={() => onChangeLanguage("es")}
              className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
            />
            <span>Español</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="responseLanguage"
              value="en"
              checked={responseLanguage === "en"}
              onChange={() => onChangeLanguage("en")}
              className="accent-[var(--color-primary)] w-4 h-4 cursor-pointer"
            />
            <span>English</span>
          </label>
        </div>
      </div>
    </div>
  );
}
