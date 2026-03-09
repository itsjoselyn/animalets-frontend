import AboutSnippet from "../components/AboutSnippet";
import CatCarousel from "../components/CatCarousel";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import HowToHelp from "../components/HowToHelp";

export default function Home() {
    return (
        <>
            <HeroSection />
            <AboutSnippet />
            <CatCarousel />
            <HowItWorks />
            <HowToHelp />
        </>
    );
}