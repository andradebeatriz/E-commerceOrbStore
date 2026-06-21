# OrbStore — E-commerce Full Stack

Este projeto consiste em uma aplicação completa de comércio eletrônico desenvolvida utilizando a arquitetura Full Stack. A plataforma permite que usuários realizem cadastro, autenticação, visualização de produtos, gerenciamento de carrinho de compras e realização de pedidos.

Além das funcionalidades voltadas para os clientes, o sistema também possui recursos administrativos para gerenciamento de produtos, usuários e pedidos.

O objetivo do projeto é demonstrar a integração entre Frontend, Backend e Banco de Dados, aplicando conceitos modernos de desenvolvimento web.

## 📁 Estrutura do Projeto

```
ecommerce-fullstack/
├── backend/
│   ├── config/          # Configuração de conexão com o MongoDB
│   ├── controllers/      # Lógica de negócio (usuários, produtos, pedidos, admin)
│   ├── middleware/        # Autenticação JWT, admin e tratamento de erros
│   ├── models/            # Schemas Mongoose (User, Product, Order)
│   ├── routes/            # Rotas da API REST
│   ├── data/               # Dados de exemplo (seed)
│   ├── utils/              # Funções utilitárias (token, asyncHandler)
│   ├── uploads/images/     # Imagens dos produtos (placeholders SVG)
│   ├── server.js           # Ponto de entrada do backend
│   └── seed.js              # Script de importação/remoção de dados
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── actions/         # Actions Redux (produtos, usuários, carrinho, pedidos, admin)
│       ├── reducers/         # Reducers Redux
│       ├── constants/         # Constantes de actions
│       ├── components/         # Componentes reutilizáveis
│       ├── screens/             # Telas/páginas da aplicação
│       ├── store.js              # Configuração da store Redux
│       ├── App.js                # Rotas principais
│       └── index.js              # Ponto de entrada do React
│
└── README.md
```

## 🚀 Tecnologias Utilizadas

**Frontend:** React, Redux Toolkit, React Router DOM, Axios, React Bootstrap, CSS responsivo
**Backend:** Node.js, Express, JWT, bcryptjs
**Banco de Dados:** MongoDB + Mongoose

## ⚙️ Pré-requisitos

- Node.js (v18 ou superior)
- MongoDB (local ou Atlas)
- npm

## 📦 Instalação

### 1. Clonar/extrair o projeto e instalar dependências

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` (use `.env.example` como base):

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=minhachavesecreta123
```

> Se estiver usando o MongoDB Atlas, substitua `MONGO_URI` pela sua string de conexão.

## 🌱 Populando o Banco de Dados (Seed)

Dentro da pasta `backend/`, execute:

```bash
npm run data:import
```

Isso cria:
- **3 usuários**: 1 administrador (`admin@example.com` / `123456`) e 2 usuários comuns (`joao@example.com` e `maria@example.com`, senha `123456`)
- **10 produtos** de exemplo

Para remover todos os dados:

```bash
npm run data:destroy
```

## ▶️ Executando o Projeto

### Backend (porta 5000)
```bash
cd backend
npm run server
```

### Frontend (porta 3000)
```bash
cd frontend
npm start
```

O frontend está configurado com `proxy` para `http://localhost:5000`, então as chamadas para `/api/...` são automaticamente redirecionadas para o backend.

Acesse: **http://localhost:3000**

## 👤 Contas de Teste

| Tipo            | Email               | Senha   |
|-----------------|---------------------|---------|
| Administrador   | admin@example.com   | 123456  |
| Usuário comum   | joao@example.com    | 123456  |
| Usuário comum   | maria@example.com   | 123456  |

## 📡 Endpoints da API

### Usuários
| Método | Rota                  | Acesso         | Descrição                  |
|--------|-----------------------|----------------|-----------------------------|
| POST   | /api/users            | Público        | Cadastro de usuário         |
| POST   | /api/users/login      | Público        | Login (gera token JWT)      |
| GET    | /api/users/profile    | Privado         | Dados do perfil logado      |
| PUT    | /api/users/profile    | Privado         | Atualizar perfil             |
| GET    | /api/users            | Admin           | Listar todos os usuários     |
| GET    | /api/users/:id        | Admin           | Buscar usuário por ID         |
| PUT    | /api/users/:id        | Admin           | Atualizar usuário             |
| DELETE | /api/users/:id        | Admin           | Excluir usuário                |

