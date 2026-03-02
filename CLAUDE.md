# CLAUDE.md — Frontend E-commerce MT Personalizados

Frontend React do e-commerce **MT Personalizados** (`mtpersonalizados.store`).
Backend Spring Boot em `C:\Users\Thiago Monteiro\Downloads\E-commerce`.

## Stack

- React 19.2.0
- TypeScript ~5.9.3
- Vite 7.2.4
- React Router 7.10.1
- Axios 1.13.5 (com interceptors JWT + refresh automático)
- Tailwind CSS 4.1.18
- Radix UI 1.x (componentes acessíveis)
- Swiper 12.0.3 (carrossel)
- Lucide React (ícones)

## Comandos

```bash
npm run dev       # dev server (porta padrão Vite)
npm run build     # tsc -b && vite build
npm run preview   # preview do build
```

## Variáveis de Ambiente

```
# .env.development
VITE_API_URL=http://localhost:8081

# .env.production
VITE_API_URL=https://mtpersonalizados.store
```

O arquivo `src/services/api.ts` usa `import.meta.env.VITE_API_URL` com fallback `http://localhost:8081`.

## Estrutura

```
src/
├── App.tsx              # AuthProvider > CartProvider > RoutesWrapper
├── routes.tsx           # React Router 7, todas as rotas
├── main.tsx             # Ponto de entrada
├── index.css            # Estilos globais (Tailwind)
├── pages/               # Uma página por rota
├── components/          # Componentes reutilizáveis
├── services/            # Clientes HTTP (Axios)
├── contexts/            # AuthContext, CartContext
├── types/               # Interfaces TypeScript
├── utils/               # masks.ts, validators.ts
├── data/                # Dados estáticos
├── assets/              # Imagens, fontes
└── declarations.d.ts
```

## Rotas

| Rota | Componente | Auth |
|------|-----------|------|
| `/` | `HomePage` | Pública |
| `/produtos` | `AllProductsPage` | Pública |
| `/produto/:id` | `ProductDetailsPage` | Pública |
| `/login` | `LoginPage` | Pública |
| `/cadastro` | `CreateAccountPage` | Pública |
| `/carrinho` | `Cart` | Autenticada |
| `/minha-conta` | `MyAccountPage` | Autenticada |
| `/recuperar-senha` | `ForgotPasswordPage` | Pública |
| `/redefinir-senha` | `ResetPasswordPage` | Pública |

Todas as rotas passam pelo `<Layout />` (Header + Outlet + Footer).

## Autenticação

- Tokens em `localStorage`: `accessToken`, `refreshToken`
- `AuthContext` gerencia estado de auth (login, logout, user decodificado do JWT)
- Interceptor Axios em `src/services/api.ts`:
  - Request: adiciona `Authorization: Bearer {token}`
  - Response 401: tenta refresh automático, fila de requests pendentes, redireciona `/login` se falhar
- JWT decodificado manualmente (sem biblioteca externa) — extrai `id`, `email`, `role`

## Contextos

### AuthContext (`src/contexts/AuthContext.tsx`)
- `user` — dados decodificados do JWT (`id`, `email`, `role`)
- `isAuthenticated`
- `login(email, password)` → chama `POST /api/auth/login`
- `logout()` → chama `POST /api/auth/logout`, limpa localStorage

### CartContext (`src/contexts/CartContext.tsx`)
- `cart` — carrinho ativo da API
- `itemCount` — soma das quantidades
- `addToCart(productId, quantity)`
- `updateQuantity(cartItemId, quantity)`
- `removeItem(cartItemId)`
- `clearCart()`
- `refreshCart()`
- Carrega ao autenticar, limpa ao fazer logout

## Serviços (`src/services/`)

Todos usam a instância `api` do Axios.

| Arquivo | Funções principais |
|---------|-------------------|
| `api.ts` | instância Axios + interceptors |
| `auth-service.ts` | `login`, `register`, `refresh`, `logout`, `forgotPassword`, `resetPassword` |
| `product-service.ts` | `getProducts`, `getProductById`, `searchByName` |
| `cart-service.ts` | `getActiveCart`, `addItem`, `updateItemQuantity`, `removeItem`, `clearCart` |
| `order-service.ts` | `createOrder`, `getClientOrders`, `cancelOrder` |
| `client-service.ts` | `getClient`, `updateClient`, `changePassword` |
| `address-service.ts` | `getAddresses`, `getDefaultAddress`, `createAddress`, `updateAddress`, `deleteAddress`, `setDefault` |

