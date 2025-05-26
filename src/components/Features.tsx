
import React from 'react';
import { Sparkles, Zap, Shield, Target } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-wordcraft-purple" />,
    title: "AI-Powered Generation",
    description: "Advanced AI creates personalized, authentic content that reflects your unique professional voice and achievements."
  },
  {
    icon: <Zap className="h-8 w-8 text-wordcraft-pink" />,
    title: "Lightning Fast",
    description: "Generate professional bios and cover letters in under 30 seconds. No more staring at blank pages."
  },
  {
    icon: <Target className="h-8 w-8 text-wordcraft-purple" />,
    title: "Industry Specific",
    description: "Tailored templates and language for different industries, roles, and professional contexts."
  },
  {
    icon: <Shield className="h-8 w-8 text-wordcraft-pink" />,
    title: "Professional Quality",
    description: "Enterprise-grade AI ensures your content is polished, error-free, and ready for any professional setting."
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background to-accent/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Why choose <span className="text-gradient">WordCraft</span>?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to help you create compelling content that gets results.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-enter"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Icon container */}
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-wordcraft-purple/10 to-wordcraft-pink/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-bold text-xl mb-4 text-foreground group-hover:text-wordcraft-purple transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to see the difference AI can make?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/bio-generator" className="inline-block">
              <button className="bg-gradient-to-r from-wordcraft-purple to-wordcraft-pink hover:opacity-90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Try Bio Generator
              </button>
            </a>
            <a href="/cover-letter" className="inline-block">
              <button className="border-2 border-border hover:bg-accent text-foreground px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                Try Cover Letters
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
