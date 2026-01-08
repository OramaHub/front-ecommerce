# Documentação da API Backend - E-commerce

## Informações Gerais

**URL Base**: `http://localhost:8080/api`
**Tecnologia**: Spring Boot 3.5.6 + Java 21
**Banco de Dados**: PostgreSQL 16
**Autenticação**: JWT (JSON Web Tokens)

## Configuração Inicial

### Headers Necessários

```javascript
// Para requisições autenticadas
{
  "Authorization": "Bearer {seu_token_jwt}",
  "Content-Type": "application/json"
}

// Para requisições públicas
{
  "Content-Type": "application/json"
}
```

### URLs e Portas

- **API Backend**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **pgweb (Interface DB)**: http://localhost:8081

---

## Autenticação

### Fluxo de Autenticação

1. **Registro**: POST `/api/auth/register` - cria usuário e retorna token
2. **Login**: POST `/api/auth/login` - autentica e retorna token
3. **Requisições**: Usar token no header `Authorization: Bearer {token}`

### Endpoints de Autenticação

#### POST `/api/auth/register`
Registra novo usuário e retorna token JWT.

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321"
}
```

**Validações**:
- `name`: obrigatório, máx 150 caracteres
- `email`: obrigatório, formato válido, máx 100 caracteres, único
- `password`: obrigatório
- `cpf`: obrigatório, exatamente 11 caracteres, único
- `phone`: obrigatório, máx 30 caracteres

**Response** (201 Created):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400000
}
```

#### POST `/api/auth/login`
Autentica usuário existente.

**Request Body**:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400000
}
```

**Token JWT**:
- Validade: 24 horas (86400000ms)
- Claims: email (subject), clientId (claim "id"), iat, exp
- Algoritmo: HMAC SHA-256

**Como Decodificar o Token JWT**:
```javascript
// Usando jwt-decode (npm install jwt-decode)
import { jwtDecode } from 'jwt-decode';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const decoded = jwtDecode(token);

console.log(decoded.sub);  // email do usuário
console.log(decoded.id);   // clientId
console.log(decoded.exp);  // timestamp de expiração
console.log(decoded.iat);  // timestamp de emissão

