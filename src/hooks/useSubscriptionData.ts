
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscriptionService, type Subscription } from '@/services/subscriptionService';

export const useSubscriptionData = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

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
      const userSubscription = await subscriptionService.fetchUserSubscription(user.id);
      setSubscription(userSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(subscriptionService['getDefaultFreeSubscription']());
    } finally {
      setLoading(false);
    }
  }, [user, isAdminUser]);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
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

  const getRemainingTime = () => {
    return subscriptionService.getRemainingTime(subscription?.expires_at || null);
  };

  const getPlanDisplayName = () => {
    return subscriptionService.getPlanDisplayName(subscription?.plan_type || 'free', isAdminUser);
  };

  return {
    subscription,
    loading,
    fetchSubscription,
    getRemainingTime,
    getPlanDisplayName,
    isAdminUser
  };
};
