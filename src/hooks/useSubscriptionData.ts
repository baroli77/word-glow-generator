
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { subscriptionService, type Subscription } from '@/services/subscriptionService';
import { useSubscriptionExpiry } from './useSubscriptionExpiry';

export const useSubscriptionData = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { checkAndExpireUserSubscription } = useSubscriptionExpiry();

  // Check if user is admin
  const isAdminUser = user?.email === 'obarton77@gmail.com';

  const fetchSubscription = useCallback(async (skipExpiryCheck = false) => {
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
      // Check and expire subscription first (unless we're skipping it to avoid loops)
      if (!skipExpiryCheck) {
        const expiryResult = await checkAndExpireUserSubscription(user.id);
        console.log('Subscription expiry check result:', expiryResult);
      }

      // Fetch current subscription after expiry check
      const userSubscription = await subscriptionService.fetchUserSubscription(user.id);
      setSubscription(userSubscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(subscriptionService['getDefaultFreeSubscription']());
    } finally {
      setLoading(false);
    }
  }, [user, isAdminUser, checkAndExpireUserSubscription]);

  // Initial fetch when user changes
  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, fetchSubscription]);

  // Set up automatic revalidation for time-based subscriptions
  useEffect(() => {
    if (!subscription || !subscription.expires_at) {
      return;
    }

    const expiresAt = new Date(subscription.expires_at);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();

    // If already expired, check immediately
    if (timeUntilExpiry <= 0) {
      fetchSubscription();
      return;
    }

    // For daily subscriptions, check more frequently as they approach expiry
    let checkInterval: number;
    if (subscription.plan_type === 'daily') {
      // Check every minute if expiring within an hour, otherwise every 10 minutes
      checkInterval = timeUntilExpiry <= 60 * 60 * 1000 ? 60 * 1000 : 10 * 60 * 1000;
    } else {
      // For monthly plans, check every hour
      checkInterval = 60 * 60 * 1000;
    }

    const interval = setInterval(() => {
      fetchSubscription();
    }, checkInterval);

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
