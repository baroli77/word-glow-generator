
import React from 'react';

const testimonials = [
  {
    quote: "WordCraft helped me create a professional bio that perfectly captures my experience and personality. I've received so many compliments!",
    author: "Sarah Johnson",
    role: "Marketing Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    quote: "The cover letter generator is amazing. I was able to customize it for different job applications while maintaining my authentic voice.",
    author: "Michael Chen",
    role: "Software Engineer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  },
  {
    quote: "As someone who struggles with writing about myself, WordCraft has been a game-changer. It feels like having a professional writer on call.",
    author: "Priya Patel",
    role: "Freelance Designer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            What our users are <span className="text-gradient">saying</span>
          </h2>
          <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
            Join thousands of professionals who have transformed the way they present themselves.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="wordcraft-card wordcraft-card-hover animate-enter" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{testimonial.author}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="italic text-muted-foreground">"{testimonial.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
