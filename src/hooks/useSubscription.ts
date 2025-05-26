
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Type-safe assignment with proper casting
      if (data) {
        setSubscription({
          id: data.id,
          plan_type: data.plan_type as 'free' | 'daily' | 'monthly' | 'lifetime',
          expires_at: data.expires_at,
          is_active: data.is_active
        });
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const canUseTool = async (toolType: 'cover_letter' | 'bio_generator'): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('can_use_tool', {
        user_id_param: user.id,
        tool_type_param: toolType
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking tool usage:', error);
      return false;
    }
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
      
      // Refresh subscription data after recording usage
      await fetchSubscription();
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  };

  const upgradeSubscription = async (planType: 'daily' | 'monthly' | 'lifetime') => {
    if (!user) return false;

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
      toast({
        title: "Subscription upgraded",
        description: `You now have ${planType} access!`
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

  return {
    subscription,
    loading,
    canUseTool,
    recordUsage,
    upgradeSubscription,
    refetch: fetchSubscription
  };
};
