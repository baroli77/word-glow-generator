
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { PRICING_CONFIG, type PlanType, isDowngrade } from '@/config/pricing';
import { useUpgrade } from '@/hooks/useUpgrade';

interface PlanCardProps {
  planType: PlanType;
  currentPlan: PlanType;
  isAdminUser?: boolean;
  showPopularBadge?: boolean;
  showCurrentBadge?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  planType, 
  currentPlan, 
  isAdminUser = false,
  showPopularBadge = true,
  showCurrentBadge = true
}) => {
  const plan = PRICING_CONFIG.plans[planType];
  const { handleUpgrade, isLoading } = useUpgrade();
  const isCurrentPlan = currentPlan === planType;
  const isPlanDowngrade = isDowngrade(currentPlan, planType);
  const loading = isLoading(planType);

  const handleClick = () => {
    if (planType === 'free') {
      window.location.href = '/signup';
    } else {
      handleUpgrade(planType);
    }
  };

  return (
    <div 
      className={`relative h-full bg-card border-2 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col ${
        plan.popular && showPopularBadge ? 'border-brand-purple shadow-lg shadow-brand-purple/20 scale-105' : 'border-border'
      } ${isCurrentPlan ? 'border-green-500 shadow-lg shadow-green-500/10' : ''}`}
    >
      {plan.popular && showPopularBadge && !isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-brand-pink text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            MOST POPULAR
          </div>
        </div>
      )}
      {isCurrentPlan && showCurrentBadge && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
            CURRENT PLAN
          </div>
        </div>
      )}
      
      <div className="flex-grow">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-xl">{plan.name}</h3>
        </div>
        <div className="text-center mb-4">
          <span className="text-3xl font-bold">{plan.displayPrice}</span>
          <span className="text-muted-foreground ml-1 text-sm">/{plan.period}</span>
        </div>
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed text-center">{plan.description}</p>
        
        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
          {plan.limitations.map((limitation, i) => (
            <li key={i} className="flex items-start">
              <span className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0 text-amber-500 text-xs">⚠️</span>
              <span className="text-sm text-muted-foreground leading-relaxed">{limitation}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto">
        <Button 
          variant={plan.popular && !isCurrentPlan ? "default" : "outline"}
          className={`w-full font-semibold ${
            plan.popular && !isCurrentPlan 
              ? 'bg-brand-purple hover:bg-brand-purple-dark text-white' 
              : ''
          } ${isCurrentPlan ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
          disabled={isCurrentPlan || isPlanDowngrade || isAdminUser || loading}
          onClick={handleClick}
        >
          {loading ? 'Processing...' :
           isCurrentPlan ? 'Current Plan' : 
           isPlanDowngrade ? 'Downgrade Not Allowed' :
           isAdminUser ? 'Admin Access' :
           plan.buttonText}
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
