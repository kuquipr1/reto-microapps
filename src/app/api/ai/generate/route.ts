import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    let apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      try {
        const fs = require('fs');
        const path = require('path');
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, 'utf8');
          const match = envContent.match(/OPENAI_API_KEY="(.*?)"/);
          if (match && match[1]) {
            apiKey = match[1];
          }
        }
      } catch (e) {
        // Ignorar errores locales y fallback al mensaje de Vercel
      }
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "ERROR VERCEL-NUBE: Vercel sigue sin encontrar tu llave. ¿Ya te aseguraste de hacer el Redeploy?" },
        { status: 500 }
      );
    }

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

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
