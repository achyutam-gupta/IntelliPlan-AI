import React from 'react';
import { Navbar } from '../components/lovable/Navbar';
import { Hero } from '../components/lovable/Hero';
import { Stats } from '../components/lovable/Stats';
import { Features } from '../components/lovable/Features';
import { HowItWorks } from '../components/lovable/HowItWorks';
import { Capabilities } from '../components/lovable/Capabilities';
import { Testimonials } from '../components/lovable/Testimonials';
import { Pricing } from '../components/lovable/Pricing';
import { CTA } from '../components/lovable/CTA';
import { Footer } from '../components/lovable/Footer';
import { ParticleGrid } from '../components/lovable/ParticleGrid';
import { FloatingOrbs } from '../components/lovable/FloatingOrbs';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground noise">
      <ParticleGrid />
      <FloatingOrbs />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Capabilities />
        <Testimonials />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
