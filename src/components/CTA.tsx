
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-wordcraft-purple/5 via-background to-wordcraft-pink/5"></div>
      
      <div className="container mx-auto relative z-10 max-w-4xl">
        <div className="text-center space-y-8">
          {/* Main headline */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Ready to elevate your
              <br />
              <span className="text-gradient">professional presence?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals who use WordCraft to create compelling content that opens doors.
            </p>
          </div>
          
          {/* Benefits list */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center py-6">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Instant results</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90 text-lg px-10 py-6 shadow-2xl hover:shadow-wordcraft-purple/25 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/bio-generator">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-lg px-10 py-6 border-2 hover:bg-accent hover:border-wordcraft-purple transition-all duration-300"
              >
                Try Demo First
              </Button>
            </Link>
          </div>
          
          {/* Trust signal */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Used by professionals at companies like Google, Microsoft, and Apple
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
