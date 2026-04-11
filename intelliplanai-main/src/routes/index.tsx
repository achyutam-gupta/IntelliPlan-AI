import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Capabilities } from "@/components/Capabilities";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { ParticleGrid } from "@/components/ParticleGrid";
import { FloatingOrbs } from "@/components/FloatingOrbs";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "IntelliPlan AI — From Requirements to Automation, Instantly" },
      { name: "description", content: "Generate test plans, test cases, and automation code instantly with AI. Ship quality software faster." },
      { property: "og:title", content: "IntelliPlan AI — From Requirements to Automation, Instantly" },
      { property: "og:description", content: "Generate test plans, test cases, and automation code instantly with AI." },
    ],
  }),
});

function Index() {
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
}
