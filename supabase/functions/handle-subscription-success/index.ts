
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[HANDLE-SUBSCRIPTION-SUCCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { session_id } = await req.json();
    if (!session_id) {
      throw new Error('No session_id provided');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['customer']
    });

    logStep("Retrieved checkout session", { sessionId: session_id });

    if (!session.customer) {
      throw new Error('Session does not contain customer data');
    }

    const customer = session.customer as Stripe.Customer;
    const planType = session.metadata?.plan_type;

    if (!planType) {
      throw new Error('No plan type found in session metadata');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find user by email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', customer.email)
      .single();

    if (profileError || !profile) {
      throw new Error('User not found');
    }

    logStep("Found user profile", { userId: profile.id });

    // Calculate expiry based on plan type
    const subscriptionStart = new Date();
    let expiresAt = null;

    switch (planType) {
      case 'daily':
        expiresAt = new Date(subscriptionStart.getTime() + 24 * 60 * 60 * 1000); // 24 hours
        break;
      case 'weekly':
        expiresAt = new Date(subscriptionStart.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        break;
      case 'monthly':
        expiresAt = new Date(subscriptionStart.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        break;
      case 'lifetime':
        expiresAt = null; // No expiry
        break;
      default:
        throw new Error(`Invalid plan type: ${planType}`);
    }

    logStep("Processing subscription", { 
      planType, 
      subscriptionStart, 
      expiresAt,
      customerId: customer.id 
    });

    // Deactivate existing subscriptions
    await supabaseAdmin
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', profile.id);

    // Insert new subscription
    const { error: insertError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: profile.id,
        plan_type: planType,
        subscription_id: session.id,
        customer_id: customer.id,
        subscription_start: subscriptionStart.toISOString(),
        expires_at: expiresAt?.toISOString(),
        is_active: true,
        subscription_cancelled: false
      });

    if (insertError) {
      throw new Error(`Failed to insert subscription: ${insertError.message}`);
    }

    logStep("Subscription successfully stored");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Subscription activated successfully',
        plan_type: planType,
        expires_at: expiresAt?.toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
