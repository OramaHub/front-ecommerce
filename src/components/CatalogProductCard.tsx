interface CatalogProductCardProps {
  label: string;
  image: string;
  title: string;
  colors: number;
  price: string;
  badge?: string;
}

export function CatalogProductCard({ label, image, title, colors, price, badge }: CatalogProductCardProps) {
  return (
    <div className="group rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="bg-white p-6 relative rounded-t-xl">
        {badge && (
          <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full font-jakarta">
            {badge}
          </span>
        )}
        <p className="text-xs font-semibold mb-4 font-jakarta tracking-wide text-black/70">{label}</p>
        <div className="flex items-center justify-center min-h-[240px] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-auto max-w-[220px] object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-white text-lg font-semibold font-jakarta mb-6 group-hover:text-white/90 transition-colors">
          {title}
        </h3>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-1.5">
              <div className="w-5 h-5 rounded-full bg-black border-2 border-white shadow-md"></div>
              <div className="w-5 h-5 rounded-full bg-white border-2 border-gray-300 shadow-md"></div>
              <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
              <div className="w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-md"></div>
            </div>
            <span className="text-white font-medium text-xs font-jakarta">+{colors}</span>
          </div>

          <div className="text-right">
            <p className="text-white/60 text-[10px] font-jakarta font-medium uppercase tracking-wider">A partir de</p>
            <p className="text-white text-3xl font-bold font-jakarta tracking-tight leading-none">{price}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
