
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Basic features for personal use",
    features: [
      "3 bios per month",
      "1 cover letter per month",
      "Basic tone adjustments",
      "Preview and edit functionality"
    ],
    buttonText: "Get Started",
    buttonVariant: "outline"
  },
  {
    name: "Pro",
    price: "£5",
    period: "one-time",
    description: "Everything you need for one-time use",
    features: [
      "10 bios",
      "5 cover letters",
      "Advanced tone adjustments",
      "Export to PDF and DOCX",
      "No expiration"
    ],
    buttonText: "Upgrade Now",
    buttonVariant: "default",
    popular: true
  },
  {
    name: "Premium",
    price: "£8",
    period: "per month",
    description: "Professional features for regular use",
    features: [
      "Unlimited bios",
      "Unlimited cover letters",
      "All tone and style options",
      "Export to all formats",
      "Priority support",
      "Personal dashboard"
    ],
    buttonText: "Start Premium",
    buttonVariant: "outline"
  }
];

const Pricing: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating professional bios and cover letters.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`wordcraft-card relative overflow-hidden ${plan.popular ? 'ring-2 ring-wordcraft-purple shadow-lg shadow-wordcraft-purple/10' : ''} animate-enter`} 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-wordcraft-purple text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}
              <h3 className="font-semibold text-xl">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground ml-1">/{plan.period}</span>
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className="h-4 w-4 text-wordcraft-purple mr-2" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.buttonVariant as any} 
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink text-white hover:opacity-90' : ''}`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
