
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-wordcraft-purple/10 to-wordcraft-pink/10"></div>
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Ready to create your perfect <span className="text-gradient">bio or cover letter</span>?
          </h2>
          <p className="text-muted-foreground md:text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use WordCraft to present themselves confidently and authentically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Started For Free
              </Button>
            </Link>
            <Link to="/bio-generator">
              <Button size="lg" variant="outline">
                Try Bio Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
