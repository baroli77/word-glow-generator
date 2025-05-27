
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usageCount, setUsageCount] = useState(0);

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
      fetchUsageCount();
    } else {
      setUsageCount(0);
    }
  }, [user]);

  const canUseTool = (toolType: 'cover_letter' | 'bio_generator', subscription: any, isAdminUser: boolean): boolean => {
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

  return {
    usageCount,
    canUseTool,
    recordUsage,
    fetchUsageCount
  };
};
