import AboutSnippet from "../components/home/AboutSnippet";
import CatCarousel from "../components/home/CatCarousel";
import ContactBanner from "../components/home/ContactBanner";
import HeroSection from "../components/home/HeroSection";
import HowItWorks from "../components/home/HowItWorks";
import HowToHelp from "../components/home/HowToHelp";
import Testimonials from "../components/home/Testimonials";

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
        </>
    );
}