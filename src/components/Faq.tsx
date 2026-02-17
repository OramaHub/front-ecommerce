import { Plus } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

const faqItems = [
  {
    value: "entrega",
    question: "Como funciona a entrega?",
    answer:
      "Frete com valor fixo de R$ 60,00 para todo o Brasil, exceto para a região Nordeste. O prazo de entrega varia de acordo com a sua localidade.",
  },
  {
    value: "personalizacao",
    question: "Posso personalizar os produtos?",
    answer:
      "Sim! Trabalhamos com personalização por bordado de alta definição. Você pode adicionar logos, nomes ou arte personalizada conforme sua necessidade. Entre em contato conosco para mais detalhes sobre o processo.",
  },
  {
    value: "pagamento",
    question: "Quais são as formas de pagamento?",
    answer:
      "Aceitamos Transferência Bancária, Boleto, PIX e Cartão. O pagamento é feito em 50% de entrada e o restante quando o pedido estiver pronto para envio.",
  },
  {
    value: "troca",
    question: "Como funciona a troca ou devolução?",
    answer:
      "Você tem até 7 dias após o recebimento para solicitar a troca ou devolução. O produto deve estar sem uso e em sua embalagem original. Entre em contato com nosso suporte para iniciar o processo.",
  },
  {
    value: "producao",
    question: "Qual o prazo de produção?",
    answer:
      "O prazo de produção varia de 5 a 10 dias úteis, dependendo da quantidade e do tipo de personalização solicitada. Após a produção, o pedido é despachado e o prazo de entrega passa a contar.",
  },
  {
    value: "pedido-minimo",
    question: "Existe pedido mínimo?",
    answer:
      "Condições especiais são oferecidas para empresas que já são clientes: a partir de 20 unidades iguais na Linha Comercial e 30 unidades iguais na Linha Premium.",
  },
];

export function Faq() {
  return (
    <section
      className="w-full bg-white py-16 md:py-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-20">
        <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-10">
          PERGUNTAS FREQUENTES
        </h2>

        <Accordion.Root type="multiple" className="space-y-0">
          {faqItems.map((item) => (
            <Accordion.Item
              key={item.value}
              value={item.value}
              className="border-b border-gray-200"
            >
              <Accordion.Trigger className="w-full flex items-center justify-between py-5 text-base md:text-lg font-medium hover:text-gray-600 group text-left">
                <span>{item.question}</span>
                <Plus className="w-5 h-5 flex-shrink-0 ml-4 transition-transform group-data-[state=open]:rotate-45" />
              </Accordion.Trigger>
              <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <div className="pb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
