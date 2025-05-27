
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Centralized pricing configuration
const PRICING_CONFIG = {
  daily: { amount: 900, interval: 'day' as const, interval_count: 1 },
  monthly: { amount: 2900, interval: 'month' as const, interval_count: 1 },
  lifetime: { amount: 9900, interval: null, interval_count: null }
};

const VALID_PLAN_TYPES = ['daily', 'monthly', 'lifetime'] as const;
type PlanType = typeof VALID_PLAN_TYPES[number];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting create-checkout function");
    
    // Check if Stripe secret key is available
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY environment variable is not set");
      throw new Error("Stripe configuration is missing. Please contact support.");
    }
    console.log("Stripe secret key found");

    const { planType } = await req.json();
    console.log("Plan type requested:", planType);
    
    // Validate plan type
    if (!VALID_PLAN_TYPES.includes(planType)) {
      throw new Error(`Invalid plan type: ${planType}`);
    }
    
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
      console.error("User authentication error:", userError);
      throw new Error("User not authenticated");
    }
    
    console.log("User authenticated:", user.email);

    const stripe = new Stripe(stripeSecretKey, {
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
      console.log("Existing customer found:", customerId);
    } else {
      console.log("No existing customer found, will create during checkout");
    }

    const priceConfig = PRICING_CONFIG[planType as PlanType];
    console.log("Creating checkout session for plan:", planType, "amount:", priceConfig.amount);

    // Get origin for redirect URLs
    const origin = req.headers.get("origin") || "https://id-preview--0556325d-6d42-4139-9d9a-797b034f7768.lovable.app";

    // Create checkout session
    const sessionConfig: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      success_url: `${origin}/bio-generator?upgrade=success`,
      cancel_url: `${origin}/pricing`,
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

    console.log("Creating Stripe checkout session with config:", JSON.stringify(sessionConfig, null, 2));

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log("Checkout session created successfully:", session.id);

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
      JSON.stringify({ 
        error: error.message || "Failed to create checkout session"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
