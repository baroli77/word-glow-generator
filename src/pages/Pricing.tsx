
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pricing from '../components/Pricing';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';

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
              Start creating professional content today. Choose the plan that fits your needs.
            </p>
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
                <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What's included in the free plan?</h3>
                <p className="text-muted-foreground">The free plan includes 3 bio generations and 1 cover letter per month with basic customization options.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
                <p className="text-muted-foreground">We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied.</p>
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
