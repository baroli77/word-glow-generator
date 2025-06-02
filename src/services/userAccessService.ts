
import { supabase } from '@/integrations/supabase/client';
import { subscriptionService, type Subscription } from './subscriptionService';
import { usageService } from './usageService';
import { toast } from "@/components/ui/use-toast";

export class UserAccessService {
  private static instance: UserAccessService;
  
  static getInstance(): UserAccessService {
    if (!UserAccessService.instance) {
      UserAccessService.instance = new UserAccessService();
    }
    return UserAccessService.instance;
  }

  async getUserAccessData(userId: string, isAdminUser: boolean = false) {
    try {
      const [subscription, usageCount] = await Promise.all([
        subscriptionService.fetchUserSubscription(userId),
        usageService.fetchUsageCount(userId, 'bio_generator')
      ]);

      return {
        subscription,
        usageCount,
        isAdminUser
      };
    } catch (error) {
      console.error('Error fetching user access data:', error);
      return {
        subscription: subscriptionService['getDefaultFreeSubscription'](),
        usageCount: 0,
        isAdminUser
      };
    }
  }

  canUseTool(
    toolType: 'cover_letter' | 'bio_generator',
    subscription: Subscription | null,
    isAdminUser: boolean,
    usageCount: number
  ): boolean {
    return usageService.canUseTool(toolType, subscription, isAdminUser, usageCount);
  }

  async recordToolUsage(userId: string, toolType: 'cover_letter' | 'bio_generator'): Promise<boolean> {
    return usageService.recordUsage(userId, toolType);
  }

  async upgradeSubscription(userId: string, planType: 'daily' | 'weekly' | 'monthly' | 'lifetime'): Promise<boolean> {
    return subscriptionService.upgradeSubscription(userId, planType);
  }

  async cancelSubscription(userId: string): Promise<boolean> {
    return subscriptionService.cancelSubscription(userId);
  }

  getRemainingTime(expiresAt: string | null): string | null {
    return subscriptionService.getRemainingTime(expiresAt);
  }

  getPlanDisplayName(planType: string, isAdminUser: boolean = false): string {
    return subscriptionService.getPlanDisplayName(planType, isAdminUser);
  }
}

export const userAccessService = UserAccessService.getInstance();
