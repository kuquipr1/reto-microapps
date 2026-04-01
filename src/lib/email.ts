import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Usamos el cliente admin para poder leer configuraciones sin RLS bloqueos (ya que correrá del lado del servidor)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

export async function getSmtpTransport() {
  try {
    const supabaseAdmin = getAdminClient();
    const { data: config } = await supabaseAdmin.from('smtp_settings').select('*').single();

    if (!config || !config.is_verified) {
      return null;
    }

    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // true for 465, false for other ports
      auth: {
        user: config.username,
        pass: config.password,
      },
      tls: {
        // Enforce TLS fallback if not strictly matching certs for local development/test edges
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error("Error creating SMTP transport:", error);
    return null;
  }
}

export function buildEmailTemplate(options: {
  title: string;
  greeting: string;
  bodyLines: string[];
  ctaText?: string;
  ctaUrl?: string;
  footerText?: string;
}): string {
  const { title, greeting, bodyLines, ctaText, ctaUrl, footerText } = options;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050014; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #050014; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Card -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px; background-color: #0A0520; border: 1px solid rgba(79, 70, 229, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Logo pill -->
          <tr>
            <td align="center" style="padding: 40px 0 20px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background: linear-gradient(135deg, #7c3aed, #6d28d9, #ec4899); border-radius: 12px; padding: 8px 20px;">
                    <span style="color: #ffffff; font-size: 14px; font-weight: 800; letter-spacing: 2px;">✦ ADMINSMART 369</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 20px 40px 40px;">
              <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 24px; text-align: center;">${title}</h1>
              
              <p style="color: #e2e8f0; font-size: 16px; line-height: 24px; margin-top: 0; margin-bottom: 20px;">${greeting}</p>
              
              ${bodyLines.map(line => `<p style="color: rgba(255,255,255,0.7); font-size: 16px; line-height: 24px; margin-top: 0; margin-bottom: 20px;">${line}</p>`).join('')}
              
              <!-- CTA Button -->
              ${ctaText && ctaUrl ? `
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; margin-bottom: 10px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="background-color: #4F46E5; border-radius: 8px;">
                          <a href="${ctaUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; font-family: sans-serif;">${ctaText}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}
              
            </td>
          </tr>
          
          <!-- Dark minimal footer inside card -->
          <tr>
            <td style="background-color: rgba(0,0,0,0.3); padding: 20px 40px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05);">
              <p style="color: rgba(255,255,255,0.4); font-size: 12px; line-height: 18px; margin: 0;">
                ${footerText || 'Este email fue enviado automáticamente. Si tienes preguntas, contacta a soporte.'}
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Outside footer -->
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px;">
          <tr>
            <td align="center" style="padding-top: 20px;">
              <p style="color: rgba(255,255,255,0.2); font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} AdminSmart 369. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
        
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const transport = await getSmtpTransport();
    
    if (!transport) {
      return { success: false, message: 'SMTP no está configurado o verificado.' };
    }

    const { data: config } = await getAdminClient().from('smtp_settings').select('from_email, from_name').single();
    if (!config) throw new Error("Missing SMTP config in db");

    const info = await transport.sendMail({
      from: `"${config.from_name}" <${config.from_email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    return { success: true, message: `Email accepted. Prev: ${info.response}` };
  } catch (error: any) {
    console.error("Email send error:", error);
    return { success: false, message: error.message || "Unknown SMTP error" };
  }
}

export async function sendWelcomeEmail(options: {
  to: string;
  firstName: string;
  planName: string;
  password?: string;
  loginUrl: string;
}): Promise<{ success: boolean; message: string }> {
  
  const bodyLines = [
    `Tu plan <strong>${options.planName}</strong> ha sido activado exitosamente.`,
  ];

  if (options.password) {
    bodyLines.push(`Tus credenciales de acceso seguras y temporales son:<br/><br/>
    📧 <strong>Email:</strong> ${options.to}<br/>
    🔑 <strong>Contraseña:</strong> <span style="font-family: monospace; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px;">${options.password}</span><br/><br/>
    Recomendamos cambiar tu contraseña desde tu perfil al iniciar sesión.`);
  }

  bodyLines.push("Ya puedes acceder a todas las herramientas de Inteligencia Artificial incluidas en tu plan para potenciar tu negocio.");

  const html = buildEmailTemplate({
    title: "¡Bienvenido a AdminSmart 369!",
    greeting: `Hola ${options.firstName},`,
    bodyLines,
    ctaText: "Acceder al Portal",
    ctaUrl: options.loginUrl,
    footerText: "Este email fue enviado automáticamente. Si tienes dudas, contesta a este mensaje.",
  });

  return sendEmail({
    to: options.to,
    subject: "¡Tu acceso a AdminSmart 369 está listo! 🚀",
    html
  });
}