// Verificar se token expirou
const isExpired = decoded.exp * 1000 < Date.now();
```

**Regex de Validação de Email**:
```javascript
const emailRegex = /^[a-z0-9.+-_]+@[a-z0-9.-]+\.[a-z]{2,}$/;
```

---

## Produtos

### GET `/api/products`
Lista todos os produtos ativos (paginado).

**Query Params**:
- `page`: número da página (default: 0)
- `size`: tamanho da página (default: 20)
- `sort`: campo de ordenação (ex: `name,asc`)

**Response** (200 OK):
```json
{
  "content": [
    {
      "id": 1,
      "name": "Notebook Dell",
      "description": "Notebook i7 16GB RAM",
      "price": 3500.00,
      "stock": 10,
      "active": true,
      "createdAt": "2025-01-07T10:00:00Z",
      "updatedAt": "2025-01-07T10:00:00Z",
      "images": [
        {
          "id": 1,
          "imageUrl": "https://example.com/image.jpg",
          "createdAt": "2025-01-07T10:00:00Z"
        }
      ]
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 20
  },
  "totalPages": 1,
  "totalElements": 1,
  "last": true,
  "first": true
}
```

### GET `/api/products/{id}`
Busca produto específico por ID.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Notebook Dell",
  "description": "Notebook i7 16GB RAM",
  "price": 3500.00,
  "stock": 10,
  "active": true,
  "createdAt": "2025-01-07T10:00:00Z",
  "updatedAt": "2025-01-07T10:00:00Z",
  "images": []
}
```

### GET `/api/products/all`
Lista todos os produtos incluindo inativos (paginado). **Requer ADMIN**.

**Query Params**:
- `page`: número da página (default: 0)
- `size`: tamanho da página (default: 20)
- `sort`: campo de ordenação

**Response**: Mesmo formato de GET `/api/products`, mas inclui produtos com `active: false`

### GET `/api/products/name?name={nome}`
Busca produtos por nome (case-insensitive, paginado).

**Query Params**:
- `name`: termo de busca (obrigatório)
- `page`, `size`, `sort`: paginação

**Exemplo**: `/api/products/name?name=notebook&page=0&size=10`

### POST `/api/products`
Cria novo produto. **Requer ADMIN**.

**Request Body**:
```json
{
  "name": "Notebook Dell",
  "description": "Notebook i7 16GB RAM",
  "price": 3500.00,
  "stock": 10
}
```

**Validações**:
- `name`: obrigatório
- `price`: obrigatório, mínimo 0.01
- `stock`: obrigatório, mínimo 0

### PUT `/api/products/{id}`
Atualiza produto existente. **Requer ADMIN**.

**Request Body**:
```json
{
  "name": "Notebook Dell Atualizado",
  "description": "Nova descrição",
  "price": 3800.00,
  "stock": 15
}
```

**Response** (200 OK): Produto atualizado completo

### PATCH `/api/products/{id}/stock/adjust`
Ajusta estoque (adiciona ou remove). **Requer ADMIN**.

**Request Body**:
```json
{
  "quantity": 5  // positivo adiciona, negativo remove
}
```

**Validação**: Não permite que estoque fique negativo

**Response** (200 OK): Produto atualizado

### PATCH `/api/products/{id}/stock/set`
Define valor absoluto do estoque. **Requer ADMIN**.

**Request Body**:
```json
{
  "newStockValue": 50
}
```

**Validação**: `newStockValue` deve ser >= 0

**Response** (200 OK): Produto atualizado

### PATCH `/api/products/{id}/deactivate`
Desativa produto. **Requer ADMIN**.

### PATCH `/api/products/{id}/activate`
Ativa produto. **Requer ADMIN**.

---

## Carrinho

### GET `/api/carts/{id}`
Busca carrinho por ID. **Requer autenticação**.

**Response** (200 OK): Objeto Cart completo

### GET `/api/carts/client/{clientId}/active`
Busca ou cria carrinho ativo do cliente. **Requer autenticação**.

**Response** (200 OK):
```json
{
  "id": 1,
  "sessionId": "abc123",
  "clientId": 1,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Notebook Dell",
      "quantity": 2,
      "unitPrice": 3500.00
    }
  ],
  "createdAt": "2025-01-07T10:00:00Z",
  "updatedAt": "2025-01-07T10:00:00Z"
}
```

### POST `/api/carts/client/{clientId}/items`
Adiciona item ao carrinho. **Requer autenticação**.

**Request Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

**Regra**: Se produto já existe no carrinho, atualiza quantidade.

**Response** (201 Created): Objeto completo do carrinho atualizado.

### PUT `/api/carts/client/{clientId}/items/{cartItemId}`
Atualiza quantidade de item. **Requer autenticação**.

**Request Body**:
```json
{
  "quantity": 5
}
```

### DELETE `/api/carts/client/{clientId}/items/{cartItemId}`
Remove item específico do carrinho. **Requer autenticação**.

### DELETE `/api/carts/client/{clientId}/clear`
Limpa todos os itens do carrinho. **Requer autenticação**.

**Response**: 204 No Content

---

## Pedidos (Orders)

### POST `/api/orders`
Cria novo pedido a partir de um carrinho. **Requer autenticação**.

**Request Body**:
```json
{
  "cartId": 1,
  "discount": 50.00
}
```

**Validações**:
- `cartId`: obrigatório, positivo
- `discount`: zero ou positivo, não pode exceder subtotal
- Carrinho não pode estar vazio

**Regras de Negócio**:
- Gera número único: `ORD-{timestamp}-{UUID}`
- Status inicial: `PENDING`
- Calcula: `total = subtotal - discount`

**Response** (201 Created):
```json
{
  "id": 1,
  "orderNumber": "ORD-1704625200000-abc123",
  "orderDate": "2025-01-07T10:00:00Z",
  "status": "PENDING",
  "subtotal": 7000.00,
  "discount": 50.00,
  "total": 6950.00,
  "clientId": 1,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Notebook Dell",
      "quantity": 2,
      "unitPrice": 3500.00
    }
  ],
  "deliveryAddress": {
    "id": 1,
    "street": "Rua das Flores",
    "number": "123",
    "district": "Centro",
    "zipCode": "12345-678",
    "city": "São Paulo",
    "state": "SP"
  }
}
```

### GET `/api/orders`
Lista todos os pedidos. **Requer autenticação**.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-1704625200000-abc123",
    "orderDate": "2025-01-07T10:00:00Z",
    "status": "PENDING",
    "subtotal": 7000.00,
    "discount": 50.00,
    "total": 6950.00,
    "clientId": 1
  }
]
```

### GET `/api/orders/{id}`
Busca pedido por ID. **Requer autenticação**.

**Response** (200 OK): Objeto Order completo com items e deliveryAddress

### GET `/api/orders/client/{clientId}`
Lista pedidos de um cliente. **Requer autenticação**.

**Response** (200 OK): Array de pedidos.

### GET `/api/orders/number/{orderNumber}`
Busca pedido pelo número do pedido.

### PATCH `/api/orders/{id}/status?status={status}`
Atualiza status do pedido. **Requer autenticação**.

**Status possíveis**:
- `PENDING`: Pendente
- `PAYMENT_CONFIRMED`: Pagamento confirmado
- `PROCESSING`: Em processamento
- `SHIPPED`: Enviado
- `DELIVERED`: Entregue
- `CANCELLED`: Cancelado
- `REFUNDED`: Reembolsado

**Exemplo**: `/api/orders/1/status?status=PAYMENT_CONFIRMED`

### PATCH `/api/orders/{id}/cancel`
Cancela pedido. **Requer autenticação**.

---

## Endereços

Todos os endpoints requerem autenticação.

### POST `/api/addresses`
Cria novo endereço.

**Request Body**:
```json
{
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 45",
  "district": "Centro",
  "zipCode": "12345-678",
  "cityId": 1,
  "defaultAddress": true
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "street": "Rua das Flores",
  "number": "123",
  "complement": "Apto 45",
  "district": "Centro",
  "zipCode": "12345-678",
  "defaultAddress": true,
  "city": {
    "id": 1,
    "name": "São Paulo",
    "ibgeCode": "3550308",
    "state": {
      "id": 1,
      "name": "São Paulo",
      "uf": "SP",
      "country": {
        "id": 1,
        "name": "Brasil",
        "code": "BR"
      }
    }
  },
  "createdAt": "2025-01-07T10:00:00Z"
}
```

### GET `/api/addresses`
Lista endereços do usuário autenticado.

### GET `/api/addresses/{id}`
Busca endereço específico (deve ser do próprio usuário).

### GET `/api/addresses/default`
Busca endereço padrão do usuário.

### PUT `/api/addresses/{id}`
Atualiza endereço (deve ser do próprio usuário).

### DELETE `/api/addresses/{id}`
Remove endereço (deve ser do próprio usuário).

### PATCH `/api/addresses/{id}/set-default`
Define endereço como padrão (remove flag dos outros).

---

## Localizações (Países, Estados, Cidades)

### GET `/api/locations/countries`
Lista todos os países.

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "Brasil",
    "code": "BR",
    "createdAt": "2025-01-07T10:00:00Z"
  }
]
```

