import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { logs } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada." },
        { status: 401 }
      );
    }

    if (!logs || logs.length === 0) {
      return NextResponse.json(
         { error: "No hay registros de clases para analizar." },
         { status: 400 }
      );
    }

    const prompt = `Actúa como el gerente de operaciones automatizado 'PulsoGym'.
Toma la siguiente información de los registros de clases de hoy en el gimnasio y analízala:

REGISTROS DE HOY:
${JSON.stringify(logs, null, 2)}

Tu objetivo es generar el REPORTE DIARIO EJECUTIVO que el dueño recibirá por WhatsApp a las 9 PM.
REGLAS ESTRICTAS:
1. El reporte debe tener MÁXIMO 10-12 líneas (es un mensaje rápido).
2. Tono: Directo, gerencial, profesional de fitness. Usa emojis relevantes (📊, 🚨, ✅, etc).
3. Incluye OBLIGATORIAMENTE:
   - Asistencia total del día.
   - Clase más y menos concurrida.
   - Rendimiento/Mención a los instructores.
   - Reporte inmediato de cualquier incidencia (si en el JSON hay quejas o máquinas rotas, ponlo como 🚨 ALERTA. Si no, di "Operación sin novedades").
   - Deten a tiempo anomalías (crea una breve conclusión simulando la tendencia vs "semana pasada").

NO escribas nada más aparte del mensaje que debe recibir el dueño.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
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
    return NextResponse.json({ result: data.choices[0]?.message?.content || "" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error en el servidor" }, { status: 500 });
  }
}
