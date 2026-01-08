import whatsappIcon from "../assets/whatsapp-icon.svg";

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 md:gap-12 lg:gap-48">
          <div className="flex-1 max-w-[350px]">
            <h2 className="text-xl font-bold mb-3 font-jakarta">MT PERSONALIZADOS</h2>
            <p className="text-xs text-white/70 leading-relaxed font-jakarta">
              A MT PERSONALIZADOS está no mercado a mais de 10 anos, confeccionando produtos personalizados para mais de 40 mil clientes em todo o Brasil, somando mais de 4 milhões de produtos entregues.
            </p>
          </div>

          <div className="grid grid-cols-2 md:flex md:gap-20">
            <div>
              <h3 className="text-sm font-semibold mb-3 font-jakarta">Produtos</h3>
              <ul className="space-y-1.5">
                <li>
                  <a href="/bones" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Bonés
                  </a>
                </li>
                <li>
                  <a href="/camisas" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Camisas
                  </a>
                </li>
                <li>
                  <a href="/viseiras" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Viseiras
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 font-jakarta">Serviços</h3>
              <ul className="space-y-1.5">
                <li>
                  <a href="/personalizar" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Personalizar
                  </a>
                </li>
                <li>
                  <a href="/atacado" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Atacado
                  </a>
                </li>
                <li>
                  <a href="/varejo" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Varejo
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 font-jakarta">Institucional</h3>
              <ul className="space-y-1.5">
                <li>
                  <a href="/sobre" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="/avaliacoes" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Avaliações
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 font-jakarta">Suporte</h3>
              <ul className="space-y-1.5">
                <li>
                  <a href="/faq" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Perguntas frequentes
                  </a>
                </li>
                <li>
                  <a href="/politica-trocas" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Política de trocas e cancelamento
                  </a>
                </li>
                <li>
                  <a href="/producao" className="text-xs text-white/70 hover:text-white transition-colors font-jakarta">
                    Produção e entrega
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl font-jakarta font-medium text-sm hover:bg-gray-100 transition-colors"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-4 h-4" />
              Comprar pelo Whatsapp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