### GET `/api/locations/countries/{id}`
Busca país específico por ID.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Brasil",
  "code": "BR",
  "createdAt": "2025-01-07T10:00:00Z"
}
```

### GET `/api/locations/states`
Lista todos os estados.

**Response** (200 OK): Array de estados

### GET `/api/locations/states?countryId={id}`
Lista estados (opcionalmente filtrados por país).

**Query Params**:
- `countryId` (opcional): filtra por país

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "São Paulo",
    "uf": "SP",
    "countryId": 1,
    "createdAt": "2025-01-07T10:00:00Z"
  }
]
```

### GET `/api/locations/cities?stateId={id}&name={nome}`
Lista cidades (filtradas por estado ou nome).

**Query Params**:
- `stateId` (opcional): filtra por estado
- `name` (opcional): busca por nome

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "name": "São Paulo",
    "ibgeCode": "3550308"
  }
]
```

### GET `/api/locations/states/{id}`
Busca estado específico por ID.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "São Paulo",
  "uf": "SP",
  "country": {
    "id": 1,
    "name": "Brasil",
    "code": "BR"
  },
  "createdAt": "2025-01-07T10:00:00Z"
}
```

### GET `/api/locations/cities/{id}`
Busca cidade específica com detalhes completos.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "São Paulo",
  "ibgeCode": "3550308",
  "state": {
    "id": 1,
    "name": "São Paulo",
    "uf": "SP"
  },
  "createdAt": "2025-01-07T10:00:00Z"
}
```

### POST `/api/locations/cities/import`
Importa cidades de arquivo CSV. **Requer ADMIN**.

**Response** (200 OK): Mensagem de sucesso

### GET `/api/locations/cities/count`
Retorna total de cidades cadastradas.

**Response** (200 OK):
```json
5570
```

---

## Clientes

### GET `/api/clients/{id}`
Busca cliente por ID. **Requer: próprio usuário ou ADMIN**.

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321",
  "active": true,
  "role": "USER",
  "createdAt": "2025-01-07T10:00:00Z"
}
```

### GET `/api/clients`
Lista clientes ativos (paginado). **Requer ADMIN**.

**Query Params**:
- `page`: número da página (default: 0)
- `size`: tamanho da página (default: 20)
- `sort`: campo de ordenação

**Response** (200 OK): Page<ClientResponseDto>

### GET `/api/clients/email?email={email}`
Busca cliente por email. **Requer ADMIN**.

**Query Params**:
- `email`: email do cliente (obrigatório)

**Response** (200 OK): ClientResponseDto

### GET `/api/clients/cpf?cpf={cpf}`
Busca cliente por CPF. **Requer ADMIN**.

**Query Params**:
- `cpf`: CPF do cliente (obrigatório)

**Response** (200 OK): ClientResponseDto

### GET `/api/clients/role?role={role}`
Lista clientes por role (paginado). **Requer ADMIN**.

**Query Params**:
- `role`: USER ou ADMIN
- `page`, `size`, `sort`: paginação

**Response** (200 OK): Page<ClientResponseDto>

