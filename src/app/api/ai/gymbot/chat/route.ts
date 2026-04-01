import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, knowledgeBase } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada." },
        { status: 401 }
      );
    }

    const { name, plans, schedule, policies, faqs } = knowledgeBase;

    const systemPrompt = `Eres un asistente virtual hiper-eficiente, servicial y amigable para el gimnasio "${name || 'Gimnasio'}".
Tu misión es resolver dudas rápidas para los miembros o prospectos, ayudando a descargar de trabajo al equipo de recepción.
Responde de forma concisa y SIEMPRE básate en la siguiente información de la base de conocimiento del gimnasio. 
Si preguntan algo que no esté aquí, responde educadamente que tu conocimiento es limitado sobre ese tema y pídeles esperar a que un humano del staff les atienda.

--- BASE DE CONOCIMIENTO ---
PLANES Y PRECIOS:
${plans || 'No especificados'}

HORARIOS:
${schedule || 'No especificados'}

POLÍTICAS (Cancelaciones, congelamientos, etc.):
${policies || 'No especificadas'}

PREGUNTAS FRECUENTES ADICIONALES:
${faqs || 'No especificadas'}
-----------------------------

Reglas extra:
- Mantén un tono motivacional, adecuado para fitness.
- Usa emojis moderadamente pero sin exagerar.
- Ve directo al grano.`;

    const apiMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content }))
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // fast and cheap for chat
        messages: apiMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Error de conexión con OpenAI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || "";

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
