import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { nicho, publico, tono, pilares } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada en las Variables de Entorno." },
        { status: 401 }
      );
    }

    const prompt = `Actúa como un Social Media Manager Senior, especializado en crear estrategias para pequeñas Agencias de Marketing Digital. Crea un calendario de contenido de 30 días EXCLUSIVO para Facebook, para un cliente en el nicho de "${nicho}", dirigido a "${publico}" con un tono "${tono}". Distribuye el contenido para abarcar los siguientes pilares: "${pilares}". 
Devuélveme exclusivamente un objeto JSON con una propiedad "dias" que contenga un arreglo de 30 objetos. Cada objeto debe tener la siguiente estructura exacta:
{
  "dia": 1,
  "tipo": "Reel, Carrusel, Imagen estática, Encuesta, etc.",
  "tema": "De qué trata la publicación",
  "gancho": "La primera línea o gancho del copy",
  "horario": "18:00 (horario sugerido en base al público y plataforma)",
  "objetivo": "Interacción, Leads, Venta, Reconocimiento, etc."
}`;

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
    const resultText = data.choices[0]?.message?.content || "";
    const parsedData = JSON.parse(resultText);

    return NextResponse.json({ result: parsedData.dias });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
