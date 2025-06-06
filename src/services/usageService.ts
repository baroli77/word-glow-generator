
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

  async fetchUsageCount(userId: string, toolType: 'cover_letter' | 'bio_generator' = 'bio_generator'): Promise<number> {
    try {
      console.log(`Fetching usage count for user ${userId}, tool type: ${toolType}`);
      
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('tool_type', toolType);

      if (error) {
        console.error('Error fetching usage count:', error);
        return 0;
      }
      
      const count = data?.length || 0;
      console.log(`Usage count for ${toolType}: ${count}`);
      return count;
    } catch (error) {
      console.error('Error in fetchUsageCount:', error);
      return 0;
    }
  }

  async recordUsage(userId: string, toolType: 'cover_letter' | 'bio_generator'): Promise<boolean> {
    try {
      console.log(`Recording usage for user ${userId}, tool type: ${toolType}`);
      
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
      
      console.log(`Successfully recorded usage for ${toolType}`);
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
    console.log(`Checking tool access for ${toolType}:`, {
      subscription: subscription?.plan_type,
      isAdminUser,
      usageCount
    });

    // Admin users have unlimited access
    if (isAdminUser) {
      console.log('Admin user - unlimited access granted');
      return true;
    }

    // If user has an active paid subscription, they can use the tool
    if (subscription && subscription.plan_type !== 'free') {
      console.log('Paid subscription - access granted');
      return true;
    }

    // Cover letter is premium only for free users
    if (toolType === 'cover_letter') {
      console.log('Cover letter requires premium subscription');
      return false;
    }

    // For free users and bio generator, check if they've used their allocation
    if (toolType === 'bio_generator') {
      const hasAccess = usageCount < 1;
      console.log(`Bio generator access: ${hasAccess} (usage: ${usageCount}/1)`);
      return hasAccess;
    }

    return false;
  }
}

export const usageService = UsageService.getInstance();
