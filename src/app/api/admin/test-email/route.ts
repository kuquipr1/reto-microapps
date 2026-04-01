import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import { buildEmailTemplate } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!
    );

    // 1. Verify admin role
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ success: false, message: 'Missing Authorization header' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { data: userRecord } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single();
    if (userRecord?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    // 2. Parse payload
    const body = await request.json();
    const { host, port, username, password, from_email, from_name, test_recipient } = body;

    if (!host || !port || !username || !password || !from_email || !test_recipient) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // 3. Clean password for annoying trailing spaces common in app-passwords
    const cleanPassword = password.replace(/\s+/g, '');

    // 4. Create testing transport
    const transport = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: {
        user: username,
        pass: cleanPassword
      },
      tls: { rejectUnauthorized: false }
    });

    // 5. Test sending
    const testHtml = buildEmailTemplate({
      title: "✅ Test Email — SMTP Configuration Working",
      greeting: "Hello Admin,",
      bodyLines: [
        "Your email configuration is working perfectly!",
        "AdminSmart 369 is now capable of securely delivering welcome emails and platform notifications using these credentials."
      ],
      footerText: "Automated test message from AdminSmart 369."
    });

    try {
      const info = await transport.sendMail({
        from: `"${from_name || 'My AI Portal'}" <${from_email}>`,
        to: test_recipient,
        subject: "✅ Test Email — SMTP Configuration Working",
        html: testHtml,
      });

      // SUCCESS! Safe to save.
      // 6. DB Upsert logic since it's a singleton settings table.
      // Usually we just UPDATE if row exists, or insert if not. Let's do a hard insert or update:
      const { data: existing } = await supabaseAdmin.from('smtp_settings').select('id').limit(1).single();

      if (existing?.id) {
        await supabaseAdmin.from('smtp_settings').update({
          host, port: Number(port), username, password: cleanPassword, 
          from_email, from_name, is_verified: true, verified_at: new Date().toISOString()
        }).eq('id', existing.id);
      } else {
        await supabaseAdmin.from('smtp_settings').insert({
          host, port: Number(port), username, password: cleanPassword, 
          from_email, from_name, is_verified: true, verified_at: new Date().toISOString()
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Email sent and settings saved", 
        smtp_response: info.response 
      }, { status: 200 });

    } catch (smtpErr: any) {
      return NextResponse.json({ 
        success: false, 
        message: smtpErr.message || 'SMTP Authentication or Connection failed', 
        error_code: smtpErr.code 
      }, { status: 400 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal error' }, { status: 500 });
  }
}
