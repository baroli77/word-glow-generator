
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";

interface Subscription {
  id: string;
  plan_type: 'free' | 'daily' | 'monthly' | 'lifetime';
  expires_at: string | null;
  is_active: boolean;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [usageCount, setUsageCount] = useState(0);

  // Check if user is admin
  const isAdminUser = user?.email === 'obarton77@gmail.com';

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Admin users get automatic lifetime access
    if (isAdminUser) {
      setSubscription({
        id: "admin-access",
        plan_type: "lifetime",
        expires_at: null,
        is_active: true
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Check if subscription has expired
      if (data && data.expires_at) {
        const expiresAt = new Date(data.expires_at);
        const now = new Date();
        
        if (now > expiresAt) {
          // Deactivate expired subscription
          await supabase
            .from('user_subscriptions')
            .update({ is_active: false })
            .eq('id', data.id);
          
          // Set to default free subscription
          setSubscription({
            id: "default-free",
            plan_type: "free",
            expires_at: null,
            is_active: true
          });
          
          toast({
            title: "Subscription expired",
            description: "Your subscription has expired. You're now on the free tier.",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (data) {
        setSubscription({
          id: data.id,
          plan_type: data.plan_type as 'free' | 'daily' | 'monthly' | 'lifetime',
          expires_at: data.expires_at,
          is_active: data.is_active
        });
      } else {
        // No subscription found - assign default free subscription
        setSubscription({
          id: "default-free",
          plan_type: "free",
          expires_at: null,
          is_active: true
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Fallback to free subscription on error
      setSubscription({
        id: "default-free",
        plan_type: "free",
        expires_at: null,
        is_active: true
      });
    } finally {
      setLoading(false);
    }
  }, [user, isAdminUser]);

  const fetchUsageCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('tool_type', 'bio_generator');

      if (error) throw error;
      setUsageCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching usage count:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSubscription();
      fetchUsageCount();
    } else {
      setSubscription(null);
      setUsageCount(0);
      setLoading(false);
    }
  }, [user, fetchSubscription]);

  // Set up automatic revalidation for daily subscriptions
  useEffect(() => {
    if (!subscription || subscription.plan_type !== 'daily' || !subscription.expires_at) {
      return;
    }

    const interval = setInterval(async () => {
      const expiresAt = new Date(subscription.expires_at!);
      const now = new Date();
      
      if (now > expiresAt) {
        await fetchSubscription(); // This will handle the expiration
      }
    }, 10 * 60 * 1000); // Check every 10 minutes

    return () => clearInterval(interval);
  }, [subscription, fetchSubscription]);

  const canUseTool = async (toolType: 'cover_letter' | 'bio_generator'): Promise<boolean> => {
    if (!user) return false;

    // Admin users have unlimited access
    if (isAdminUser) {
      return true;
    }

    // If user has an active paid subscription, they can use the tool
    if (subscription && subscription.plan_type !== 'free') {
      return true;
    }

    // For free users, check if they've used their allocation
    if (toolType === 'bio_generator') {
      return usageCount < 1;
    }

    return false;
  };

  const recordUsage = async (toolType: 'cover_letter' | 'bio_generator') => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tool_usage')
        .insert({
          user_id: user.id,
          tool_type: toolType
        });

      if (error) throw error;
      
      // Refresh usage count
      await fetchUsageCount();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  const upgradeSubscription = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) return false;

    // Prevent downgrades
    if (subscription) {
      const currentPlan = subscription.plan_type;
      const planHierarchy = { 'free': 0, 'daily': 1, 'monthly': 2, 'lifetime': 3 };
      
      if (planHierarchy[planType] < planHierarchy[currentPlan]) {
        toast({
          title: "Downgrade not allowed",
          description: "You cannot downgrade from your current plan.",
          variant: "destructive"
        });
        return false;
      }
    }

    try {
      let expiresAt = null;
      
      if (planType === 'daily') {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
      } else if (planType === 'monthly') {
        expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }
      // lifetime has no expiration (null)

      // Deactivate current subscription
      await supabase
        .from('user_subscriptions')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Create new subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          plan_type: planType,
          expires_at: expiresAt?.toISOString(),
          is_active: true
        });

      if (error) throw error;

      await fetchSubscription();
      
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
  };

  const getRemainingTime = () => {
    if (!subscription || !subscription.expires_at) return null;
    
    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();
    const timeLeft = expiresAt.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getPlanDisplayName = () => {
    // Admin users get special treatment
    if (isAdminUser) {
      return 'Admin (Unlimited)';
    }
    
    if (!subscription) return 'Free';
    
    const names = {
      free: 'Free',
      daily: '24-Hour Access',
      monthly: 'Monthly Plan',
      lifetime: 'Lifetime Access'
    };
    
    return names[subscription.plan_type];
  };

  return {
    subscription,
    loading,
    usageCount,
    canUseTool,
    recordUsage,
    upgradeSubscription,
    refetch: fetchSubscription,
    getRemainingTime,
    getPlanDisplayName,
    isAdminUser
  };
};
