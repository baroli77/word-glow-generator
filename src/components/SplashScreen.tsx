
import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background animate-fade-in">
      <div className="text-center px-6 max-w-md mx-auto">
        <div className="text-6xl sm:text-7xl md:text-8xl mb-6 animate-scale-in">
          🚧
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 animation-delay-500">
          Coming Soon
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed animation-delay-1000">
          We're putting the final touches on something awesome. Please check back shortly.
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
