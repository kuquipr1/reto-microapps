-- Insertar la nueva micro-app 'bio-gen'
INSERT INTO public.micro_apps (
  slug, icon, name_es, name_en, description_es, description_en, form_schema, autofill_presets, prompt_template
) VALUES (
  'bio-gen',
  'Briefcase',
  'Generador de Bio Profesional',
  'Professional Bio Generator',
  'Crea una presentación profesional y pulida para LinkedIn o tu portafolio en segundos.',
  'Create a professional and polished bio for LinkedIn or your portfolio in seconds.',
  '[
    { "name": "fullName", "label_es": "Nombre Completo", "label_en": "Full Name", "type": "text", "required": true, "placeholder_es": "Ej: Juan Pérez", "placeholder_en": "Ex: John Doe" },
    { "name": "profession", "label_es": "Profesión/Rol", "label_en": "Profession/Role", "type": "text", "required": true, "placeholder_es": "Ej: Desarrollador Backend", "placeholder_en": "Ex: Backend Developer" },
    { "name": "experience", "label_es": "Años de Experiencia", "label_en": "Years of Experience", "type": "select", "options_es": ["0-2 años", "3-5 años", "5-10 años", "Más de 10 años"], "options_en": ["0-2 years", "3-5 years", "5-10 years", "10+ years"], "required": true },
    { "name": "skills", "label_es": "Habilidades Clave (3-5)", "label_en": "Key Skills (3-5)", "type": "textarea", "required": true, "placeholder_es": "Ej: Node.js, Liderazgo, Agile", "placeholder_en": "Ex: Node.js, Leadership, Agile" },
    { "name": "tone", "label_es": "Tono", "label_en": "Tone", "type": "select", "options_es": ["Formal", "Inspirador", "Directo y Orientado a Resultados"], "options_en": ["Formal", "Inspiring", "Direct and Results-Oriented"], "required": true }
  ]'::jsonb,
  '[
    { "label_es": "Ingeniero de Software", "label_en": "Software Engineer", "values": { "fullName": "Maribel Rojas", "profession": "Ingeniera de Software Senior", "experience": "5-10 años", "skills": "React, Node.js, Arquitectura de Sistemas, Mentoría", "tone": "Inspirador" } },
    { "label_es": "Director de Marketing", "label_en": "Marketing Director", "values": { "fullName": "Carlos Mendez", "profession": "Director de Marketing Digital", "experience": "Más de 10 años", "skills": "Estrategia SEM/SEO, Inbound Marketing, Gestión de Presupuestos", "tone": "Directo y Orientado a Resultados" } }
  ]'::jsonb,
  'GENERAL INSTRUCTIONS:
- You are an expert Copywriter and HR professional specialized in LinkedIn profiles and personal branding.
- Your response must be EXCLUSIVELY in valid and clean Markdown format.
- Structure your response clearly using paragraphs, bold text for emphasis, and bullet points if necessary.
- Respond EXCLUSIVELY in the indicated language: **{{responseLanguage}}**.
- DO NOT include explanations about yourself or mention that you are an AI.
- DO NOT use HTML. Pure Markdown only.

SPECIFIC TASK: Generate a highly professional, engaging, and polished biography for the user. It should be ready to be pasted on LinkedIn or a personal portfolio.

USER PARAMETERS:
- Name: {{fullName}}
- Profession: {{profession}}
- Experience: {{experience}}
- Key Skills: {{skills}}
- Tone: {{tone}}

REQUIRED STRUCTURE (MANDATORY TO FOLLOW EXACTLY):
1. A **Headline** (short, catchy, 1-line tag).
2. The **Summary/About Me** section (1-2 paragraphs). It must be engaging, highlight the years of experience, and establish authority.
3. A **What I Bring to the Table** section with a bulleted list (-) of the key skills provided, expanded slightly into actionable traits.
4. A **Closing Statement** indicating readiness for networking or a short visionary sentence.'
)
ON CONFLICT (slug) DO UPDATE SET 
  form_schema = EXCLUDED.form_schema,
  autofill_presets = EXCLUDED.autofill_presets,
  prompt_template = EXCLUDED.prompt_template,
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en,
  description_es = EXCLUDED.description_es,
  description_en = EXCLUDED.description_en,
  icon = EXCLUDED.icon;

-- Asignar la app a los planes "professional" y "enterprise"
-- Ojo: asume que las tablas se llaman plans y plan_apps, como en Reto 03.
INSERT INTO public.plan_apps (plan_id, app_id)
SELECT p.id, a.id
FROM public.plans p, public.micro_apps a
WHERE p.slug IN ('professional', 'enterprise')
  AND a.slug = 'bio-gen'
ON CONFLICT (plan_id, app_id) DO NOTHING;
