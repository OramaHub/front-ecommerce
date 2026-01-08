import tsCap from "../assets/tscap.png";
import tsPerso from "../assets/tsperso.png";

export function ProductFeatures() {
  return (
    <section className="bg-white">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16">
          <div className="flex-1 flex justify-center w-full">
            <img src={tsCap} alt="Boné e Camiseta" className="w-full h-auto max-w-[500px] md:max-w-[600px] lg:max-w-[700px] hover:scale-[1.02] transition-transform duration-300" />
          </div>

          <div className="flex-1 flex justify-center w-full">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta">
                NAVEGUE PELO NOSSO CATÁLOGO
              </h2>
              <p className="text-base md:text-lg mb-6 font-jakarta text-black leading-snug">
                Conheça todos os nossos produtos, para cada ocasião temos uma
                <br className="hidden md:block" />
                opção para você!
              </p>
              <a
                href="/produtos"
                className="inline-block bg-black text-white px-8 md:px-10 lg:px-12 py-2.5 md:py-3 text-sm md:text-base rounded-full font-jakarta font-medium"
              >
                Explore o catálogo de Produtos
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 lg:gap-16 mt-8 md:mt-0 lg:-mt-16">
          <div className="flex-1 flex justify-center w-full order-2 lg:order-1">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta text-blue-600">
                PERSONALIZE SEU PRODUTO
              </h2>
              <p className="text-base md:text-lg mb-6 font-jakarta text-black leading-snug">
                Te damos total liberdade para personalizar os seus produtos
                <br className="hidden md:block" />
                tendo uma visualização 3D na nossa plataforma de como
                <br className="hidden md:block" />
                ficará o seu produto!
              </p>
              <a
                href="/personalizacao"
                className="inline-block bg-blue-600 text-white px-8 md:px-10 lg:px-12 py-2.5 md:py-3 text-sm md:text-base rounded-full font-jakarta font-medium"
              >
                QUERO PERSONALIZAR MEU PRODUTO
              </a>
            </div>
          </div>

          <div className="flex-1 flex justify-center w-full order-1 lg:order-2">
            <img src={tsPerso} alt="Camiseta Personalizada" className="w-full h-auto max-w-[500px] md:max-w-[600px] lg:max-w-[700px] hover:scale-[1.02] transition-transform duration-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
