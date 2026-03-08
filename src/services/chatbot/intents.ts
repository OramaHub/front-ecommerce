export type Intent =
  | "SAUDACAO"
  | "LISTAR_PRODUTOS"
  | "BUSCAR_PRODUTO_NOME"
  | "DETALHE_PRODUTO"
  | "CALCULAR_FRETE"
  | "LOGIN"
  | "CADASTRO"
  | "RECUPERAR_SENHA"
  | "RESET_SENHA"
  | "PEDIDO_LISTAR"
  | "PEDIDO_CANCELAR"
  | "ENDERECO_LISTAR"
  | "ENDERECO_DEFAULT"
  | "FALAR_ATENDENTE"
  | "MENU"
  | "SIM"
  | "NAO"
  | "DESCONHECIDO"

interface IntentPattern {
  intent: Intent
  keywords: string[]
}

const intentPatterns: IntentPattern[] = [
  {
    intent: "SAUDACAO",
    keywords: ["oi", "ola", "olá", "bom dia", "boa tarde", "boa noite", "hey", "eai", "e ai", "hello"],
  },
  {
    intent: "LISTAR_PRODUTOS",
    keywords: ["listar produtos", "ver produtos", "mostrar produtos", "catalogo", "catálogo", "produtos disponiveis", "produtos disponíveis"],
  },
  {
    intent: "BUSCAR_PRODUTO_NOME",
    keywords: ["buscar produto", "procurar produto", "pesquisar produto", "encontrar produto", "tem o produto"],
  },
  {
    intent: "DETALHE_PRODUTO",
    keywords: ["detalhe produto", "detalhes do produto", "info produto", "informacao produto", "informação produto"],
  },
  {
    intent: "CALCULAR_FRETE",
    keywords: ["frete", "cep", "entrega", "envio", "calcular frete", "custo entrega", "valor entrega", "shipping"],
  },
  {
    intent: "LOGIN",
    keywords: ["login", "entrar", "acessar conta", "fazer login", "logar"],
  },
  {
    intent: "CADASTRO",
    keywords: ["cadastro", "cadastrar", "criar conta", "registrar", "registro", "nova conta"],
  },
  {
    intent: "RECUPERAR_SENHA",
    keywords: ["esqueci senha", "recuperar senha", "esqueci minha senha", "redefinir senha", "perdi senha", "resetar senha"],
  },
  {
    intent: "PEDIDO_LISTAR",
    keywords: ["meus pedidos", "ver pedidos", "listar pedidos", "pedido", "status pedido", "acompanhar pedido", "rastrear"],
  },
  {
    intent: "PEDIDO_CANCELAR",
    keywords: ["cancelar pedido", "cancela pedido", "desistir pedido", "cancelamento"],
  },
  {
    intent: "ENDERECO_LISTAR",
    keywords: ["meus enderecos", "meus endereços", "ver enderecos", "listar enderecos", "endereco", "endereço"],
  },
  {
    intent: "ENDERECO_DEFAULT",
    keywords: ["endereco padrao", "endereço padrão", "endereco principal", "endereço principal"],
  },
  {
    intent: "FALAR_ATENDENTE",
    keywords: ["atendente", "humano", "suporte", "falar com alguem", "falar com alguém", "whatsapp", "ajuda humana", "pessoa real"],
  },
  {
    intent: "MENU",
    keywords: ["menu", "opcoes", "opções", "voltar", "inicio", "início", "começar", "recomeçar"],
  },
  {
    intent: "SIM",
    keywords: ["sim", "s", "yes", "claro", "com certeza", "isso", "exato"],
  },
  {
    intent: "NAO",
    keywords: ["nao", "não", "n", "no", "nope", "negativo"],
  },
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function recognizeIntent(message: string): Intent {
  const normalized = normalize(message)

  // Menu numérico
  const menuMap: Record<string, Intent> = {
    "1": "LISTAR_PRODUTOS",
    "2": "CALCULAR_FRETE",
    "3": "RECUPERAR_SENHA",
    "4": "PEDIDO_LISTAR",
    "5": "FALAR_ATENDENTE",
  }
  if (menuMap[normalized]) return menuMap[normalized]

  // Verificar keyword match
  for (const pattern of intentPatterns) {
    for (const keyword of pattern.keywords) {
      const normalizedKeyword = normalize(keyword)
      if (normalized.includes(normalizedKeyword)) {
        return pattern.intent
      }
    }
  }

  return "DESCONHECIDO"
}

export function extractCep(message: string): string | null {
  const match = message.replace(/\D/g, "").match(/^\d{8}$/) ||
    message.match(/\d{5}-?\d{3}/)
  if (match) {
    return match[0].replace("-", "")
  }
  return null
}

export function extractProductName(message: string): string {
  return message
    .replace(/buscar|procurar|pesquisar|encontrar|produto|tem o/gi, "")
    .trim()
}

export function extractNumber(message: string): number | null {
  const match = message.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}
