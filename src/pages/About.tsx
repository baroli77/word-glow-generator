
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const About = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About MakeMy.Bio",
    "description": "Learn about MakeMy.Bio's mission to help people express themselves professionally across all digital platforms",
    "url": "https://makemy.bio/about",
    "isPartOf": {
      "@type": "WebSite",
      "name": "MakeMy.Bio",
      "url": "https://makemy.bio"
    },
    "mainEntity": {
      "@type": "Organization",
      "name": "MakeMy.Bio",
      "foundingDate": "2025",
      "description": "AI-powered content creation platform specializing in professional bios and cover letters",
      "url": "https://makemy.bio",
      "sameAs": [
        "https://twitter.com/makemybio_ai",
        "https://linkedin.com/company/makemybio-ai"
      ]
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="About MakeMy.Bio - Your AI Content Creation Assistant"
        description="Learn about MakeMy.Bio's mission to help people express themselves professionally across all digital platforms. Founded in 2025, we use AI to create compelling bios and cover letters."
        keywords="MakeMy.Bio company, AI content creation, professional writing service, bio generator company, cover letter generator"
        canonicalUrl="https://makemy.bio/about"
        structuredData={structuredData}
      />
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                About MakeMy.Bio
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Your AI-powered content creation assistant
              </p>
            </header>
            
            <article className="prose prose-lg mx-auto dark:prose-invert">
              <p>
                MakeMy.Bio was created with a simple mission: to help people express themselves professionally
                and effectively across all digital platforms.
              </p>
              
              <h2>Our Story</h2>
              <p>
                Founded in 2025, MakeMy.Bio emerged from a simple observation: writing professional content 
                for different platforms is challenging and time-consuming. Whether you're crafting the perfect 
                social media bio, a compelling resume summary, or a personalized cover letter, finding the right words 
                can be difficult.
              </p>
              
              <h2>How It Works</h2>
              <p>
                MakeMy.Bio leverages the latest advancements in artificial intelligence to generate
                high-quality, personalized content based on information you provide. Our AI models have been
                trained on millions of professional profiles, bios, and documents to understand what makes
                content effective across different platforms.
              </p>
              
              <h2>Our Technology</h2>
              <p>
                We use OpenAI's powerful language models to generate content that sounds natural, professional,
                and uniquely you. The technology continually improves as more people use it, ensuring that
                our content generation keeps getting better.
              </p>
              
              <h2>Privacy & Security</h2>
              <p>
                We take your privacy seriously. The information you provide is used solely to generate
                personalized content. We do not store your input data longer than necessary to provide
                our services, and we never share your personal information with third parties.
              </p>
              
              <h2>Join Us</h2>
              <p>
                Try MakeMy.Bio today and experience the power of AI-assisted content creation. We're constantly
                adding new features and improving our existing ones based on user feedback. Have a suggestion?
                We'd love to hear from you!
              </p>
            </article>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