### PUT `/api/clients/{id}`
Atualiza dados do cliente. **Requer: próprio usuário ou ADMIN**.

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "12345678901",
  "phone": "(11) 98765-4321"
}
```

### PATCH `/api/clients/{id}/password`
Atualiza senha. **Requer: próprio usuário ou ADMIN**.

**Request Body**:
```json
{
  "oldPassword": "senhaAntiga123",
  "newPassword": "novaSenha123"
}
```

**Response**: 204 No Content

### PATCH `/api/clients/{id}/deactivate`
Desativa conta. **Requer: próprio usuário ou ADMIN**.

### PATCH `/api/clients/{id}/activate`
Ativa conta. **Requer: próprio usuário ou ADMIN**.

---

## Imagens de Produtos

Base URL: `/api/products/{productId}/images`

Todos os endpoints requerem **ADMIN**.

### GET `/api/products/{productId}/images`
Lista imagens do produto (paginado).

### POST `/api/products/{productId}/images/single`
Adiciona uma imagem.

**Request Body**:
```json
{
  "imageUrl": "https://example.com/image.jpg"
}
```

### POST `/api/products/{productId}/images/batch`
Adiciona múltiplas imagens.

**Request Body**:
```json
[
  { "imageUrl": "https://example.com/image1.jpg" },
  { "imageUrl": "https://example.com/image2.jpg" }
]
```

### DELETE `/api/products/{productId}/images/{imageId}`
Remove imagem do produto.

**Response**: 204 No Content

---

## Administração

Todos os endpoints requerem **ADMIN**.

### POST `/api/admins`
Cria novo administrador.

**Request Body**:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "senha123",
  "cpf": "98765432100",
  "phone": "(11) 99999-9999"
}
```

**Response** (200 OK): ClientResponseDto com `role: "ADMIN"`

### PATCH `/api/admins/clients/{id}/reset-password`
Admin reseta senha de um cliente.

**Request Body**:
```json
{
  "newPassword": "novaSenha123"
}
```

**Response**: 204 No Content

---

## Pagamentos (Stripe)

### POST `/product/checkout`
Cria sessão de checkout com Stripe.

**Request Body**: ProductRequest (estrutura definida pela integração Stripe)

**Response** (200 OK): StripeResponse

**Nota**: Este endpoint está em `/product/checkout` (sem `/api`)

---

## Health Check

### GET `/api/health`
Verifica status da aplicação.

**Response** (200 OK):
```json
"OK"
```

---

## Modelos de Dados Principais

### Client
```typescript
{
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  active: boolean;
  role: 'USER' | 'ADMIN';
  createdAt: string; // ISO 8601
}
```

### Product
```typescript
{
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}
```

### ProductImage
```typescript
{
  id: number;
  imageUrl: string;
  createdAt: string;
  updatedAt?: string;
}
```

**Nota**: As imagens são URLs externas (não upload de arquivos)

### Cart
```typescript
{
  id: number;
  sessionId: string;
  clientId: number;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}
```

### CartItem
```typescript
{
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
```

### Order
```typescript
{
  id: number;
  orderNumber: string;
  orderDate: string;
  status: 'PENDING' | 'PAYMENT_CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  subtotal: number;
  discount: number;
  total: number;
  clientId: number;
  items: OrderItem[];
  deliveryAddress: Address;
}
```

### OrderItem
```typescript
{
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
```

### Address
```typescript
{
  id: number;
  street: string;
  number: string;
  complement?: string;
  district: string;
  zipCode: string;
  defaultAddress: boolean;
  city: City;
  createdAt: string;
  updatedAt: string;
}
```

### City
```typescript
{
  id: number;
  name: string;
  ibgeCode: string;
  state: State;
}
```

### State
```typescript
{
  id: number;
  name: string;
  uf: string;
  country: Country;
}
```

### Country
```typescript
{
  id: number;
  name: string;
  code: string;
}
```

---

## Tratamento de Erros

### Formato de Resposta de Erro

```json
{
  "timestamp": "2025-01-07T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Produto não encontrado",
  "path": "/api/products/999"
}
```

### Códigos HTTP Comuns

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Requisição bem-sucedida sem conteúdo de resposta
- **400 Bad Request**: Dados de entrada inválidos
- **401 Unauthorized**: Token JWT inválido ou ausente
- **403 Forbidden**: Usuário sem permissão para acessar recurso
- **404 Not Found**: Recurso não encontrado
- **409 Conflict**: Conflito (ex: email já existe)
- **500 Internal Server Error**: Erro interno do servidor

### Exceções Comuns

- `ClientNotFoundException`: Cliente não encontrado
- `ProductNotFoundException`: Produto não encontrado
- `CartNotFoundException`: Carrinho não encontrado
- `OrderNotFoundException`: Pedido não encontrado
- `EmailAlreadyExistsException`: Email já cadastrado
- `InvalidPasswordException`: Senha incorreta
- `StockNegativeException`: Estoque ficaria negativo
- `InvalidDiscountException`: Desconto maior que subtotal

