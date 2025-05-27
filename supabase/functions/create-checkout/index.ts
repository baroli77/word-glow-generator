
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { planType } = await req.json();
    
    // Get the authenticated user
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Check if customer exists
    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1,
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Define pricing
    const prices = {
      daily: { amount: 900, interval: 'day' as const, interval_count: 1 },
      monthly: { amount: 2900, interval: 'month' as const, interval_count: 1 },
      lifetime: { amount: 9900, interval: null, interval_count: null }
    };

    const priceConfig = prices[planType as keyof typeof prices];
    if (!priceConfig) {
      throw new Error("Invalid plan type");
    }

    // Create checkout session
    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      success_url: `${req.headers.get("origin")}/bio-generator?upgrade=success`,
      cancel_url: `${req.headers.get("origin")}/pricing`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
      },
    };

    if (planType === 'lifetime') {
      // One-time payment for lifetime
      sessionConfig.mode = "payment";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Lifetime Access - MakeMy.Bio",
              description: "Unlimited bio and cover letter generation forever",
            },
            unit_amount: priceConfig.amount,
          },
          quantity: 1,
        },
      ];
    } else {
      // Subscription for daily/monthly
      sessionConfig.mode = "subscription";
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan - MakeMy.Bio`,
              description: "Unlimited bio and cover letter generation",
            },
            unit_amount: priceConfig.amount,
            recurring: {
              interval: priceConfig.interval,
              interval_count: priceConfig.interval_count,
            },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
