
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BioGeneratorForm from '../components/BioGeneratorForm';

const BioGenerator = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Bio Generator
              </h1>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Create the perfect bio for any platform with our AI-powered generator.
                Fill in the form below and let us craft a compelling bio for you.
              </p>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Now supporting LinkedIn, Twitter, Instagram, Tinder, Resume/CV, Portfolio, Twitch, 
                Threads, Facebook, TikTok, YouTube, Reddit, Snapchat, and Pinterest!
              </p>
            </div>
            
            <BioGeneratorForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BioGenerator;
