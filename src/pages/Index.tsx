
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "WordCraft",
    "url": "https://wordcraft.ai",
    "description": "AI-powered bio and cover letter generator for professional content creation",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web Browser",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Plan",
        "price": "0",
        "priceCurrency": "USD",
        "description": "3 generations per day"
      },
      {
        "@type": "Offer",
        "name": "Premium Plan", 
        "price": "9.99",
        "priceCurrency": "USD",
        "billingDuration": "P1M",
        "description": "Unlimited generations and premium features"
      }
    ],
    "creator": {
      "@type": "Organization",
      "name": "WordCraft",
      "url": "https://wordcraft.ai"
    },
    "featureList": [
      "AI-powered bio generation",
      "Cover letter creation", 
      "Multiple platform optimization",
      "Professional templates",
      "Character limit customization"
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEOHead
        title="WordCraft - AI-Powered Bio & Cover Letter Generator"
        description="Create compelling bios and cover letters with WordCraft's AI-powered generator. Professional content for LinkedIn, resumes, social media, and more. Free templates and premium features available."
        keywords="AI bio generator, cover letter generator, LinkedIn bio, professional bio, resume writing, AI content creation, social media bio, dating profile, professional writing"
        canonicalUrl="https://wordcraft.ai/"
        structuredData={structuredData}
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
