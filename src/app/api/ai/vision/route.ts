import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64, fields } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada." },
        { status: 401 }
      );
    }

    if (!imageBase64 || !fields || fields.length === 0) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: imageBase64 o fields." },
        { status: 400 }
      );
    }

    const prompt = `Extrae los siguientes campos de esta ficha de inscripción de gimnasio: ${fields.join(', ')}. Devuelve la salida ÚNICAMENTE en formato JSON plano donde las claves son los campos solicitados y los valores son la información extraída. Si un campo no está presente, devuelve "No especificado". No incluyas explicaciones ni bloques de markdown (markdown code blocks), solo el objeto JSON válido.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageBase64 } }
            ]
          }
        ],
        temperature: 0.1,
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
    let resultText = data.choices[0]?.message?.content || "{}";
    
    let parsedData = {};
    try {
      parsedData = JSON.parse(resultText);
    } catch(e) {
      console.error("Failed to parse JSON", resultText);
      return NextResponse.json({ error: "La IA no devolvió un JSON válido" }, { status: 500 });
    }

    return NextResponse.json({ result: parsedData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
