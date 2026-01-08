import { HeroSlider } from "../components/HeroSlider";
import { BestSellers } from "../components/BestSellers";
import { CatalogPreview } from "../components/CatalogPreview";
import { Details } from "../components/Details";
import { ProductFeatures } from "../components/ProductFeatures";

export function HomePage(){
    return (
        <div>
            <HeroSlider />
            <BestSellers />
            <CatalogPreview />
            <Details />
            <ProductFeatures />
        </div>
    )
}