## Tipos (`src/types/`)

- `cart.ts` — `Cart`, `CartItem`
- `order.ts` — `Order`, `OrderItem`
- `address.ts` — `Address`
- Demais tipos definidos nos próprios arquivos ou `types/`

## Utilitários (`src/utils/`)

- `masks.ts` — máscaras para CPF (`000.000.000-00`) e telefone
- `validators.ts` — validação de CPF (algoritmo dígitos verificadores), email, etc.

## Componentes Principais (`src/components/`)

| Componente | Descrição |
|-----------|-----------|
| `Layout.tsx` | Wrapper com Header + Outlet + Footer |
| `Header.tsx` | Navbar com badge de carrinho (via `useCart`) |
| `Footer.tsx` | Rodapé |
| `NavigationMenu.tsx` | Menu de navegação (Radix UI) |
| `HeroSlider.tsx` | Slider da home |
| `BestSellers.tsx` | Seção mais vendidos |
| `CatalogPreview.tsx` | Preview catálogo (6 produtos da API) |
| `CatalogProductCard.tsx` | Card clicável → `/produto/{id}` |
| `ProductCard.tsx` | Card genérico de produto |
| `ProductFeatures.tsx` | Features/benefícios do produto |
| `PremiumProcess.tsx` | Seção "Como produzimos" |
| `DestinationsSection.tsx` | Seção destinos |
| `DestinationsCarousel.tsx` | Carrossel (Swiper) |
| `MtBrasil.tsx` | Seção MT Brasil |
| `StudioSection.tsx` | Seção estúdio |
| `Details.tsx` | Detalhes |
| `Faq.tsx` | Perguntas frequentes (Radix Accordion) |

## Páginas Principais

### `MyAccountPage.tsx`
4 abas: Meus Dados, Alterar Senha, Endereços, Meus Pedidos.
Redireciona para `/login` se não autenticado.

### `Cart.tsx`
Lista itens do carrinho via `useCart()`. Alterar quantidade, remover item e finalizar compra (`POST /api/orders`).

### `ProductDetailsPage.tsx`
Botão "Comprar sem estampa" → `addToCart(product.id, 1)` → redireciona para `/carrinho`.

### `CreateAccountPage.tsx`
Formulário com máscara e validação de CPF/telefone no frontend + erros por campo vindos da API.

## Padrões e Convenções

- **Medidas responsivas:** usar `rem` em vez de `px` onde possível
- **Tailwind:** estilização via classes, sem CSS inline exceto quando necessário
- **Fontes:** Plus Jakarta Sans (fonte principal)
- **Sem comentários no código**
- **Sem Lodash/moment** — usar APIs nativas do JavaScript
- **Sem bibliotecas de form** — controle manual de estado
- **Imports absolutos** não configurados — usar caminhos relativos
- **Nenhum `console.log`** em produção

## API Backend

- Base URL: `VITE_API_URL` (dev: `http://localhost:8081`, prod: `https://mtpersonalizados.store`)
- Swagger: `http://localhost:8081/swagger-ui.html`
- Ver `docs/api-backend.md` para todos os endpoints

## Deploy

- Frontend servido como estático pelo Nginx no servidor Hetzner
- Diretório no servidor: `/var/www/ecommerce/dist/`
- Build: `npm run build` → pasta `dist/`
- CD automático via GitHub Actions → SSH → `npm install && npm run build`

## Status

### Implementado
- Auth completo (login, register, logout, forgot/reset password)
- Catálogo de produtos integrado com API
- Carrinho integrado com API + CartContext
- Página Minha Conta (dados, senha, endereços, pedidos)
- Máscara e validação de CPF e telefone
- Badge de itens no Header
- Interceptor de refresh token automático
- Todas as rotas do frontend

### Pendente
- Painel administrativo
- Integração de pagamento no frontend (Stripe Checkout)
- Imagens reais dos produtos (atualmente fallback local)
- Frete calculado via API (atualmente só frontend por prefixo CEP)
- Notificações por email após pedido
- SEO: meta tags dinâmicas, sitemap, robots.txt
