
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Users, Award } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-wordcraft-purple/5 via-background to-wordcraft-pink/5 dark:from-wordcraft-purple/10 dark:to-wordcraft-pink/10"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-wordcraft-purple/10 rounded-full blur-xl animate-float hidden lg:block"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-wordcraft-pink/10 rounded-full blur-xl animate-float animation-delay-1000 hidden lg:block"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-wordcraft-purple/10 dark:bg-wordcraft-purple/20 text-wordcraft-purple dark:text-wordcraft-purple-light px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              AI-Powered Writing Assistant
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                Craft <span className="text-gradient">perfect content</span> 
                <br className="hidden sm:block" />
                with AI precision
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                WordCraft uses advanced AI to help you create engaging, authentic bios and cover letters that truly capture your unique voice and professional strengths.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/bio-generator">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90 text-lg px-8 py-6">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Creating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/cover-letter">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6">
                  Try Cover Letters
                </Button>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-wordcraft-purple to-wordcraft-pink flex items-center justify-center text-white font-bold border-2 border-background">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Trusted by <span className="font-semibold text-foreground">10,000+</span> professionals
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Sparkles key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">4.9/5 rating</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visual */}
          <div className="relative lg:order-last order-first">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Main Card */}
              <div className="relative transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="bg-card dark:bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-wordcraft-purple to-wordcraft-pink flex items-center justify-center mr-4">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Professional Bio</h3>
                      <p className="text-sm text-muted-foreground">Generated in seconds</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm leading-relaxed text-foreground/90">
                      Sarah is a passionate UX designer with over 6 years of experience creating intuitive digital experiences. Her human-centered approach and keen eye for detail have helped brands like Spotify and Airbnb connect more deeply with their users through thoughtful design solutions.
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        Generated with AI ✨
                      </div>
                      <Button size="sm" variant="outline">
                        Copy Text
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-background dark:bg-card border border-border rounded-xl shadow-lg p-4 animate-float">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-wordcraft-purple" />
                  <div>
                    <p className="text-xs text-muted-foreground">Generation Time</p>
                    <p className="font-semibold">2.3s</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-background dark:bg-card border border-border rounded-xl shadow-lg p-4 animate-float animation-delay-500">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-wordcraft-pink" />
                  <div>
                    <p className="text-xs text-muted-foreground">Quality Score</p>
                    <p className="font-semibold">98%</p>
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
