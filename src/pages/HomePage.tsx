import { StudioSection } from "../components/StudioSection";
import { HeroSlider } from "../components/HeroSlider";
import { PremiumProcess } from "../components/PremiumProcess";
import { BestSellers } from "../components/BestSellers";
import { VideoBanner } from "../components/VideoBanner";
import { LifestyleSection } from "../components/LifestyleSection";
import { DestinationsSection } from "../components/DestinationsSection";
import { Faq } from "../components/Faq";
import { Footer } from "../components/Footer";

export function HomePage() {
    return (
        <div>
            <HeroSlider />
            <BestSellers />
            <VideoBanner />
            <PremiumProcess />
            <StudioSection />
            <LifestyleSection />
            <DestinationsSection />
            <Faq />
            <Footer />
        </div>
    )
}
