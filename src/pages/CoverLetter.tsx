
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from 'lucide-react';

const CoverLetter = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Cover Letter Generator
              </h1>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Create personalized, impressive cover letters that help you stand out from the crowd.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="h-16 w-16 rounded-full bg-wordcraft-pink/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-wordcraft-pink" />
                </div>
              </div>
              
              <div className="text-center max-w-lg mx-auto">
                <h2 className="text-xl font-semibold mb-4">Coming Soon!</h2>
                <p className="text-muted-foreground mb-8">
                  Our cover letter generator is almost ready. Check back soon to create professional, tailored cover letters that help you land your dream job.
                </p>
                <Button>
                  Get notified when it's ready
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="wordcraft-card wordcraft-card-hover">
                <h3 className="font-semibold text-lg mb-4">How it will work</h3>
                <ul className="space-y-3">
                  <li className="flex">
                    <span className="bg-wordcraft-purple/20 text-wordcraft-purple h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 shrink-0">1</span>
                    <span>Enter your details and job information</span>
                  </li>
                  <li className="flex">
                    <span className="bg-wordcraft-purple/20 text-wordcraft-purple h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 shrink-0">2</span>
                    <span>Choose your tone and style preferences</span>
                  </li>
                  <li className="flex">
                    <span className="bg-wordcraft-purple/20 text-wordcraft-purple h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 shrink-0">3</span>
                    <span>Generate and customize your cover letter</span>
                  </li>
                  <li className="flex">
                    <span className="bg-wordcraft-purple/20 text-wordcraft-purple h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 shrink-0">4</span>
                    <span>Download, share, or save for later</span>
                  </li>
                </ul>
              </div>
              
              <div className="wordcraft-card wordcraft-card-hover">
                <h3 className="font-semibold text-lg mb-4">Try our bio generator</h3>
                <p className="text-muted-foreground mb-6">
                  While you wait for the cover letter generator, check out our bio creator to build your professional online presence.
                </p>
                <Button className="w-full justify-between">
                  Go to Bio Generator
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoverLetter;
