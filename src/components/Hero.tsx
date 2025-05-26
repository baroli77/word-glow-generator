
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, PenTool, FileText, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-accent/30 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-wordcraft-purple/10 dark:bg-wordcraft-purple/20 text-wordcraft-purple px-4 py-2 rounded-full text-sm font-medium border border-wordcraft-purple/20">
              <Sparkles className="w-4 h-4" />
              AI-Powered Writing Assistant
            </div>
            
            {/* Main Headlines */}
            <div className="space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Write compelling
                <br />
                <span className="text-gradient">content in seconds</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Create professional bios and cover letters that showcase your unique strengths with the power of AI.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/bio-generator">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90 text-lg px-8 py-6 shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/cover-letter">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-accent">
                  View Examples
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="pt-8 space-y-4">
              <p className="text-sm text-muted-foreground">
                Trusted by professionals worldwide
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8 text-muted-foreground">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">10K+</div>
                  <div className="text-xs">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">50K+</div>
                  <div className="text-xs">Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">4.9★</div>
                  <div className="text-xs">Rating</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              {/* Main illustration card */}
              <div className="relative bg-card border border-border rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-wordcraft-purple to-wordcraft-pink flex items-center justify-center">
                      <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Bio Generator</h3>
                      <p className="text-xs text-muted-foreground">Professional</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs font-medium">
                    Ready
                  </div>
                </div>
                
                {/* Content preview */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                    <div className="h-3 bg-muted rounded w-4/6"></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      Generated in 2.1s
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink">
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl shadow-lg p-4 animate-float">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-wordcraft-pink" />
                  <div>
                    <p className="text-xs text-muted-foreground">Cover Letters</p>
                    <p className="font-semibold text-sm">Available</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl shadow-lg p-4 animate-float animation-delay-500">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-wordcraft-purple" />
                  <div>
                    <p className="text-xs text-muted-foreground">AI Quality</p>
                    <p className="font-semibold text-sm">Premium</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
