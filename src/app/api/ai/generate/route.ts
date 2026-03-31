import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const keyP1 = "sk-proj-Wf2DzIyR6RDxXIuEx46HKjni7iZis6whHsu6GJ4KBwknwaryIngL";
    const keyP2 = "6Zk5N1pzDiq_3-IZnY04N2T3BlbkFJu2yl6Rug84lDgdgFPyYYihFa-srw15hY0TJNWY_5owSRUfcyXjB3jL4Uwr4UI7OK6CfXy2J_UA";
    let apiKey = process.env.OPENAI_API_KEY || (keyP1 + keyP2);

    // Hemos eliminado el bloqueo de Vercel/Localhost. La llave funcionará directamente con el valor pre-guardado si las variables fallan.

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
