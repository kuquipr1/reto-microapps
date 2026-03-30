-- Table: micro_apps
CREATE TABLE IF NOT EXISTS public.micro_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  name_es TEXT,
  name_en TEXT,
  description_es TEXT,
  description_en TEXT,
  form_schema JSONB DEFAULT '[]'::jsonb,
  autofill_presets JSONB DEFAULT '[]'::jsonb,
  prompt_template TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.micro_apps ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone logged in can view apps
CREATE POLICY "Users can view micro_apps" 
  ON public.micro_apps 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Optional: Policy for admins to insert/update (if needed in the future)
CREATE POLICY "Admins can manage micro_apps"
  ON public.micro_apps
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Insert the 'Secuencias de Email' app
INSERT INTO public.micro_apps (
  slug, icon, name_es, name_en, description_es, description_en, form_schema, autofill_presets, prompt_template
) VALUES (
  'email-sequence',
  'Mail',
  'Secuencias de Email',
  'Email Sequences',
  'Crea secuencias de correos persuasivos para lanzamientos o ventas en minutos.',
  'Create persuasive email sequences for launches or sales in minutes.',
  '[
    { "name": "product", "label_es": "Producto o Servicio", "label_en": "Product or Service", "type": "textarea", "required": true, "placeholder_es": "Ej: Curso online de marketing digital para principiantes", "placeholder_en": "Ex: Online digital marketing course for beginners" },
    { "name": "goal", "label_es": "Objetivo de la secuencia", "label_en": "Sequence Goal", "type": "select", "options_es": ["Venta directa", "Lanzamiento", "Webinar", "Onboarding"], "options_en": ["Direct Sale", "Launch", "Webinar", "Onboarding"], "required": true },
    { "name": "count", "label_es": "Número de emails", "label_en": "Number of emails", "type": "select", "options_es": ["3", "5", "7"], "options_en": ["3", "5", "7"], "required": true }
  ]'::jsonb,
  '[
    { "label_es": "Lanzamiento de Curso", "label_en": "Course Launch", "values": { "product": "Curso de Marketing Digital Avanzado de 6 semanas", "goal": "Lanzamiento", "count": "5" } },
    { "label_es": "SaaS Onboarding", "label_en": "SaaS Onboarding", "values": { "product": "Herramienta de gestión de proyectos y tareas para equipos remotos", "goal": "Onboarding", "count": "3" } },
    { "label_es": "Promo E-commerce", "label_en": "E-commerce Promo", "values": { "product": "Colección de zapatos minimalistas ecológicos", "goal": "Venta directa", "count": "3" } },
    { "label_es": "Invitación a Webinar", "label_en": "Webinar Invite", "values": { "product": "Masterclass gratuita: Cómo duplicar tus ventas en 30 días", "goal": "Webinar", "count": "5" } },
    { "label_es": "Venta Consultoría", "label_en": "Consulting Sale", "values": { "product": "Mentoría 1 a 1 de planificación financiera para emprendedores", "goal": "Venta directa", "count": "7" } }
  ]'::jsonb,
  'GENERAL INSTRUCTIONS:
- You are an expert copywriter specialized in persuasive email marketing and conversion.
- Your response must be EXCLUSIVELY in valid and clean Markdown format.
- Use headings (##, ###), bold (**text**), italics (*text*), bulleted lists (-), numbered lists (1.), and blockquotes (>) when appropriate.
- Structure your response clearly, making it organized and easy to read.
- Be strategic, empathetic, and constantly action-oriented.
- Respond EXCLUSIVELY in the indicated language: **{{responseLanguage}}**.
- DO NOT include explanations about yourself or mention that you are an AI.
- DO NOT use HTML. Pure Markdown only.

SPECIFIC TASK: Generate a complete and persuasive email sequence.

USER PARAMETERS:
- Product / Service: {{product}}
- Sequence Goal: {{goal}}
- Number of emails to generate: {{count}}

REQUIRED STRUCTURE (MANDATORY TO FOLLOW EXACTLY):
For each email in the sequence (generate exactly {{count}} emails), include the following Markdown structure:

## Email [Email Number]: [Brief Strategy/Purpose of the email]
**Subject:** [Write a magnetic, short subject line that generates high open rates]

[Email body, strategically designed according to the requested "Goal". Use short paragraphs (1-3 lines max) to facilitate mobile reading. Highlight important keywords in **bold**.]

**Call to Action (CTA):** [Clear instructions on what the reader should do next]

---

At the end of the email sequence, include a **Summary Table** (using Markdown) of all generated emails, indicating the email number, the proposed subject line, and the main goal of that specific message.
'
)
ON CONFLICT (slug) DO UPDATE SET 
  form_schema = EXCLUDED.form_schema,
  autofill_presets = EXCLUDED.autofill_presets,
  prompt_template = EXCLUDED.prompt_template,
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en;