---

## Exemplos de Uso

### 1. Fluxo Completo de Compra

```javascript
// 1. Registrar usuário
const registerResponse = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "João Silva",
    email: "joao@example.com",
    password: "senha123",
    cpf: "12345678901",
    phone: "(11) 98765-4321"
  })
});
const { token } = await registerResponse.json();

// 2. Listar produtos
const productsResponse = await fetch('http://localhost:8080/api/products');
const products = await productsResponse.json();

// 3. Buscar carrinho ativo (extrai clientId do token JWT)
const clientId = 1; // extrair do token decodificado
const cartResponse = await fetch(`http://localhost:8080/api/carts/client/${clientId}/active`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const cart = await cartResponse.json();

// 4. Adicionar item ao carrinho
await fetch(`http://localhost:8080/api/carts/client/${clientId}/items`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: 1,
    quantity: 2
  })
});

// 5. Criar endereço de entrega
const addressResponse = await fetch('http://localhost:8080/api/addresses', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    street: "Rua das Flores",
    number: "123",
    district: "Centro",
    zipCode: "12345-678",
    cityId: 1,
    defaultAddress: true
  })
});

// 6. Criar pedido
const orderResponse = await fetch('http://localhost:8080/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    cartId: cart.id,
    discount: 0
  })
});
const order = await orderResponse.json();
```

### 2. Buscar Produtos por Nome

```javascript
const searchTerm = "notebook";
const response = await fetch(`http://localhost:8080/api/products/name?name=${searchTerm}&page=0&size=20`);
const products = await response.json();
```

### 3. Atualizar Quantidade no Carrinho

```javascript
const cartItemId = 1;
await fetch(`http://localhost:8080/api/carts/client/${clientId}/items/${cartItemId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quantity: 5
  })
});
```

---

## Observações Importantes

1. **Autenticação JWT**:
   - Token expira em 24 horas
   - Sempre incluir no header: `Authorization: Bearer {token}`
   - Decodificar token no frontend para obter `clientId`

2. **Paginação**:
   - Padrão: `page=0`, `size=20`
   - Ordenação: `sort=campo,asc` ou `sort=campo,desc`

3. **CORS**:
   - Backend configurado para aceitar requisições do frontend

4. **Estado do Banco**:
   - `ddl-auto: create-drop` - banco é recriado a cada restart
   - Dados são perdidos ao reiniciar backend
   - Admin padrão é criado automaticamente na inicialização

5. **Validações**:
   - Todas as validações são feitas no backend
   - Mensagens de erro em português (quando customizadas)

6. **Carrinho**:
   - Cliente pode ter múltiplos carrinhos
   - Apenas carrinhos "ativos" (sem pedido associado) são retornados
   - Preço unitário é salvo no momento da adição (não atualiza automaticamente)

7. **Pedidos**:
   - Uma vez criado, o carrinho é associado ao pedido
   - Novo carrinho é criado automaticamente para próximas compras
   - Status pode ser atualizado via PATCH

8. **Roles**:
   - `USER`: Cliente comum (criado via registro)
   - `ADMIN`: Administrador (criado via env ou endpoint admin)

9. **Admin Padrão**:
   - É criado automaticamente na inicialização do backend
   - Credenciais definidas nas variáveis de ambiente:
     - `ADMIN_EMAIL`
     - `ADMIN_PASSWORD`
     - `ADMIN_NAME`
     - `ADMIN_CPF`
     - `ADMIN_PHONE`

---

## Configuração do Backend (Informações Técnicas)

### Variáveis de Ambiente Necessárias

O backend utiliza as seguintes variáveis de ambiente (arquivo `.env`):

```bash
# Database
POSTGRES_HOST=jdbc:postgresql://localhost:5432/ecommerce_db
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=your_password_here

# JWT
JWT_SECRET=generate-a-strong-random-secret-key-using-openssl-rand-base64-32
JWT_EXPIRATION=86400000

# Admin padrão
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
ADMIN_NAME=System Administrator
ADMIN_CPF=00000000000
ADMIN_PHONE=(00) 00000-0000

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

### Configuração Docker

**docker-compose.yml** define 3 serviços:

1. **postgres**: PostgreSQL 16 Alpine
   - Porta: 5432
   - Volume: postgres_data (persistente)

2. **app**: Aplicação Spring Boot
   - Porta: 8080
   - Depende do PostgreSQL

3. **pgweb**: Interface web para PostgreSQL
   - Porta: 8081
   - URL: http://localhost:8081

### Comandos Docker

```bash
# Subir todos os serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f app
```

### Informações Importantes do Banco

- **Hibernate DDL**: `create-drop`
  - Banco é recriado a cada restart da aplicação
  - TODOS os dados são perdidos ao reiniciar
  - Útil para desenvolvimento, **não usar em produção**

- **Dialeto**: PostgreSQLDialect
- **Banco**: ecommerce_db

---

## Formato Completo de Paginação

Todos os endpoints paginados retornam o seguinte formato:

```typescript
{
  content: T[];              // Array de resultados
  pageable: {
    pageNumber: number;      // Página atual (0-indexed)
    pageSize: number;        // Tamanho da página
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;        // Total de páginas
  totalElements: number;     // Total de elementos
  last: boolean;             // É a última página?
  first: boolean;            // É a primeira página?
  size: number;              // Tamanho da página
  number: number;            // Número da página atual
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;  // Número de elementos na página atual
  empty: boolean;            // Página vazia?
}
```

**Exemplo de uso com paginação**:

```javascript
async function loadProducts(page = 0, size = 20) {
  const response = await fetch(
    `http://localhost:8080/api/products?page=${page}&size=${size}&sort=name,asc`
  );
  const data = await response.json();

  console.log('Produtos:', data.content);
  console.log('Página atual:', data.number);
  console.log('Total de páginas:', data.totalPages);
  console.log('Total de produtos:', data.totalElements);
  console.log('É a última página?', data.last);

  return data;
}
```

---

## Validações Completas por DTO

### ClientRequestDto (Registro)
```typescript
{
  name: string;        // @NotBlank, @Size(max=150)
  email: string;       // @NotBlank, @Email, @Size(max=100), @Pattern(regex), ÚNICO
  password: string;    // @NotBlank
  cpf: string;         // @NotBlank, @Size(min=11, max=11), ÚNICO
  phone: string;       // @NotBlank, @Size(max=30)
}
```

### ClientUpdateRequestDto
```typescript
{
  name?: string;       // @Size(max=150)
  email?: string;      // @Email, @Size(max=100), ÚNICO
  cpf?: string;        // @Size(min=11, max=11), ÚNICO
  phone?: string;      // @Size(max=30)
}
```

### ProductRequestDto
```typescript
{
  name: string;        // @NotBlank
  description?: string; // @Size(max=1000)
  price: number;       // @NotNull, @DecimalMin("0.01")
  stock: number;       // @NotNull, @Min(0)
}
```

### AddItemToCartRequestDto
```typescript
{
  productId: number;   // @NotNull, @Positive
  quantity: number;    // @NotNull, @Positive
}
```

### UpdateCartItemRequestDto
```typescript
{
  quantity: number;    // @NotNull, @Positive
}
```

### CreateOrderRequestDto
```typescript
{
  cartId: number;      // @NotNull, @Positive
  discount: number;    // @NotNull, @DecimalMin("0.0")
}
```

### AddressRequestDto
```typescript
{
  street: string;      // @NotBlank, @Size(max=255)
  number: string;      // @Size(max=20)
  complement?: string; // @Size(max=100)
  district: string;    // @NotBlank, @Size(max=100)
  zipCode: string;     // @NotBlank, @Size(max=20)
  cityId: number;      // @NotNull, @Positive
  defaultAddress?: boolean; // default: false
}
```

### ChangePasswordRequestDto
```typescript
{
  oldPassword: string; // @NotBlank
  newPassword: string; // @NotBlank
}
```

---

## Regras de Negócio Detalhadas

### Produtos
1. **Criação**: Produto criado com `active: true` por padrão
2. **Ajuste de Estoque**:
   - Se `quantity` é positivo: adiciona ao estoque
   - Se `quantity` é negativo: remove do estoque
   - Não permite estoque negativo (lança `StockNegativeException`)
3. **Busca Pública**: Apenas produtos com `active: true` são retornados
4. **Desativação**: Se já estiver inativo, lança exceção
5. **Ativação**: Se já estiver ativo, lança exceção
6. **Imagens**: URLs externas (não há upload de arquivo)

### Carrinho
1. **Carrinho Ativo**:
   - Cliente pode ter múltiplos carrinhos
   - "Ativo" = carrinho sem pedido associado
   - Se não existir, cria automaticamente
2. **Adicionar Item**:
   - Se produto já existe no carrinho: atualiza quantidade
   - Se produto não existe: cria novo CartItem
   - Salva o preço unitário do produto no momento da adição
3. **Preço Congelado**:
   - `unitPrice` não muda após adição
   - Mesmo se preço do produto mudar posteriormente
4. **SessionId**: Campo opcional, pode ser usado para carrinhos anônimos

### Pedidos
1. **Criação**:
   - Carrinho não pode estar vazio
   - Gera `orderNumber` único: formato `ORD-{timestamp}-{UUID}`
   - Status inicial: `PENDING`
   - Calcula `subtotal` = soma(unitPrice × quantity) de todos os items
   - `discount` deve ser >= 0 e <= subtotal
   - `total` = subtotal - discount
   - Cria `OrderItems` copiando `CartItems`
   - Associa carrinho ao pedido (carrinho não pode ser usado novamente)
2. **Endereço de Entrega**:
   - Deve ser um endereço cadastrado do cliente
   - Endereço é vinculado ao pedido
3. **Status**:
   - Workflow: PENDING → PAYMENT_CONFIRMED → PROCESSING → SHIPPED → DELIVERED
   - Pode ser cancelado em qualquer momento: CANCELLED
   - Pode ser reembolsado: REFUNDED
4. **Novo Carrinho**:
   - Após criar pedido, próxima chamada a `/carts/client/{id}/active` cria novo carrinho

### Endereços
1. **Endereço Padrão**:
   - Cliente pode ter apenas um endereço padrão
   - Ao definir endereço como padrão, remove flag dos outros
   - Se criar primeiro endereço com `defaultAddress: true`, ele será o padrão
2. **Validação de Propriedade**:
   - Cliente só pode acessar/modificar seus próprios endereços
   - Validado via JWT (clientId extraído do token)
3. **Cidade**:
   - Deve ser um ID válido de cidade cadastrada no banco
   - Cidade está vinculada a Estado → País

### Clientes
1. **Registro**:
   - Email deve ser único (case-sensitive)
   - CPF deve ser único
   - Senha é automaticamente hasheada com BCrypt (10 rounds)
   - Cliente criado com `active: true` e `role: USER`
2. **Atualização de Senha**:
   - Requer senha antiga (`oldPassword`)
   - Valida senha antiga antes de atualizar
   - Nova senha é hasheada
3. **Desativação**:
   - Muda `active` para `false`
   - Cliente desativado não pode fazer login
4. **Autorização**:
   - Cliente pode acessar/modificar apenas seus próprios dados
   - Exceção: ADMIN pode acessar/modificar qualquer cliente

### Autenticação
1. **Login**:
   - Valida email e senha
   - Se cliente está inativo, login falha
   - Retorna token JWT válido por 24 horas
2. **Token**:
   - Contém: email (subject), clientId (claim "id"), timestamps
   - Deve ser enviado em todas as requisições autenticadas
   - Header: `Authorization: Bearer {token}`
3. **Expiração**:
   - Token expira após 24 horas
   - Frontend deve verificar expiração antes de fazer requisições
   - Se expirado, redirecionar para login

---

## Exemplos Avançados

### 1. Decodificar Token e Fazer Requisição Autenticada

```javascript
import { jwtDecode } from 'jwt-decode';

// Após login
const { token } = await loginResponse.json();

// Salvar token
localStorage.setItem('authToken', token);

// Decodificar para obter clientId
const decoded = jwtDecode(token);
const clientId = decoded.id;
const email = decoded.sub;

// Guardar clientId
localStorage.setItem('clientId', clientId);

// Fazer requisição autenticada
async function getMyProfile() {
  const token = localStorage.getItem('authToken');
  const clientId = localStorage.getItem('clientId');

  const response = await fetch(`http://localhost:8080/api/clients/${clientId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.status === 401) {
    // Token inválido ou expirado
    localStorage.removeItem('authToken');
    localStorage.removeItem('clientId');
    window.location.href = '/login';
    return;
  }

  return await response.json();
}
```

### 2. Manipular Carrinho Completo

```javascript
// Buscar/criar carrinho ativo
async function getActiveCart(clientId, token) {
  const response = await fetch(
    `http://localhost:8080/api/carts/client/${clientId}/active`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );
  return await response.json();
}

// Adicionar produto
async function addToCart(clientId, productId, quantity, token) {
  const response = await fetch(
    `http://localhost:8080/api/carts/client/${clientId}/items`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId, quantity })
    }
  );
  return await response.json();
}

