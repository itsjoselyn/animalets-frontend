import AboutSnippet from "../components/sections/Home/AboutSnippet";
import CatCarousel from "../components/sections/Home/CatCarousel";
import ContactBanner from "../components/sections/Home/ContactBanner";
import HeroSection from "../components/sections/Home/HeroSection";
import HowItWorks from "../components/sections/Home/HowItWorks";
import HowToHelp from "../components/sections/Home/HowToHelp";
import Testimonials from "../components/sections/Home/Testimonials";

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