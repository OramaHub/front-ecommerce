import { DestinationsCarousel } from "./DestinationsCarousel";
import { caps } from "../data/caps";

export function DestinationsSection() {
  return (
    <section className="w-full overflow-hidden py-16 md:py-20 lg:py-28">
      <DestinationsCarousel caps={caps} />
    </section>
  );
}
