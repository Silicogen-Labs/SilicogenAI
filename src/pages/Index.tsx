import Navbar from "@/components/landing/Navbar";

import HeroSection from "@/components/landing/HeroSection";
import LogoCarousel from "@/components/landing/LogoCarousel";

import DemoSection from "@/components/landing/DemoSection";
import HowItWorks from "@/components/landing/HowItWorks";
import ModelsSection from "@/components/landing/ModelsSection";
import PricingSection from "@/components/landing/PricingSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <HeroSection />
      <LogoCarousel />
      
      <DemoSection />
      <HowItWorks />
      <ModelsSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default Index;
