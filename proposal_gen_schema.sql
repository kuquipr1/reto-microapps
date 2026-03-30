INSERT INTO public.micro_apps (
  slug, icon, name_es, name_en, description_es, description_en, form_schema, autofill_presets, prompt_template
) VALUES (
  'proposal-gen',
  'Briefcase',
  'Generador de Propuestas',
  'Proposal Generator',
  'Crea propuestas comerciales profesionales y persuasivas para cerrar más ventas en minutos.',
  'Create professional and persuasive commercial proposals to close more sales in minutes.',
  $$[
    { "name": "client_name", "label_es": "Nombre del cliente o empresa", "label_en": "Client or Company Name", "type": "text", "required": true, "placeholder_es": "Ej: TechCorp Inc.", "placeholder_en": "Ex: TechCorp Inc." },
    { "name": "service", "label_es": "Servicio ofrecido", "label_en": "Service Offered", "type": "textarea", "required": true, "placeholder_es": "Ej: Rediseño completo de sitio web con e-commerce", "placeholder_en": "Ex: Full website redesign with e-commerce" },
    { "name": "benefits", "label_es": "Beneficios clave", "label_en": "Key Benefits", "type": "textarea", "required": true, "placeholder_es": "Ej: Aumento de la conversión, diseño moderno, carga ultrarrápida", "placeholder_en": "Ex: Increased conversion rate, modern design, ultra-fast loading" },
    { "name": "price", "label_es": "Inversión / Rango de precio", "label_en": "Investment / Price Range", "type": "text", "required": true, "placeholder_es": "Ej: $5,000 - $7,500 USD", "placeholder_en": "Ex: $5,000 - $7,500 USD" }
  ]$$::jsonb,
  $$[
    { "label_es": "Desarrollo Web", "label_en": "Web Development", "values": { "client_name": "TechCorp Inc", "service": "Rediseño completo de sitio web corporativo con Next.js y migración a la nube", "benefits": "Aumento de ventas online, diseño altamente profesional, carga ultrarrápida que beneficia el SEO", "price": "$8,500 USD" } },
    { "label_es": "Consultoría SEO", "label_en": "SEO Consulting", "values": { "client_name": "Clínica Dental Sonrisas", "service": "Auditoría SEO técnica, optimización on-page y posicionamiento local", "benefits": "Aparecer en la posición #1 de Google Maps, captar pacientes de forma orgánica, dominar la región", "price": "$1,200 USD/mes" } },
    { "label_es": "Redes Sociales", "label_en": "Social Media", "values": { "client_name": "Restaurante El Sabor", "service": "Gestión integral de Instagram y TikTok (15 posts mensuales premium)", "benefits": "Crear una comunidad fiel, aumentar reservas los fines de semana, potencial de contenido viral", "price": "$900 USD/mes" } },
    { "label_es": "Coaching Ejecutivo", "label_en": "Executive Coaching", "values": { "client_name": "Carlos M. (Startup CEO)", "service": "Programa de coaching ejecutivo de 3 meses enfocado en liderazgo", "benefits": "Toma de decisiones asertivas, reduccióndrástica del burnout, alineación estratégica del equipo", "price": "$3,500 USD" } },
    { "label_es": "Fotografía E-commerce", "label_en": "E-commerce Photography", "values": { "client_name": "Moda Express SRL", "service": "Sesión fotográfica de catálogo para la nueva colección de Verano 2026", "benefits": "Fotos de alta calidad para multiplicar el % de conversión, estética elegante, retoque fotográfico premium", "price": "$1,500 USD" } }
  ]$$::jsonb,
  $$GENERAL INSTRUCTIONS:
- You are an expert sales consultant and copywriter specialized in high-converting commercial B2B/B2C proposals.
- Your response must be EXCLUSIVELY in valid and clean Markdown format.
- Use headings (##, ###), bold (**text**), bulleted lists (-), and tables when appropriate.
- Structure your response clearly, making it organized, professional, and easy to read.
- Be persuasive, value-driven, and authoritative.
- Respond EXCLUSIVELY in the indicated language: **{{responseLanguage}}**.
- DO NOT include explanations about yourself or mention that you are an AI.
- DO NOT use HTML. Pure Markdown only.

SPECIFIC TASK: Generate a complete, professional, and convincing commercial proposal for a prospective client.

USER PARAMETERS:
- Client / Company Name: {{client_name}}
- Service Offered: {{service}}
- Key Benefits: {{benefits}}
- Target Investment / Price Range: {{price}}

REQUIRED STRUCTURE (MANDATORY TO FOLLOW EXACTLY):
Your generated proposal must follow this exact Markdown structure:

## Proposal for {{client_name}}
**Prepared for:** {{client_name}}

### 1. Executive Summary
[Write a persuasive summary of why we are the right choice and how we understand their needs.]

### 2. Proposed Service Scope
[Detail the exact service ({{service}}) being offered in clear, easily digestible bullet points.]

### 3. Key Benefits & ROI
[Expand on the benefits ({{benefits}}) provided by the user. Transform them into strong value propositions that highlight the return on investment.]

### 4. Investment & Terms
[Present the investment: {{price}} clearly and confidently. Do not sound apologetic about the price. Frame it as a strategic investment, not a cost.]

### 5. Next Steps
[Clear Call to Action on how the client can approve this proposal and formally start the project.]

---

At the end of the proposal, include a **Summary Table** (using Markdown) with 3 rows representing the most important milestones or deliverables for this specific project.$$
)
ON CONFLICT (slug) DO UPDATE SET 
  form_schema = EXCLUDED.form_schema,
  autofill_presets = EXCLUDED.autofill_presets,
  prompt_template = EXCLUDED.prompt_template,
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en;
