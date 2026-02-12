import { useNavigate } from "react-router";

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price?: number;
}

export function ProductCard({ id, title, image, price }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border border-gray-300 rounded-lg p-6 bg-white transition-transform duration-300 ease-in-out hover:shadow-md cursor-pointer"
      onClick={() => navigate(`/produto/${id}`)}
    >
      <h3 className="text-base font-medium mb-6 font-jakarta">{title}</h3>
      <div className="flex items-center justify-center">
        <img src={image} alt={title} className="w-full h-auto max-w-[280px]" />
      </div>
      {price !== undefined && (
        <p className="text-center font-jakarta font-bold mt-4">
          R$ {price.toFixed(2).replace(".", ",")}
        </p>
      )}
    </div>
  );
}
