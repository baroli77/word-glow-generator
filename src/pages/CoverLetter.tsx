
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CoverLetterForm from '../components/CoverLetterForm';
import InfoBadge from '../components/InfoBadge';
import SEOHead from '../components/SEOHead';

const CoverLetter = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "AI Cover Letter Generator",
    "description": "Create personalized, professional cover letters that help you stand out from the crowd using AI technology",
    "url": "https://wordcraft.ai/cover-letter",
    "isPartOf": {
      "@type": "WebSite",
      "name": "WordCraft",
      "url": "https://wordcraft.ai"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Cover Letter Generator",
      "applicationCategory": "ProductivityApplication",
      "description": "AI-powered cover letter generation tool for job applications",
      "featureList": [
        "Personalized cover letter creation",
        "CV upload and analysis",
        "Job description matching",
        "Professional formatting",
        "Industry-specific templates"
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="AI Cover Letter Generator - Create Professional Cover Letters"
        description="Create personalized, professional cover letters that help you stand out from the crowd. Simply upload your CV and let our AI craft the perfect cover letter for any job application."
        keywords="AI cover letter generator, cover letter writer, job application, CV upload, personalized cover letter, professional cover letter, job search tool"
        canonicalUrl="https://wordcraft.ai/cover-letter"
        structuredData={structuredData}
      />
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                AI-Powered Cover Letter Generator
              </h1>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Create personalized, impressive cover letters that help you stand out from the crowd. 
                Simply upload your CV and we'll do the rest.
              </p>
              <div className="mt-4 bg-wordcraft-purple/10 p-3 rounded-lg inline-block">
                <p className="text-sm flex items-center">
                  <span className="bg-wordcraft-purple text-white rounded-full p-1 mr-2" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </span>
                  Powered by OpenAI's advanced GPT-4o-mini model
                  <span className="ml-2">
                    <InfoBadge text="This service uses a shared API key. No need to provide your own." />
                  </span>
                </p>
              </div>
            </header>
            
            <CoverLetterForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoverLetter;