// Atualizar quantidade
async function updateCartItem(clientId, cartItemId, quantity, token) {
  const response = await fetch(
    `http://localhost:8080/api/carts/client/${clientId}/items/${cartItemId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity })
    }
  );
  return await response.json();
}

// Remover item
async function removeCartItem(clientId, cartItemId, token) {
  await fetch(
    `http://localhost:8080/api/carts/client/${clientId}/items/${cartItemId}`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
}

// Limpar carrinho
async function clearCart(clientId, token) {
  await fetch(
    `http://localhost:8080/api/carts/client/${clientId}/clear`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
}

// Calcular total do carrinho
function calculateCartTotal(cart) {
  return cart.items.reduce((total, item) => {
    return total + (item.unitPrice * item.quantity);
  }, 0);
}
```

### 3. Fluxo de Checkout Completo

```javascript
async function checkout(clientId, token) {
  // 1. Buscar carrinho ativo
  const cart = await getActiveCart(clientId, token);

  if (cart.items.length === 0) {
    throw new Error('Carrinho vazio');
  }

  // 2. Buscar endereço padrão
  const addressResponse = await fetch(
    'http://localhost:8080/api/addresses/default',
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  if (addressResponse.status === 404) {
    throw new Error('Cadastre um endereço de entrega');
  }

  const address = await addressResponse.json();

  // 3. Criar pedido
  const orderResponse = await fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId: cart.id,
      discount: 0
    })
  });

  if (!orderResponse.ok) {
    const error = await orderResponse.json();
    throw new Error(error.message);
  }

  const order = await orderResponse.json();

  // 4. Redirecionar para página de pagamento
  return order;
}
```

### 4. Buscar Cidades por Estado

```javascript
async function loadCitiesByState(stateId) {
  const response = await fetch(
    `http://localhost:8080/api/locations/cities?stateId=${stateId}`
  );
  return await response.json();
}

