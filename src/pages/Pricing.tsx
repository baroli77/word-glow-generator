
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';
import { Button } from "@/components/ui/button";
import { Check, Star, Clock, Infinity } from 'lucide-react';

const PricingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-6 bg-gradient-to-b from-background to-accent/30">
          <div className="container mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
              Choose Your <span className="text-gradient">Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start creating professional bios today. From free trials to lifetime access - find the perfect plan for your needs.
            </p>
            
            {/* Plan Comparison Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-card border rounded-lg p-4">
                <Star className="h-6 w-6 text-makemybio-purple mx-auto mb-2" />
                <h3 className="font-medium text-sm">Free Trial</h3>
                <p className="text-xs text-muted-foreground">Try before you buy</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <Clock className="h-6 w-6 text-makemybio-purple mx-auto mb-2" />
                <h3 className="font-medium text-sm">24h Access</h3>
                <p className="text-xs text-muted-foreground">Perfect for quick needs</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="h-6 w-6 bg-makemybio-purple text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2">
                  7
                </div>
                <h3 className="font-medium text-sm">1 Week</h3>
                <p className="text-xs text-muted-foreground">Short projects</p>
              </div>
              <div className="bg-card border rounded-lg p-4">
                <div className="h-6 w-6 bg-makemybio-purple text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2">
                  30
                </div>
                <h3 className="font-medium text-sm">1 Month</h3>
                <p className="text-xs text-muted-foreground">Extended access</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Component */}
        <Pricing />

        {/* FAQ Section */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-lg mb-2">How does the free tier work?</h3>
                <p className="text-muted-foreground">Sign up for free and get 1 bio generation to try our service. Once used, you'll need to upgrade to continue creating bios.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">When does my access start?</h3>
                <p className="text-muted-foreground">Your access begins immediately after payment confirmation. You'll have unlimited bio generation for the duration of your chosen plan.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What happens when my plan expires?</h3>
                <p className="text-muted-foreground">After expiration, you'll automatically revert to the free tier. Your previously generated bios remain accessible, but you'll need to upgrade to create new ones.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is lifetime access really forever?</h3>
                <p className="text-muted-foreground">Yes! One payment gives you permanent access to unlimited bio generation and all future features we add to the platform.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I upgrade from a shorter plan?</h3>
                <p className="text-muted-foreground">Yes! You can upgrade to a longer plan at any time. We'll credit your remaining time towards the new plan.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
