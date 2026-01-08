import tsCap from "../assets/tscap.png";
import tsPerso from "../assets/tsperso.png";

export function ProductFeatures() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-16 py-16">
        <div className="flex items-center justify-between gap-16">
          <div className="flex-1 flex justify-center">
            <img src={tsCap} alt="Boné e Camiseta" className="w-full h-auto max-w-[700px] hover:scale-[1.02] transition-transform duration-300" />
          </div>

          <div className="flex-1 flex justify-center">
            <div>
              <h2 className="text-4xl font-bold font-jakarta whitespace-nowrap">
                NAVEGUE PELO NOSSO CATÁLOGO
              </h2>
              <p className="text-lg font-jakarta text-black leading-snug whitespace-nowrap">
                Conheça todos os nossos produtos, para cada ocasião,
              </p>
              <p className="text-lg mb-6 font-jakarta text-black leading-snug whitespace-nowrap">
                temos uma opção para você!
              </p>
              <a
                href="/produtos"
                className="inline-block bg-black text-white px-10 py-4 rounded-full font-jakarta font-medium hover:opacity-90 transition-opacity duration-200"
              >
                Explore o catálogo de Produtos
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-16 -mt-16">
          <div className="flex-1 flex justify-center">
            <div>
              <h2 className="text-4xl font-bold font-jakarta text-blue-600 whitespace-nowrap">
                PERSONALIZE SEU PRODUTO
              </h2>
              <p className="text-lg font-jakarta text-black leading-snug whitespace-nowrap">
                Te damos total liberdade para personalizar os seus produtos
              </p>
              <p className="text-lg mb-6 font-jakarta text-black leading-snug whitespace-nowrap">
                tendo uma visualização 3D na nossa plataforma de como ficará o seu produto!
              </p>
              <a
                href="/personalizacao"
                className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full font-jakarta font-medium hover:opacity-90 transition-opacity duration-200"
              >
                QUERO PERSONALIZAR MEU PRODUTO
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <img src={tsPerso} alt="Camiseta Personalizada" className="w-full h-auto max-w-[700px] hover:scale-[1.02] transition-transform duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
