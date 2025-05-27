
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usageService } from '@/services/usageService';
import type { Subscription } from '@/services/subscriptionService';

export const useUsageTracking = () => {
  const { user } = useAuth();
  const [usageCount, setUsageCount] = useState(0);

  const fetchUsageCount = async () => {
    if (!user) return;
    
    try {
      const count = await usageService.fetchUsageCount(user.id, 'bio_generator');
      setUsageCount(count);
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

  const canUseTool = (toolType: 'cover_letter' | 'bio_generator', subscription: Subscription | null, isAdminUser: boolean): boolean => {
    if (!user) return false;
    return usageService.canUseTool(toolType, subscription, isAdminUser, usageCount);
  };

  const recordUsage = async (toolType: 'cover_letter' | 'bio_generator') => {
    if (!user) return;

    try {
      const success = await usageService.recordUsage(user.id, toolType);
      if (success) {
        // Refresh usage count
        await fetchUsageCount();
      }
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
