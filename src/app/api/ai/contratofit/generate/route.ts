import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { 
      gymName,
      memberName, 
      plan, 
      price, 
      startDate, 
      services, 
      specialClauses 
    } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "La llave de OpenAI (OPENAI_API_KEY) no está configurada." },
        { status: 401 }
      );
    }

    const prompt = `Actúa como un experto legal en contratos para la industria del fitness. 
Genera un Contrato de Prestación de Servicios y Membresía estrictamente profesional para el gimnasio "${gymName}".

DEBES usar los siguientes datos EXACTAMENTE como se proveen:
- Nombre del Miembro: ${memberName}
- Plan Elegido: ${plan}
- Precio Acordado: ${price}
- Fecha de Inicio: ${startDate}
- Servicios Incluidos: ${services.join(', ') || 'Solo acceso general'}
- Cláusulas Especiales o Notas Adicionales: ${specialClauses || 'Ninguna'}

REGLAS DE FORMATO (Markdown):
1. Títulos en Markdown (#, ##).
2. Lenguaje sumamente formal legal. 
3. Secciones sugeridas: Declaraciones, Objeto del Contrato, Vigencia, Pago, Servicios Autorizados, Reglas de Convivencia, Cláusulas Especiales (si aplican), Liberación de Responsabilidad (Waiver), y Firmas al final.
4. Redacta el contrato listo para ser firmado por "EL GIMNASIO" y "EL MIEMBRO". No incluyas notas explicativas tuyas, SOLO el texto del contrato de principio a fin.
5. Adapta las cláusulas dependiendo de los servicios incluidos (por ejemplo, si incluyó "Área de pesas", menciónalo; si "Alberca", menciona reglas breves de alberca).`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2, // very deterministic for legal docs
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
