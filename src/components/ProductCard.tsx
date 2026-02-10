import { useNavigate } from "react-router";

interface ProductCardProps {
  title: string;
  image: string;
  slug?: string;
}

export function ProductCard({ title, image, slug }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border border-gray-300 rounded-lg p-6 bg-white transition-transform duration-300 ease-in-out hover:shadow-md cursor-pointer"
      onClick={() => slug && navigate(`/produto/${slug}`)}
    >
      <h3 className="text-base font-medium mb-6 font-jakarta">{title}</h3>
      <div className="flex items-center justify-center">
        <img src={image} alt={title} className="w-full h-auto max-w-[280px]" />
      </div>
    </div>
  );
}
