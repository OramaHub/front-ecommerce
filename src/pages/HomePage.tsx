import { HeroSlider } from "../components/HeroSlider";
import { BestSellers } from "../components/BestSellers";
import { CatalogPreview } from "../components/CatalogPreview";

export function HomePage(){
    return (
        <div>
            <HeroSlider />
            <BestSellers />
            <CatalogPreview />
        </div>
    )
}
