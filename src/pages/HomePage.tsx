import { HeroSlider } from "../components/HeroSlider";
import { BestSellers } from "../components/BestSellers";
import { DestinationsSection } from "../components/DestinationsSection";
import { CatalogPreview } from "../components/CatalogPreview";
import { Details } from "../components/Details";
import { ProductFeatures } from "../components/ProductFeatures";
import { MtBrasil } from "../components/MtBrasil";
import { Faq } from "../components/Faq";
import { Footer } from "../components/Footer";

export function HomePage(){
    return (
        <div>
            <HeroSlider />
            <BestSellers />
            <DestinationsSection />
            <CatalogPreview />
            <Details />
            <ProductFeatures />
            <MtBrasil />
            <Faq />
            <Footer />
        </div>
    )
}
