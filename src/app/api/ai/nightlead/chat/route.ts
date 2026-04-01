import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, config } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada." },
        { status: 401 }
      );
    }

    const systemPrompt = `Eres "NightLead", un asistente nocturno especializado en capturar conversiones fuera del horario laboral para el gimnasio ${config.name}.
El horario de atención humana normal es: ${config.humanHours}.
Los planes y precios son: ${config.plans}.

Tu ÚNICO objetivo es calificar al usuario y recopilar la siguiente información:
1. Su Nombre.
2. Su Objetivo fitness (bajar de peso, aumento de masa, etc).
3. El Plan que más le interesa.

Reglas:
1. Hazlo como una conversación fluida, amable y amigable. Ej: "¡Hola! Mientras nuestro equipo descansa, yo con gusto te doy la información que necesites y te ayudo a agilizar tu registro."
2. NO seas un robot interrogador. Haz una pregunta a la vez. Responde sus dudas de precio e inmediatamente haz una pequeña pregunta para llevarlo a seguir hablando de sus objetivos.
3. EN EL MOMENTO en que tengas el Nombre, Objetivo y el Plan de interés, DEBES llamar INMEDIATAMENTE a la función "capture_lead".`;

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
        model: "gpt-4o-mini",
        messages: apiMessages,
        temperature: 0.4,
        tools: [
          {
            type: "function",
            function: {
              name: "capture_lead",
              description: "Guarda la información de un lead calificado cuando ya tienes su Nombre, Objetivo y Plan de interés",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Nombre del prospecto de manera clara, capitalizado" },
                  objective: { type: "string", description: "Breve resumen del objetivo fitness del prospecto" },
                  plan: { type: "string", description: "Plan en el que demostró interés" },
                  rating: { type: "string", enum: ["caliente", "tibio", "frío"], description: "Nivel de interés (si preguntó mucho es caliente)" }
                },
                required: ["name", "objective", "plan", "rating"]
              }
            }
          }
        ],
        tool_choice: "auto"
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
    const responseMessage = data.choices[0].message;

    // Intercept function calls
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      
      return NextResponse.json({
        result: `¡Excelente ${args.name}! He registrado tus datos 📝 y marcado tu interés en el plan ${args.plan}. A primera hora de la mañana el equipo se pondrá en contacto contigo para darte luz verde. ¡Que descanses! 🌙`,
        lead_captured: args
      });
    }

    return NextResponse.json({ result: responseMessage.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
