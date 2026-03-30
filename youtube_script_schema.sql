INSERT INTO public.micro_apps (
  slug, icon, name_es, name_en, description_es, description_en, form_schema, autofill_presets, prompt_template
) VALUES (
  'youtube-script',
  'Video',
  'Guiones para YouTube',
  'YouTube Scripts',
  'Crea guiones altamente retenedores y virales para tus videos de YouTube.',
  'Create highly retentive and viral scripts for your YouTube videos.',
  $$[
    { "name": "topic", "label_es": "Tema del video", "label_en": "Video Topic", "type": "textarea", "required": true, "placeholder_es": "Ej: Las 5 mejores herramientas de IA en 2026", "placeholder_en": "Ex: Top 5 AI tools in 2026" },
    { "name": "audience", "label_es": "Audiencia objetivo", "label_en": "Target Audience", "type": "select", "options_es": ["Principiantes", "Expertos", "Emprendedores", "Inversores", "Creativos"], "options_en": ["Beginners", "Experts", "Entrepreneurs", "Investors", "Creatives"], "required": true },
    { "name": "duration", "label_es": "Duración estimada", "label_en": "Estimated Duration", "type": "select", "options_es": ["Menos de 5 minutos", "5 a 10 minutos", "Más de 10 minutos"], "options_en": ["Under 5 minutes", "5 to 10 minutes", "Over 10 minutes"], "required": true }
  ]$$::jsonb,
  $$[
    { "label_es": "Review Tecnológico", "label_en": "Tech Review", "values": { "topic": "Review honesto del nuevo MacBook M5: ¿Vale la pena la actualización?", "audience": "Principiantes", "duration": "5 a 10 minutos" } },
    { "label_es": "Tutorial Negocios", "label_en": "Business Tutorial", "values": { "topic": "Cómo empezar una agencia de IA sin escribir código en 2026", "audience": "Emprendedores", "duration": "Más de 10 minutos" } },
    { "label_es": "Análisis Cripto", "label_en": "Crypto Analysis", "values": { "topic": "El próximo Halving de Bitcoin: Por qué este ciclo es diferente", "audience": "Inversores", "duration": "Más de 10 minutos" } },
    { "label_es": "Reglas de Diseño", "label_en": "Design Rules", "values": { "topic": "7 errores graves de UI/UX que arruinan tu aplicación", "audience": "Creativos", "duration": "Menos de 5 minutos" } },
    { "label_es": "Noticias Tech", "label_en": "Tech News", "values": { "topic": "OpenAI lanza un nuevo modelo: Lo que los desarrolladores deben saber", "audience": "Expertos", "duration": "5 a 10 minutos" } }
  ]$$::jsonb,
  $$GENERAL INSTRUCTIONS:
- You are an expert YouTube scriptwriter and audience retention specialist.
- Your response must be EXCLUSIVELY in valid and clean Markdown format.
- Use headings (##, ###), bold (**text**), and tables when appropriate to structure the script.
- Structure your response clearly, dividing it into visual cues and audio cues.
- Focus heavily on the first 30 seconds (The Hook) to maximize viewer retention.
- Respond EXCLUSIVELY in the indicated language: **{{responseLanguage}}**.
- DO NOT include explanations about yourself or mention that you are an AI.
- DO NOT use HTML. Pure Markdown only.

SPECIFIC TASK: Generate a highly engaging and retentive YouTube video script.

USER PARAMETERS:
- Video Topic: {{topic}}
- Target Audience: {{audience}}
- Estimated Duration: {{duration}}

REQUIRED STRUCTURE (MANDATORY TO FOLLOW EXACTLY):
Your generated script must follow this exact Markdown structure:

## YouTube Script: [Write an engaging, highly clickable suggested Title here]
**Target Audience:** {{audience}} | **Target Duration:** {{duration}}

---

### Phase 1: The Hook (0:00 - 0:30)
*Crucial seconds to stop the viewer from clicking away and deliver the premise.*
- **Visual:** [Describe exactly what should be happening on screen to grab attention]
- **Audio:** [Write the exact words the host should say. Use **bold** for emphasis.]

### Phase 2: The Setup / Context
*Why the viewer should care and what value they will get.*
- **Visual:** [On-screen visuals / B-roll instructions]
- **Audio:** [Host dialogue]

### Phase 3: Main Content (Body)
*Deliver the value promised in the title.*
*(Repeat Visual/Audio bullet points for each main segment or point to cover during the video)*
- **Visual:** [...]
- **Audio:** [...]

### Phase 4: Call to Action & Outro
*Engage the viewer to like, subscribe, or watch a related video (end screen).*
- **Visual:** [...]
- **Audio:** [...]

---

At the end of the script, include a **Summary Table** (using Markdown) with 3 rows providing alternative highly-clickable Titles and matching Thumbnail conceptual ideas for this specific video.$$
)
ON CONFLICT (slug) DO UPDATE SET 
  form_schema = EXCLUDED.form_schema,
  autofill_presets = EXCLUDED.autofill_presets,
  prompt_template = EXCLUDED.prompt_template,
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en;
