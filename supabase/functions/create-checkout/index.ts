
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    });
  }

  try {
    logStep("Function started");

    const { email, plan } = await req.json();
    
    if (!email || !plan) {
      logStep("Missing required fields", { email: !!email, plan: !!plan });
      return new Response(JSON.stringify({ error: "Missing email or plan" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Map plan to price ID
    const planToPriceId = {
      "24hr": Deno.env.get("STRIPE_PRICE_24H_ACCESS") || "price_1RVT86BfWiYNCeVOOPb189bF",
      "1week": Deno.env.get("STRIPE_PRICE_1WEEK_ACCESS") || "price_1RVT8cBfWiYNCeVOk2SVsBMn",
      "1month": Deno.env.get("STRIPE_PRICE_1MONTH_ACCESS") || "price_1RVT8zBfWiYNCeVOzqrUZT5m",
      "lifetime": Deno.env.get("STRIPE_PRICE_LIFETIME_ACCESS") || "price_1RVT9QBfWiYNCeVO0P0qGgpW"
    };

    const priceId = planToPriceId[plan as keyof typeof planToPriceId];
    
    if (!priceId) {
      logStep("Invalid plan", { plan, validPlans: Object.keys(planToPriceId) });
      return new Response(JSON.stringify({ error: "Invalid plan. Must be one of: 24hr, 1week, 1month, lifetime" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    logStep("Plan validated", { plan, priceId });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    
    // Check if customer exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    logStep("Creating checkout session", { plan, priceId, email });

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        plan_type: plan,
        email: email
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
