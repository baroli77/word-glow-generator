
import { supabase } from '@/integrations/supabase/client';
import type { Subscription } from './subscriptionService';

export class UsageService {
  private static instance: UsageService;
  
  static getInstance(): UsageService {
    if (!UsageService.instance) {
      UsageService.instance = new UsageService();
    }
    return UsageService.instance;
  }

  async fetchUsageCount(userId: string, toolType: string = 'bio_generator'): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('tool_type', toolType);

      if (error) {
        console.error('Error fetching usage count:', error);
        return 0;
      }
      
      return data?.length || 0;
    } catch (error) {
      console.error('Error in fetchUsageCount:', error);
      return 0;
    }
  }

  async recordUsage(userId: string, toolType: 'cover_letter' | 'bio_generator'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tool_usage')
        .insert({
          user_id: userId,
          tool_type: toolType
        });

      if (error) {
        console.error('Error recording usage:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in recordUsage:', error);
      return false;
    }
  }

  canUseTool(
    toolType: 'cover_letter' | 'bio_generator', 
    subscription: Subscription | null, 
    isAdminUser: boolean,
    usageCount: number
  ): boolean {
    // Admin users have unlimited access
    if (isAdminUser) {
      return true;
    }

    // If user has an active paid subscription, they can use the tool
    if (subscription && subscription.plan_type !== 'free') {
      return true;
    }

    // Cover letter is premium only
    if (toolType === 'cover_letter') {
      return false;
    }

    // For free users and bio generator, check if they've used their allocation
    if (toolType === 'bio_generator') {
      return usageCount < 1;
    }

    return false;
  }
}

export const usageService = UsageService.getInstance();
