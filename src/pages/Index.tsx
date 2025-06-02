
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  // Don't render the page if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const enhancedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://makemy.bio/#website",
        "url": "https://makemy.bio/",
        "name": "MakeMy.Bio",
        "description": "AI-powered bio and cover letter generator for professional content creation",
        "publisher": {
          "@id": "https://makemy.bio/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://makemy.bio/bio-generator?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://makemy.bio/#organization",
        "name": "MakeMy.Bio",
        "url": "https://makemy.bio/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://makemy.bio/og-makemybio.jpg"
        },
        "sameAs": [
          "https://twitter.com/makemybio_ai"
        ]
      },
      {
        "@type": "WebApplication",
        "name": "MakeMy.Bio",
        "url": "https://makemy.bio",
        "description": "AI-powered bio and cover letter generator for professional content creation",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Web Browser",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Plan",
            "price": "0",
            "priceCurrency": "USD",
            "description": "1 free bio generation to try our service",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Daily Plan",
            "price": "2.99",
            "priceCurrency": "USD",
            "description": "24-hour unlimited access",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Weekly Plan", 
            "price": "4.99",
            "priceCurrency": "USD",
            "description": "7-day unlimited access",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Monthly Plan", 
            "price": "9.99",
            "priceCurrency": "USD",
            "billingDuration": "P1M",
            "description": "30-day unlimited access",
            "availability": "https://schema.org/InStock"
          },
          {
            "@type": "Offer",
            "name": "Lifetime Plan", 
            "price": "49.99",
            "priceCurrency": "USD",
            "description": "Unlimited access forever",
            "availability": "https://schema.org/InStock"
          }
        ],
        "creator": {
          "@id": "https://makemy.bio/#organization"
        },
        "featureList": [
          "AI-powered bio generation",
          "Cover letter creation", 
          "Multiple platform optimization",
          "Professional templates",
          "Character limit customization",
          "LinkedIn bio optimization",
          "Resume bio generation",
          "Social media bio creation",
          "Dating profile optimization"
        ]
      }
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEOHead
        title="MakeMy.Bio - AI-Powered Bio & Cover Letter Generator"
        description="Create compelling bios and cover letters with MakeMy.Bio's AI-powered generator. Professional content for LinkedIn, resumes, social media, and more. Free templates and premium features available."
        keywords="AI bio generator, cover letter generator, LinkedIn bio, professional bio, resume writing, AI content creation, social media bio, dating profile, professional writing, CV generator, bio maker, AI writing assistant"
        canonicalUrl="https://makemy.bio/"
        structuredData={enhancedStructuredData}
      />
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