### Produtos
| Método | Rota                       | Acesso  | Descrição                 |
|--------|----------------------------|---------|-----------------------------|
| GET    | /api/products              | Público | Listar produtos (busca/paginação) |
| GET    | /api/products/:id           | Público | Detalhes de um produto        |
| POST   | /api/products               | Admin   | Criar produto                  |
| PUT    | /api/products/:id           | Admin   | Atualizar produto               |
| DELETE | /api/products/:id           | Admin   | Excluir produto                  |
| POST   | /api/products/:id/reviews    | Privado | Criar avaliação                  |

### Pedidos
| Método | Rota                       | Acesso  | Descrição                       |
|--------|----------------------------|---------|------------------------------------|
| POST   | /api/orders                 | Privado | Criar pedido                        |
| GET    | /api/orders/myorders         | Privado | Listar pedidos do usuário logado     |
| GET    | /api/orders/:id               | Privado | Detalhes de um pedido                  |
| PUT    | /api/orders/:id/pay            | Privado | Marcar pedido como pago (simulado)      |
| GET    | /api/orders                    | Admin   | Listar todos os pedidos                  |
| PUT    | /api/orders/:id/deliver          | Admin   | Marcar pedido como entregue               |

### Admin
| Método | Rota               | Acesso | Descrição                          |
|--------|--------------------|--------|--------------------------------------|
| GET    | /api/admin/summary  | Admin  | Estatísticas do dashboard (usuários, produtos, pedidos, receita) |

## ✨ Funcionalidades

- Cadastro, login e logout com autenticação JWT e senhas criptografadas (bcrypt)
- Página inicial com grid de produtos, busca e paginação
- Página de detalhes do produto com avaliações (rating de 1 a 5 + comentário)
- Carrinho de compras persistido em `localStorage`
- Fluxo completo de checkout: Carrinho → Endereço → Pagamento → Confirmação → Pedido
- Pagamento simulado (PIX, Cartão de Crédito, Boleto)
- Histórico de pedidos do usuário com detalhes
- Painel administrativo:
  - Dashboard com total de usuários, produtos, pedidos e receita
  - CRUD completo de produtos
  - CRUD completo de usuários
  - Gerenciamento de pedidos (marcar como entregue)
- Responsivo para desktop, tablet e smartphone (Bootstrap Grid + Flexbox + Media Queries)

## 🔒 Segurança

- Middleware `protect`: valida o token JWT em rotas privadas
- Middleware `admin`: restringe rotas ao usuário administrador
- Tratamento de erros global (404 e erros gerais)
- Senhas sempre criptografadas com bcrypt antes de salvar no banco

## 🖼️ Imagens dos Produtos

As imagens de exemplo são SVGs simples servidos pela rota estática `/images` do backend (pasta `backend/uploads/images`). Você pode substituí-las por imagens reais com o mesmo nome de arquivo ou atualizar o campo `image` dos produtos no painel administrativo.

## 🧪 Fluxo de Teste Sugerido

1. Acesse a Home, pesquise um produto e veja seus detalhes.
2. Cadastre-se ou faça login com uma das contas de teste.
3. Adicione produtos ao carrinho e finalize a compra (endereço → pagamento → confirmação).
4. Simule o pagamento na tela do pedido.
5. Faça login como administrador (`admin@example.com`) e acesse o painel `/admin/dashboard`, gerencie produtos, usuários e pedidos.

---

## 👨‍💻 Autores
* Beatriz de Andrade Leite 
* Edgar Guimarães de Carvalho 
* Matheus Machado Sprengel 
* Sophia Rosa da Silva Machado 
* Théo Vinícius Garcia Tonche

Projeto desenvolvido para fins acadêmicos e aprendizado de desenvolvimento Full Stack utilizando React, Node.js, Express e MongoDB.
