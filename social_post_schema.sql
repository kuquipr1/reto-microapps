INSERT INTO public.micro_apps (
  slug, icon, name_es, name_en, description_es, description_en, form_schema, autofill_presets, prompt_template
) VALUES (
  'social-post',
  'Share2',
  'Posts para Redes',
  'Social Media Posts',
  'Crea publicaciones atractivas y virales para tus redes sociales en segundos.',
  'Create engaging and viral posts for your social media in seconds.',
  $$[
    { "name": "topic", "label_es": "Mensaje principal", "label_en": "Main Message", "type": "textarea", "required": true, "placeholder_es": "Ej: Lanzamiento de nuestro nuevo curso online", "placeholder_en": "Ex: Launch of our new online course" },
    { "name": "platform", "label_es": "Plataforma", "label_en": "Platform", "type": "select", "options_es": ["LinkedIn", "Twitter/X", "Instagram", "Facebook", "Threads"], "options_en": ["LinkedIn", "Twitter/X", "Instagram", "Facebook", "Threads"], "required": true },
    { "name": "tone", "label_es": "Tono de voz", "label_en": "Tone of voice", "type": "select", "options_es": ["Profesional", "Inspirador", "Polémico", "Divertido", "Educativo"], "options_en": ["Professional", "Inspiring", "Controversial", "Funny", "Educational"], "required": true }
  ]$$::jsonb,
  $$[
    { "label_es": "Historia LinkedIn", "label_en": "LinkedIn Story", "values": { "topic": "Aprender programación cambió mi vida a los 30 años después de trabajar en hotelería", "platform": "LinkedIn", "tone": "Inspirador" } },
    { "label_es": "Opinión Polémica X", "label_en": "Controversial X Opinion", "values": { "topic": "El trabajo 100% remoto está arruinando la cultura de las empresas jóvenes si no se gestiona bien", "platform": "Twitter/X", "tone": "Polémico" } },
    { "label_es": "Lanzamiento IG", "label_en": "IG Launch", "values": { "topic": "Estamos lanzando nuestra nueva app móvil de finanzas personales", "platform": "Instagram", "tone": "Divertido" } },
    { "label_es": "Tip Educativo", "label_en": "Educational Tip", "values": { "topic": "3 extensiones secretas de Google Chrome que duplican mi productividad", "platform": "LinkedIn", "tone": "Educativo" } },
    { "label_es": "Pregunta Facebook", "label_en": "Facebook Question", "values": { "topic": "Día del libro: pidiendo recomendaciones a nuestra comunidad", "platform": "Facebook", "tone": "Divertido" } }
  ]$$::jsonb,
  $$GENERAL INSTRUCTIONS:
- You are an expert social media manager and viral copywriter.
- Your response must be EXCLUSIVELY in valid and clean Markdown format.
- Use headings (##, ###), blockquotes (>), bold (**text**), and lists when appropriate.
- Structure your response clearly, making it easy to skim on mobile devices.
- Include highly relevant emojis naturally based on the tone.
- Respond EXCLUSIVELY in the indicated language: **{{responseLanguage}}**.
- DO NOT include explanations about yourself or mention that you are an AI.
- DO NOT use HTML. Pure Markdown only.

SPECIFIC TASK: Generate a highly engaging social media post.

USER PARAMETERS:
- Main Message / Topic: {{topic}}
- Target Platform: {{platform}}
- Tone of Voice: {{tone}}

REQUIRED STRUCTURE (MANDATORY TO FOLLOW EXACTLY):
Your generated post must follow this exact Markdown structure:

## Post for {{platform}}
**Tone:** {{tone}}

***

[Write the complete text of the social media post specifically optimized for the unique constraints, format, and audience behavior of {{platform}}. 
Ensure you start with a powerful "hook" in the very first sentence to stop the scroll. 
Use short, punchy paragraphs (1-3 lines max) to facilitate mobile reading. 
End the post with a clear, engaging Call to Action (CTA) that encourages comments or shares.]

***

### Hashtags
[Include a list of 5-8 highly relevant hashtags specifically researched for this platform]$$
)
ON CONFLICT (slug) DO UPDATE SET 
  form_schema = EXCLUDED.form_schema,
  autofill_presets = EXCLUDED.autofill_presets,
  prompt_template = EXCLUDED.prompt_template,
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en;
