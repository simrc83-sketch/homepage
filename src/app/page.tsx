import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import MarqueeSection from "@/components/MarqueeSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <FeaturedProjects />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