// Exemplo: popular select de cidades quando estado mudar
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');

stateSelect.addEventListener('change', async (e) => {
  const stateId = e.target.value;
  const cities = await loadCitiesByState(stateId);

  citySelect.innerHTML = '<option value="">Selecione...</option>';
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.id;
    option.textContent = city.name;
    citySelect.appendChild(option);
  });
});
```

### 5. Tratamento de Erros Completo

```javascript
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);

    // Sucesso sem conteúdo
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    // Erro
    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(data.message || 'Dados inválidos');
        case 401:
          localStorage.clear();
          window.location.href = '/login';
          throw new Error('Sessão expirada');
        case 403:
          throw new Error('Sem permissão');
        case 404:
          throw new Error(data.message || 'Não encontrado');
        case 409:
          throw new Error(data.message || 'Conflito de dados');
        default:
          throw new Error('Erro no servidor');
      }
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Uso
try {
  const products = await apiRequest('http://localhost:8080/api/products');
  console.log(products);
} catch (error) {
  alert(error.message);
}
```

---

## Checklist de Implementação Frontend

### Autenticação
- [ ] Página de login
- [ ] Página de registro
- [ ] Armazenar token JWT no localStorage/sessionStorage
- [ ] Decodificar token para extrair clientId
- [ ] Verificar expiração do token antes de requisições
- [ ] Interceptor para adicionar Authorization header automaticamente
- [ ] Logout (limpar token e redirecionar)
- [ ] Redirect se não autenticado

### Produtos
- [ ] Listagem de produtos (com paginação)
- [ ] Busca de produtos por nome
- [ ] Detalhes do produto
- [ ] Exibir imagens do produto
- [ ] Verificar estoque disponível

### Carrinho
- [ ] Adicionar produto ao carrinho
- [ ] Visualizar carrinho
- [ ] Atualizar quantidade de item
- [ ] Remover item do carrinho
- [ ] Limpar carrinho
- [ ] Calcular total do carrinho
- [ ] Persistir carrinho (sincronizar com backend)

### Endereços
- [ ] Listar endereços do usuário
- [ ] Cadastrar novo endereço
- [ ] Editar endereço
- [ ] Excluir endereço
- [ ] Definir endereço padrão
- [ ] Selects cascata: País → Estado → Cidade

### Pedidos
- [ ] Criar pedido (checkout)
- [ ] Listar meus pedidos
- [ ] Visualizar detalhes do pedido
- [ ] Acompanhar status do pedido
- [ ] Cancelar pedido

### Perfil do Usuário
- [ ] Visualizar dados do perfil
- [ ] Editar dados do perfil
- [ ] Alterar senha
- [ ] Desativar conta

### Admin (se aplicável)
- [ ] Gerenciar produtos (CRUD)
- [ ] Gerenciar estoque
- [ ] Visualizar todos os pedidos
- [ ] Atualizar status de pedidos
- [ ] Gerenciar clientes
- [ ] Criar outros admins

---

## URLs Úteis para Desenvolvimento

- **API Backend**: http://localhost:8080
- **API Docs (se tiver Swagger)**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/api/health
- **pgweb (DB Interface)**: http://localhost:8081
- **PostgreSQL**: localhost:5432 (usuário: postgres)

---

## Dicas de Implementação

1. **Use uma biblioteca HTTP**:
   - Axios: `npm install axios`
   - Fetch API nativo do navegador

2. **Interceptors**: Configure interceptores para:
   - Adicionar token automaticamente
   - Tratar erros globalmente
   - Logging de requisições

3. **State Management**: Considere usar:
   - Context API (React)
   - Redux/Zustand (para estados mais complexos)
   - TanStack Query (react-query) para cache de API

4. **Validação**: Validar dados no frontend também:
   - react-hook-form + zod (React)
   - Vuelidate (Vue)
   - Validações customizadas

5. **Loading States**: Sempre mostrar loading durante requisições

6. **Error Boundaries**: Capturar e exibir erros de forma amigável

7. **Paginação**: Implementar paginação infinita ou tradicional

8. **Debounce**: Para busca de produtos (evitar muitas requisições)

9. **Persistência**: Salvar carrinho no localStorage como backup

10. **Segurança**:
    - Nunca expor tokens no console
    - Usar HTTPS em produção
    - Implementar CSRF protection se necessário
