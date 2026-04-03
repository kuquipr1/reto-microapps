import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { platform, producto, oferta, publico, tono } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada." },
        { status: 401 }
      );
    }

    let constraints = "";
    if (platform === "Facebook") {
      constraints = `Genera un Ad Copy persuasivo para Facebook Ads. Debe incluir un Gancho fuerte, un Cuerpo atractivo, un Llamado a la Acción (CTA) y emojis apropiados.`;
    } else if (platform === "Instagram") {
      constraints = `Genera un Ad Copy super visual y conciso para Instagram Ads. Debe ser dinámico, incluir un buen CTA y una lista de 5 a 10 hashtags relevantes.`;
    } else if (platform === "Google") {
      constraints = `Genera copys para Google Ads (Search). Debes proporcionar 3 opciones de 'Título' (máximo 30 caracteres cada una) y 2 opciones de 'Descripción' (máximo 90 caracteres cada una).`;
    }

    const prompt = `Actúa como un Copywriter experto en publicidad digital y tráfico pago. 
Tu tarea es generar un texto para un anuncio de ${platform}.

**Datos del Producto/Campaña:**
- Producto o Servicio: ${producto}
- Oferta o Promoción: ${oferta}
- Público Objetivo: ${publico}
- Tono de voz: ${tono}

**Instrucciones específicas:**
${constraints}

Devuelve la salida ÚNICAMENTE en formato JSON plano con las siguientes reglas gráficas:
- Para Facebook e Instagram, usa las claves: "gancho", "cuerpo", "cta", "hashtags" (si aplica).
- Para Google, usa las claves: "titulos" (arreglo de strings) y "descripciones" (arreglo de strings).
No incluyas explicaciones, solo el JSON estructurado.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error?.message || "Error al conectar con OpenAI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || "{}";
    const parsedData = JSON.parse(resultText);

    return NextResponse.json({ result: parsedData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
