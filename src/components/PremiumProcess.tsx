import { useState } from "react";
import tecido from "../assets/tecido.png";
import man from "../assets/man.png";

const descriptions = [
  "Nossos bonés premium são produzidos em tecido algodão/brim peletizado, uma composição cuidadosamente escolhida por oferecer um toque macio, estrutura firme e durabilidade acima da média. O processo de peletização do tecido garante uma superfície mais encorpada e resistente, preservando o formato e as cores por muito mais tempo — mesmo com o uso frequente.",
  "Cada detalhe é pensado para durar: as costuras reforçadas resistem ao desgaste diário, o suor e a lavagem frequente. O tecido brim peletizado possui alta gramatura, o que significa maior densidade de fios — resultado direto em rigidez estrutural e toque premium. Nosso controle de qualidade garante que nenhum boné saia da produção sem atender aos padrões exigidos.",
];

export function PremiumProcess() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="my-12 md:my-16 lg:my-24 flex flex-col lg:flex-row lg:items-start lg:justify-center px-4 md:px-8 lg:px-0">

      <div className="hidden lg:block lg:w-[32rem] lg:h-[54rem] flex-shrink-0 relative bg-[#CFDDF9]">
        <img
          src={tecido}
          alt="Tecido"
          className="absolute bottom-0 w-full object-contain"
        />
      </div>

      <div className="flex flex-col lg:ml-[2.5rem] lg:h-[54rem]">
        <h2 className="font-jakarta font-bold text-[2rem] md:text-[2.5rem] lg:text-[3rem] leading-[0.89] tracking-[0] text-black text-center lg:text-left">
          COMO<br className="hidden lg:block" />
          {" "}PRODUZIMOS O<br className="hidden lg:block" />
          {" "}MODELO<br className="hidden lg:block" />
          {" "}PREMIUM
        </h2>

        <h3 className="font-jakarta font-semibold text-[1rem] md:text-[1.2rem] lg:text-[1.375rem] leading-[0.85] tracking-[0] text-black mt-[2rem] lg:mt-auto">
          Qualidade que você sente antes mesmo de usar
        </h3>

        <p className="font-jakarta font-medium text-[0.8rem] md:text-[0.875rem] leading-normal tracking-[0] text-black mt-[1rem] max-w-full lg:max-w-[44rem] transition-opacity duration-300">
          {descriptions[expanded ? 1 : 0]}
        </p>

        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-[1.5rem] lg:mt-[2rem] h-[2.4375rem] w-[11.5625rem] cursor-pointer rounded-full bg-black font-jakarta text-[0.75rem] font-normal tracking-[0.05em] text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-110"
        >
          {expanded ? "VER MENOS" : "QUERO SABER MAIS"}
        </button>

        <div className="mt-[2rem] lg:mt-auto w-full lg:w-[60rem] h-[22rem] md:h-[26rem] lg:h-[24.5rem] bg-[#CFDDF9] flex items-end justify-center md:justify-start lg:justify-center overflow-hidden flex-shrink-0">
          <img
            src={man}
            alt="Homem usando boné premium"
            className="w-[65%] md:w-[40%] lg:w-auto lg:h-[95%] object-contain lg:-translate-x-[8rem]"
          />
        </div>
      </div>

    </section>
  );
}
