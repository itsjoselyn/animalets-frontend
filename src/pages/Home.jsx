import AboutSnippet from "../components/AboutSnippet";
import CatCarousel from "../components/CatCarousel";
import ContactBanner from "../components/ContactBanner";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import HowToHelp from "../components/HowToHelp";
import Testimonials from "../components/Testimonials";

export default function Home() {
    return (
        <>
            <HeroSection />
            <AboutSnippet />
            <CatCarousel />
            <HowItWorks />
            <HowToHelp />
            <Testimonials />
            <ContactBanner />
            <Footer />
        </>
    );
}