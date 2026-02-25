import { StudioSection } from "../components/StudioSection";
import { HeroSlider } from "../components/HeroSlider";
import { PremiumProcess } from "../components/PremiumProcess";
import { BestSellers } from "../components/BestSellers";
import { DestinationsSection } from "../components/DestinationsSection";
import { Faq } from "../components/Faq";
import { Footer } from "../components/Footer";

export function HomePage(){
    return (
        <div>
            <HeroSlider />
            <BestSellers />
            <PremiumProcess />
            <StudioSection />
            <DestinationsSection />
            <Faq />
            <Footer />
        </div>
    )
}
