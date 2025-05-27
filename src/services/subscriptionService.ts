import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import type { PlanType } from '@/config/pricing';

export interface Subscription {
  id: string;
  plan_type: 'free' | 'daily' | 'monthly' | 'lifetime';
  expires_at: string | null;
  is_active: boolean;
  subscription_cancelled?: boolean;
}

export class SubscriptionService {
  private static instance: SubscriptionService;
  
  static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  async fetchUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return this.getDefaultFreeSubscription();
      }
      
      // Additional client-side expiry check for safety
      if (data && data.expires_at) {
        const isExpired = this.isSubscriptionExpired(data.expires_at);
        const shouldExpire = this.shouldExpireSubscription(data);

        if (isExpired && shouldExpire) {
          await this.deactivateSubscription(data.id);
          toast({
            title: "Subscription expired",
            description: "Your subscription has expired. You're now on the free tier.",
            variant: "destructive"
          });
          return this.getDefaultFreeSubscription();
        }
      }
      
      return data ? {
        id: data.id,
        plan_type: data.plan_type as 'free' | 'daily' | 'monthly' | 'lifetime',
        expires_at: data.expires_at,
        is_active: data.is_active,
        subscription_cancelled: data.subscription_cancelled
      } : this.getDefaultFreeSubscription();
    } catch (error) {
      console.error('Error in fetchUserSubscription:', error);
      return this.getDefaultFreeSubscription();
    }
  }

  async upgradeSubscription(userId: string, planType: 'daily' | 'monthly' | 'lifetime'): Promise<boolean> {
    try {
      let expiresAt = null;
      
      if (planType === 'daily') {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
      } else if (planType === 'monthly') {
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      // Deactivate current subscription
      await supabase
        .from('user_subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId);

      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_type: planType,
          expires_at: expiresAt?.toISOString(),
          is_active: true,
          subscription_cancelled: false
        });

      if (error) throw error;

      const planNames = {
        daily: '24-hour access',
        monthly: 'monthly plan',
        lifetime: 'lifetime access'
      };
      
      toast({
        title: "Subscription upgraded!",
        description: `You now have ${planNames[planType]}. Enjoy unlimited bio generation!`
      });
      
      return true;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast({
        title: "Upgrade failed",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    try {
      // Mark subscription as cancelled but keep it active until expiry
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          subscription_cancelled: true,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      toast({
        title: "Subscription cancelled",
        description: "Your subscription will remain active until the end of your billing period."
      });
      
      return true;
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Cancellation failed",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  }

  private async deactivateSubscription(subscriptionId: string): Promise<void> {
    await supabase
      .from('user_subscriptions')
      .update({ 
        is_active: false,
        plan_type: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId);
  }

  private isSubscriptionExpired(expiresAt: string): boolean {
    return new Date(expiresAt) < new Date();
  }

  private shouldExpireSubscription(subscription: any): boolean {
    // Daily plans should expire when past expiry time
    if (subscription.plan_type === 'daily') {
      return true;
    }
    
    // Monthly plans should only expire if cancelled and past expiry time
    if (subscription.plan_type === 'monthly') {
      return subscription.subscription_cancelled === true;
    }
    
    // Lifetime plans never expire
    if (subscription.plan_type === 'lifetime') {
      return false;
    }
    
    return false;
  }

  private getDefaultFreeSubscription(): Subscription {
    return {
      id: "default-free",
      plan_type: "free",
      expires_at: null,
      is_active: true,
      subscription_cancelled: false
    };
  }

  getRemainingTime(expiresAt: string | null): string | null {
    if (!expiresAt) return null;
    
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    const timeLeft = expirationDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  }

  getPlanDisplayName(planType: string, isAdminUser: boolean = false): string {
    if (isAdminUser) {
      return 'Admin (Unlimited)';
    }
    
    const names = {
      free: 'Free',
      daily: '24-Hour Access',
      monthly: 'Monthly Plan',
      lifetime: 'Lifetime Access'
    };
    
    return names[planType as keyof typeof names] || 'Free';
  }
}

export const subscriptionService = SubscriptionService.getInstance();
