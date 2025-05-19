
import React from 'react';
import { Sparkles, FileText, PenLine, LayoutDashboard, Clock, Award } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-6 w-6 text-wordcraft-purple" />,
    title: "Bio Generator",
    description: "Create professional, personal, or social media bios with emotional intelligence that truly represent you."
  },
  {
    icon: <FileText className="h-6 w-6 text-wordcraft-purple" />,
    title: "Cover Letter Creator",
    description: "Generate customized cover letters that highlight your strengths and stand out to employers."
  },
  {
    icon: <PenLine className="h-6 w-6 text-wordcraft-purple" />,
    title: "Tone Adjustment",
    description: "Adjust the tone of your writing from professional to casual, enthusiastic to reflective."
  },
  {
    icon: <LayoutDashboard className="h-6 w-6 text-wordcraft-purple" />,
    title: "Personal Dashboard",
    description: "Save and organize all your generated content in one convenient place."
  },
  {
    icon: <Clock className="h-6 w-6 text-wordcraft-purple" />,
    title: "Time-Saving",
    description: "Create compelling written content in minutes instead of hours."
  },
  {
    icon: <Award className="h-6 w-6 text-wordcraft-purple" />,
    title: "Premium Templates",
    description: "Access industry-specific templates designed to help you stand out."
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6 bg-accent/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Features that make writing <span className="text-gradient">effortless</span>
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            WordCraft combines AI technology with emotional intelligence to help you create authentic, engaging content.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="wordcraft-card wordcraft-card-hover animate-enter" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="h-12 w-12 rounded-lg bg-wordcraft-purple/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
