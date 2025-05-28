
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

    // Verify webhook signature (you should set STRIPE_WEBHOOK_SECRET in your secrets)
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    logStep("Event received", { type: event.type });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        logStep("Processing subscription update", { 
          subscriptionId: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: subscription.cancel_at_period_end 
        });

        // Update subscription in database
        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            subscription_cancelled: subscription.cancel_at_period_end,
            cancel_requested: subscription.cancel_at_period_end,
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id);

        if (error) {
          logStep("Error updating subscription", { error: error.message });
        } else {
          logStep("Subscription updated successfully");
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        logStep("Processing subscription deletion", { subscriptionId: subscription.id });

        // Deactivate subscription and move to free plan
        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .update({
            is_active: false,
            plan_type: 'free',
            subscription_cancelled: true,
            updated_at: new Date().toISOString()
          })
          .eq('subscription_id', subscription.id);

        if (error) {
          logStep("Error deactivating subscription", { error: error.message });
        } else {
          logStep("Subscription deactivated successfully");
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          logStep("Processing successful payment", { 
            subscriptionId: invoice.subscription,
            amount: invoice.amount_paid 
          });

          // Ensure subscription is active
          const { error } = await supabaseAdmin
            .from('user_subscriptions')
            .update({
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq('subscription_id', invoice.subscription);

          if (error) {
            logStep("Error updating subscription after payment", { error: error.message });
          } else {
            logStep("Subscription updated after successful payment");
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

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
