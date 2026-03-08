import type { Product } from "../../types/product"
import type { ShippingResponse } from "../../types/shipping"
import type { Order, OrderStatus } from "../../types/order"
import type { Address } from "../../types/address"

const WHATSAPP_NUMBER = "5571999999999" // Substituir pelo número real

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PAYMENT_CONFIRMED: "Pagamento confirmado",
  PROCESSING: "Em processamento",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
}

export const responses = {
  saudacao: () =>
    "Oi! 👋 Sou o assistente da loja. Posso te ajudar com:\n\n" +
    "1️⃣ Produtos\n" +
    "2️⃣ Frete\n" +
    "3️⃣ Minha conta\n" +
    "4️⃣ Pedidos\n" +
    "5️⃣ Falar com atendente\n\n" +
    "Digite o número ou descreva o que precisa!",

  menu: () =>
    "Como posso te ajudar?\n\n" +
    "1️⃣ Produtos\n" +
    "2️⃣ Frete\n" +
    "3️⃣ Minha conta\n" +
    "4️⃣ Pedidos\n" +
    "5️⃣ Falar com atendente",

  // Produtos
  listarProdutos: (products: Product[], total: number) => {
    if (products.length === 0) return "Não encontrei produtos disponíveis no momento."
    const list = products.slice(0, 5).map((p) => `• ${p.name} — R$ ${p.price.toFixed(2)}`).join("\n")
    const extra = total > 5 ? `\n\n...e mais ${total - 5} produto(s). Quer buscar por nome?` : ""
    return `Encontrei ${total} produto(s) ativos:\n\n${list}${extra}\n\nDigite o nome de um produto para mais detalhes ou "menu" para voltar.`
  },

  buscarProdutoPedir: () => "Qual o nome do produto que você procura?",

  buscarProdutoResultado: (products: Product[], nome: string) => {
    if (products.length === 0) return `Não encontrei produtos para "${nome}". Tente outro nome ou digite "menu" para voltar.`
    const list = products.slice(0, 5).map((p) => `• [${p.id}] ${p.name} — R$ ${p.price.toFixed(2)}`).join("\n")
    return `Achei ${products.length} produto(s) para "${nome}":\n\n${list}\n\nDigite o número (ID) do produto para ver detalhes.`
  },

  detalheProduto: (p: Product) => {
    const estoque = p.stock > 0 ? `${p.stock} em estoque` : "⚠️ Esgotado"
    return `📦 ${p.name}\n💰 R$ ${p.price.toFixed(2)}\n📋 ${p.description}\n📊 ${estoque}`
  },

  detalheProdutoPedirId: () => "Digite o ID do produto que deseja ver.",

  // Frete
  fretePedirCep: () => "Para calcular o frete, me envie seu CEP com 8 dígitos.",

  freteResultado: (shipping: ShippingResponse) => {
    const valor = shipping.freeShipping
      ? "GRÁTIS 🎉"
      : `R$ ${shipping.shippingCost.toFixed(2)}`
    return `📍 CEP: ${shipping.zipCode}\n🏙️ ${shipping.city} - ${shipping.state} (${shipping.region})\n🚚 Frete: ${valor}`
  },

  freteRegra: () =>
    "No momento, frete para Nordeste (prefixo 40-65) é grátis. Para demais regiões, o valor é R$ 60,00.",

  freteCepInvalido: () => "CEP inválido. Por favor, envie um CEP com 8 dígitos numéricos.",

  // Conta
  loginRedirecionar: () =>
    "Para fazer login, acesse a página de login do site. Posso te ajudar com outra coisa?",

  cadastroRedirecionar: () =>
    "Para criar sua conta, acesse a página de cadastro do site. Posso te ajudar com outra coisa?",

  recuperarSenhaPedirEmail: () =>
    "Para recuperar sua senha, me informe seu e-mail cadastrado.",

  recuperarSenhaEnviado: () =>
    "Se o e-mail estiver cadastrado, você receberá um link de redefinição válido por 30 minutos. Verifique também sua caixa de spam.",

  // Pedidos
  pedidoListar: (orders: Order[]) => {
    if (orders.length === 0) return "Você ainda não tem pedidos registrados."
    const list = orders.slice(0, 5).map((o) =>
      `• #${o.orderNumber} — ${STATUS_LABELS[o.status] || o.status} — R$ ${o.total.toFixed(2)}`
    ).join("\n")
    return `Seus pedidos:\n\n${list}\n\nDeseja cancelar algum? Informe o número do pedido.`
  },

  pedidoCancelarPedirId: () => "Informe o ID do pedido que deseja cancelar.",

  pedidoCancelado: (orderNumber: string) =>
    `Pedido #${orderNumber} cancelado com sucesso.`,

  // Endereço
  enderecoListar: (addresses: Address[]) => {
    if (addresses.length === 0) return "Você não tem endereços cadastrados. Cadastre um na página 'Minha Conta'."
    const list = addresses.map((a) =>
      `• ${a.street}, ${a.number} — ${a.district} — CEP ${a.zipCode}${a.defaultAddress ? " ⭐" : ""}`
    ).join("\n")
    return `Seus endereços:\n\n${list}`
  },

  enderecoDefault: (a: Address) =>
    `Seu endereço padrão:\n📍 ${a.street}, ${a.number}\n🏘️ ${a.district} — ${a.cityName}\n📮 CEP: ${a.zipCode}`,

  // Auth required
  necessitaLogin: () =>
    "Você precisa estar logado para isso. Faça login no site e tente novamente.",

  // Confirmação
  confirmacaoResolucao: () =>
    "Consegui te ajudar? (sim/não)",

  resolucaoSim: () =>
    "Ótimo! 😊 Se precisar de algo mais, é só digitar. Digite \"menu\" para ver as opções.",

  resolucaoNao: () =>
    "Desculpe não ter resolvido. Posso te encaminhar para atendimento humano no WhatsApp ou tentar de outra forma.\n\n" +
    "1️⃣ Ver menu novamente\n" +
    "5️⃣ Falar com atendente",

  // Fallback / WhatsApp
  desconhecido: () =>
    "Não entendi sua mensagem. Tente digitar um número do menu ou descrever o que precisa.\n\n" +
    "1️⃣ Produtos | 2️⃣ Frete | 3️⃣ Conta | 4️⃣ Pedidos | 5️⃣ Atendente",

  whatsappLink: (intent: string, email: string, correlationId: string, erro?: string, resumo?: string) => {
    const parts = [
      `Olá, vim do chatbot do site.`,
      `Tema: ${intent}.`,
      `Cliente: ${email}.`,
      `Sessão: ${correlationId}.`,
    ]
    if (erro) parts.push(`Erro: ${erro}.`)
    if (resumo) parts.push(`Contexto: ${resumo}.`)
    const context = encodeURIComponent(parts.join(" "))
    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${context}`
    return `Vou te encaminhar para nosso atendimento no WhatsApp:\n\n👉 ${link}\n\nClique no link acima para falar com um atendente.`
  },

  // Erros granulares por status HTTP
  erroApi: () =>
    "Ocorreu um erro ao processar sua solicitação. Tente novamente em instantes ou fale com um atendente (digite 5).",

  erroNaoEncontrado: () =>
    "O recurso que você buscou não foi encontrado. Verifique os dados e tente novamente.",

  erroValidacao: (detail?: string) =>
    detail
      ? `Dados inválidos: ${detail}`
      : "Os dados enviados são inválidos. Verifique e tente novamente.",

  erroRateLimit: () =>
    "Muitas tentativas em pouco tempo. Aguarde alguns segundos e tente novamente.",

  erroServidor: () =>
    "O servidor está com problemas no momento. Tente novamente em instantes ou fale com um atendente (digite 5).",
}
