
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Calendar, Clock, Crown, Settings as SettingsIcon, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

interface UserSubscription {
  id: string;
  plan_type: string;
  subscription_start: string;
  expires_at: string | null;
  cancel_requested: boolean;
  is_active: boolean;
}

const Settings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscription = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    setCancelling(true);
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ cancel_requested: true })
        .eq('id', subscription.id);

      if (error) throw error;

      toast({
        title: "Subscription cancelled",
        description: "Your subscription will remain active until the end of your billing cycle.",
      });

      await fetchSubscription();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const getTimeRemaining = () => {
    if (!subscription?.expires_at) return null;
    
    const now = new Date();
    const expiryDate = new Date(subscription.expires_at);
    const timeLeft = expiryDate.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getNextBillingDate = () => {
    if (!subscription?.subscription_start) return null;
    
    const startDate = new Date(subscription.subscription_start);
    const nextBilling = new Date(startDate);
    nextBilling.setMonth(nextBilling.getMonth() + 1);
    
    return nextBilling.toLocaleDateString();
  };

  const getPlanIcon = () => {
    switch (subscription?.plan_type) {
      case 'daily': return <Clock className="h-5 w-5" />;
      case 'monthly': return <Calendar className="h-5 w-5" />;
      case 'lifetime': return <Crown className="h-5 w-5" />;
      default: return <SettingsIcon className="h-5 w-5" />;
    }
  };

  const getPlanName = () => {
    switch (subscription?.plan_type) {
      case 'daily': return '24-Hour Access';
      case 'monthly': return 'Monthly Plan';
      case 'lifetime': return 'Lifetime Access';
      case 'free': return 'Free Plan';
      default: return 'Free Plan';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPlanIcon()}
                Subscription Management
              </CardTitle>
              <CardDescription>
                Manage your current subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-lg font-semibold">{getPlanName()}</p>
                </div>
                <Badge variant={subscription?.plan_type === 'free' ? 'secondary' : 'default'}>
                  {subscription?.plan_type || 'free'}
                </Badge>
              </div>

              {/* Daily Plan Details */}
              {subscription?.plan_type === 'daily' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800 dark:text-blue-200">Time Remaining</span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300">
                      {getTimeRemaining() || "Plan has expired - you'll be moved to free plan"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => navigate('/pricing')} className="flex-1">
                      Upgrade to Monthly
                    </Button>
                    <Button onClick={() => navigate('/pricing')} variant="outline" className="flex-1">
                      Upgrade to Lifetime
                    </Button>
                  </div>
                </div>
              )}

              {/* Monthly Plan Details */}
              {subscription?.plan_type === 'monthly' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800 dark:text-green-200">Next Billing Date</span>
                      </div>
                      <p className="text-green-700 dark:text-green-300">{getNextBillingDate()}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Status</span>
                      </div>
                      <p className={subscription.cancel_requested ? "text-orange-600" : "text-green-600"}>
                        {subscription.cancel_requested ? "Cancellation Requested" : "Active"}
                      </p>
                    </div>
                  </div>

                  {subscription.cancel_requested ? (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">Cancellation Scheduled</span>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300">
                        Your plan will cancel at the end of your billing cycle ({getNextBillingDate()}). 
                        You'll retain access until then.
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={() => navigate('/pricing')} variant="outline" className="flex-1">
                        Upgrade to Lifetime
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            Cancel Subscription
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel your monthly subscription? 
                              You'll retain access until your next billing date ({getNextBillingDate()}), 
                              then be moved to the free plan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={handleCancelSubscription}
                              disabled={cancelling}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              )}

              {/* Lifetime Plan Details */}
              {subscription?.plan_type === 'lifetime' && (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800 text-center">
                  <Crown className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">
                    You have lifetime access! 🎉
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300">
                    Enjoy unlimited access to all features forever. Thank you for your support!
                  </p>
                </div>
              )}

              {/* Free Plan Details */}
              {(!subscription || subscription?.plan_type === 'free') && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                    <p className="text-gray-700 dark:text-gray-300">
                      You're currently on the free plan with limited access. 
                      Upgrade to unlock unlimited bio generation and cover letter creation.
                    </p>
                  </div>
                  <Button onClick={() => navigate('/pricing')} className="w-full">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
