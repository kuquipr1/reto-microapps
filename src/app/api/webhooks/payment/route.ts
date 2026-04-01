import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // Initialize Supabase Admin client to bypass RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || ''
    );
    // 1. Authenticate the webhook request (Optional in development/simulator)
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = request.headers.get('x-webhook-secret');
      if (authHeader !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret' }, { status: 401 });
      }
    }

    // 2. Parse payload
    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const { event, customer, plan: planSlug, source, transaction_id, amount, currency } = payload;

    // 3. Validate required fields
    if (!event || !customer?.email || !source || !transaction_id) {
      return NextResponse.json({ error: 'Missing required payload fields' }, { status: 400 });
    }

    const email = customer.email.toLowerCase();

    // ==============================================
    // EVENT: subscription.cancelled
    // ==============================================
    if (event === 'subscription.cancelled') {
       const { data: user } = await supabaseAdmin.from('users').select('id').eq('email', email).single();
       
       if (!user) {
         // User not found, log as ignored
         await supabaseAdmin.from('webhook_logs').insert({
            source, event_type: event, raw_payload: payload, normalized_payload: payload,
            status: 'ignored', error_message: 'User email not found for cancellation'
         });
         return NextResponse.json({ success: true, message: 'User not found, ignored.' }, { status: 200 });
       }

       // Untie the plan
       await supabaseAdmin.from('users').update({ plan_id: null, plan_source: source, plan_assigned_at: new Date().toISOString() }).eq('id', user.id);
       
       // Log cancellation
       await supabaseAdmin.from('webhook_logs').insert({
          source, event_type: event, user_id: user.id, raw_payload: payload, normalized_payload: payload, status: 'processed'
       });

       return NextResponse.json({ success: true, user_id: user.id, plan_removed: true }, { status: 200 });
    }

    // ==============================================
    // EVENT: payment.completed
    // ==============================================
    if (event === 'payment.completed') {
      if (!planSlug || !customer.first_name || !customer.last_name) {
         return NextResponse.json({ error: 'Missing first_name, last_name, or plan' }, { status: 400 });
      }

      // 4. Look up Plan
      const { data: planData } = await supabaseAdmin.from('plans').select('id, name_es').eq('slug', planSlug).single();
      
      if (!planData) {
        await supabaseAdmin.from('webhook_logs').insert({
          source, event_type: event, raw_payload: payload, normalized_payload: payload,
          status: 'failed', error_message: `Plan slug '${planSlug}' not found`
        });
        return NextResponse.json({ error: `Plan slug '${planSlug}' not found in database` }, { status: 400 });
      }

      // 5. Check if user exists
      const { data: userExists } = await supabaseAdmin.from('users').select('id').eq('email', email).maybeSingle();
      
      let userId = userExists?.id;
      let isNewUser = false;
      let generatedPwd = null;

      if (!userId) {
        // Create new identity
        generatedPwd = Math.random().toString(36).slice(-8); // 8-char alphanumeric
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: generatedPwd,
          email_confirm: true,
          user_metadata: { first_name: customer.first_name, last_name: customer.last_name }
        });

        if (authError || !authUser.user) {
          return NextResponse.json({ error: `Auth Error: ${authError?.message}` }, { status: 500 });
        }
        
        userId = authUser.user.id;
        isNewUser = true;
      }

      // Update the user profile with the purchased plan
      await supabaseAdmin.from('users').update({
        plan_id: planData.id,
        plan_source: source,
        plan_assigned_at: new Date().toISOString()
      }).eq('id', userId);

      // Log success
      await supabaseAdmin.from('webhook_logs').insert({
        source, event_type: event, user_id: userId, plan_id: planData.id,
        raw_payload: payload, normalized_payload: payload, status: 'processed'
      });

      // Send Welcome Email
      let emailSent = false;
      try {
        const loginUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-domain.vercel.app';
        const emailRes = await sendWelcomeEmail({
          to: email,
          firstName: customer.first_name,
          planName: planData.name_es || planSlug, // name_es isn't selected, so fallback to slug or we should fetch name_es
          password: isNewUser ? generatedPwd || undefined : undefined,
          loginUrl
        });
        emailSent = emailRes.success;
      } catch (emailErr) {
        console.error("Non-fatal error sending welcome email:", emailErr);
      }

      return NextResponse.json({
        success: true,
        user_id: userId,
        plan_assigned: planSlug,
        is_new_user: isNewUser,
        generated_password: isNewUser ? generatedPwd : null,
        email_sent: emailSent
      }, { status: 200 });
    }

    // Fallback unsupported event
    return NextResponse.json({ error: `Unsupported event type: ${event}` }, { status: 400 });
    
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMsg }, { status: 500 });
  }
}
