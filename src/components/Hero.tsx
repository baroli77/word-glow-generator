
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="pt-10 pb-20 px-6 md:pt-20 md:pb-32">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Craft <span className="text-gradient">perfect bios</span> <br className="hidden md:block" />
              with emotional intelligence
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 md:max-w-xl">
              WordCraft uses AI to help you create engaging, authentic bios and cover letters that truly reflect your personality and strengths.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/bio-generator">
                <Button size="lg" className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create your bio
                </Button>
              </Link>
              <Link to="/cover-letter">
                <Button size="lg" variant="outline">
                  Write a cover letter
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-wordcraft-soft-pink flex items-center justify-center">😊</div>
                <div className="w-8 h-8 rounded-full bg-wordcraft-soft-blue flex items-center justify-center">👍</div>
                <div className="w-8 h-8 rounded-full bg-wordcraft-soft-peach flex items-center justify-center">✨</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">5,000+</span> bios created this week
              </p>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-wordcraft-purple/30 to-wordcraft-pink/30 rounded-full blur-[120px] opacity-30"></div>
            <div className="relative animate-float">
              <div className="bg-white border border-wordcraft-soft-gray rounded-2xl shadow-xl p-8 mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-wordcraft-purple/20 flex items-center justify-center mr-4">
                    <Sparkles className="w-5 h-5 text-wordcraft-purple" />
                  </div>
                  <h3 className="font-medium">Professional Bio</h3>
                </div>
                <p className="text-sm leading-relaxed">
                  Jane is a passionate UX designer with over 5 years of experience creating intuitive digital experiences. Her human-centered approach and keen eye for detail have helped brands like Spotify and Airbnb connect more deeply with their users.
                </p>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">Copy</Button>
                </div>
              </div>
              
              <div className="bg-white border border-wordcraft-soft-gray rounded-2xl shadow-xl p-8 ml-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-wordcraft-purple/20 flex items-center justify-center mr-4">
                    <Sparkles className="w-5 h-5 text-wordcraft-purple" />
                  </div>
                  <h3 className="font-medium">Social Media Bio</h3>
                </div>
                <p className="text-sm leading-relaxed">
                  ✨ UX designer by day, artist by night | Creating experiences that make people smile | Dog mom | Coffee enthusiast | Currently exploring sustainable design patterns
                </p>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">Copy</Button>
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
