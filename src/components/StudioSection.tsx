import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Download, ShoppingCart } from "lucide-react";
import { R2_BASE } from "../constants/r2";

export function StudioSection() {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [delayDone, setDelayDone] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
          setTimeout(() => setDelayDone(true), 1200);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const delay = (ms: number) => delayDone ? "0ms" : revealed ? `${ms}ms` : "0ms";

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto">

        <div
          className={`text-center mb-12 md:mb-16 lg:mb-20 transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <span className="inline-block border border-black/20 rounded-full px-4 py-1 font-jakarta text-xs font-medium text-black mb-1.5 shadow-sm">
            Studio
          </span>
          <h2 className="font-jakarta font-bold text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.05] tracking-tight text-black">
            Transforme sua ideia<br />
            em Produto Real
          </h2>
          <p className="font-jakarta text-sm md:text-base text-black/50 mt-5 max-w-[34rem] mx-auto leading-relaxed">
            Envie sua logo, visualize a aplicação diretamente no modelo 3D e acompanhe
            em tempo real como sua personalização ficará antes mesmo do início da produção.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 items-start">

          <div className="relative">
            <div className="flex justify-end">
              <div
                className={`relative w-[62%] rounded-2xl overflow-hidden border border-black/[0.07] shadow-lg z-10 transition-all duration-700 ease-out hover:scale-[1.03] ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: delay(200) }}
              >
                <img
                  src={`${R2_BASE}/studio1.jpg`}
                  alt="Studio — Configure as cores"
                  className="w-full h-auto block"
                />
              </div>
            </div>
            <div
              className={`absolute top-1/2 -translate-y-1/2 left-0 w-[47%] rounded-2xl overflow-hidden border border-black/[0.07] shadow-sm z-0 transition-all duration-700 ease-out hover:scale-[1.03] ${revealed ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
              style={{ transitionDelay: delay(400) }}
            >
              <img
                src={`${R2_BASE}/studio2.jpg`}
                alt="Studio — Selecione seu modelo"
                className="w-full h-auto block"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center items-center self-center lg:px-4">
            <div
              className={`rounded-3xl p-8 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: delay(300) }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-jakarta font-bold text-base text-black">Carregue sua Logomarca</h3>
              </div>
              <p className="font-jakarta text-[0.8125rem] text-black/50 leading-relaxed">
                Envie sua logo em formato vetorial (.AI, .EPS, .SVG) ou imagem em alta resolução (mínimo 2000px). Nosso time ajusta proporções, bordado e posicionamento para garantir um acabamento profissional e fiel à sua marca.
              </p>
            </div>

            <div
              className={`rounded-3xl p-8 shadow-sm transition-all duration-300 ease-out hover:scale-[1.03] ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: delay(450) }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-jakarta font-bold text-base text-black">Resumo do Pedido</h3>
              </div>
              <p className="font-jakarta text-[0.8125rem] text-black/50 leading-relaxed">
                Revise o modelo do boné, cores selecionadas e posicionamento da logo antes de aprovar. Todas as configurações são conferidas para garantir que o produto final saia exatamente como você planejou.
              </p>
            </div>
          </div>

        </div>

        <div
          className={`flex justify-center mt-14 md:mt-20 transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: delay(600) }}
        >
          <button
            onClick={() => navigate("/personalize")}
            className="bg-black text-white font-jakarta font-medium text-xs tracking-[0.15em] uppercase px-10 py-4 rounded-full transition-all duration-300 ease-out hover:opacity-70 hover:scale-[1.03] cursor-pointer"
          >
            Criar meu boné
          </button>
        </div>

      </div>
    </section>
  );
}
