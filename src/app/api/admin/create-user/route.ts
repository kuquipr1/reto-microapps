import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || ''
    );
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Missing auth header' }, { status: 401 });
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { data: adminRecord } = await supabaseAdmin.from('users').select('role').eq('id', user.id).single();
    if (adminRecord?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, first_name, last_name, plan_id, password } = await request.json();

    if (!email || !first_name || !last_name) {
      return NextResponse.json({ error: 'Missing required user fields' }, { status: 400 });
    }

    // 1. Create auth user
    const { data: newAuthUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name }
    });

    if (authErr || !newAuthUser.user) {
      return NextResponse.json({ error: authErr?.message || 'Error creating user' }, { status: 500 });
    }

    const userId = newAuthUser.user.id;

    // 2. Assign plan if provided
    let planData = null;
    if (plan_id) {
      const { data: p } = await supabaseAdmin.from('plans').select('id, name_en, name_es, slug').eq('id', plan_id).single();
      planData = p;

      await supabaseAdmin.from('users').update({
        plan_id: plan_id,
        plan_source: 'manual_admin',
        plan_assigned_at: new Date().toISOString()
      }).eq('id', userId);
      
      // Log it
      await supabaseAdmin.from('webhook_logs').insert({
        source: 'manual_admin', event_type: 'payment.completed', user_id: userId, plan_id: plan_id, status: 'processed'
      });
    }

    // 3. Send Welcome Email
    let emailSent = false;
    try {
      const planName = planData ? (planData.name_es || planData.slug) : 'Acceso Básico';
      const loginUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-domain.vercel.app';
      
      const emailRes = await sendWelcomeEmail({
        to: email,
        firstName: first_name,
        planName,
        password,
        loginUrl
      });
      emailSent = emailRes.success;
    } catch (emailErr) {
      console.error("Non-fatal email error in create-user:", emailErr);
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: userId, email }, 
      email_sent: emailSent 
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
