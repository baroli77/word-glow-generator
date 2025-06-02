
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No stripe signature found');
    }

    const body = await req.text();
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    logStep("Event received", { type: event.type });

    // Only handle checkout.session.completed events
    if (event.type !== 'checkout.session.completed') {
      logStep("Ignoring event type", { type: event.type });
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    
    logStep("Processing checkout session", { 
      sessionId: session.id,
      customerEmail: session.customer_email,
      metadata: session.metadata 
    });

    const customerEmail = session.customer_email;
    if (!customerEmail) {
      logStep("No customer email found in session");
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Get the price_id from the line items
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const priceId = lineItems.data[0]?.price?.id;
    
    if (!priceId) {
      logStep("No price_id found in session");
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    logStep("Processing price_id", { priceId });

    // Map price_id to plan type and duration
    const priceMapping = {
      "price_1RVT86BfWiYNCeVOOPb189bF": { planType: "daily", hours: 24 },
      "price_1RVT8cBfWiYNCeVOk2SVsBMn": { planType: "weekly", days: 7 },
      "price_1RVT8zBfWiYNCeVOzqrUZT5m": { planType: "monthly", days: 30 },
      "price_1RVT9QBfWiYNCeVO0P0qGgpW": { planType: "lifetime", lifetime: true }
    };

    const planInfo = priceMapping[priceId as keyof typeof priceMapping];
    if (!planInfo) {
      logStep("Unknown price_id", { priceId });
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    logStep("Plan mapped", { planInfo });

    // Calculate expiry date
    let expiresAt: string;
    const now = new Date();
    
    if (planInfo.lifetime) {
      expiresAt = "9999-12-31T23:59:59Z";
    } else if (planInfo.hours) {
      now.setHours(now.getHours() + planInfo.hours);
      expiresAt = now.toISOString();
    } else if (planInfo.days) {
      now.setDate(now.getDate() + planInfo.days);
      expiresAt = now.toISOString();
    } else {
      logStep("Invalid plan configuration", { planInfo });
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    logStep("Calculated expiry", { expiresAt });

    // Initialize Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Find user by email
    const { data: userList, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      logStep("Error fetching users", { error: userError.message });
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const user = userList.users.find(u => u.email === customerEmail);
    if (!user) {
      logStep("User not found", { email: customerEmail });
      return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    logStep("User found", { userId: user.id, email: customerEmail });

    // Deactivate existing subscriptions
    const { error: deactivateError } = await supabaseAdmin
      .from('user_subscriptions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);

    if (deactivateError) {
      logStep("Error deactivating old subscriptions", { error: deactivateError.message });
    } else {
      logStep("Deactivated old subscriptions");
    }

    // Create new subscription record
    const { error: insertError } = await supabaseAdmin
      .from('user_subscriptions')
      .insert({
        user_id: user.id,
        plan_type: planInfo.planType,
        expires_at: expiresAt,
        is_active: true,
        subscription_cancelled: false,
        subscription_start: new Date().toISOString(),
        customer_id: session.customer?.toString() || null,
        subscription_id: session.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      logStep("Error creating subscription", { error: insertError.message });
      return new Response(JSON.stringify({ error: "Database error" }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    logStep("Subscription created successfully", { 
      userId: user.id, 
      planType: planInfo.planType, 
      expiresAt 
    });

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
