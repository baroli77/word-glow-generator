
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CoverLetterForm from '../components/CoverLetterForm';

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
                Simply upload your CV and we'll do the rest.
              </p>
            </div>
            
            <CoverLetterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoverLetter;
