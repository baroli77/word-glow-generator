
import React from 'react';
import { Check, Star, Clock, Crown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { PRICING_CONFIG, PLAN_TYPES, type PlanType } from '@/config/pricing';
import PlanCard from '@/components/shared/PlanCard';

const Pricing: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isAdminUser } = useSubscription();

  const getCurrentPlan = (): PlanType => {
    if (!subscription) return 'free';
    return subscription.plan_type as PlanType;
  };

  const currentPlan = getCurrentPlan();

  return (
    <section className="py-16 md:py-24 px-6 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating professional bios.
          </p>
          {user && (
            <div className="mt-4 inline-block bg-brand-purple/10 border border-brand-purple/20 px-4 py-2 rounded-lg">
              <p className="text-sm text-brand-purple font-medium">
                Current Plan: {isAdminUser ? 'Admin (Unlimited)' : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PLAN_TYPES.map((planType, index) => (
            <div 
              key={planType} 
              className="animate-enter" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <PlanCard
                planType={planType}
                currentPlan={currentPlan}
                isAdminUser={isAdminUser}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-card border rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Need help choosing?</h3>
            <p className="text-muted-foreground mb-6">
              Start with our free tier to try the service, then upgrade when you need more bio generations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Perfect for trying out:</h4>
                <p className="text-muted-foreground">Free tier</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best for regular use:</h4>
                <p className="text-muted-foreground">Monthly or Lifetime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
