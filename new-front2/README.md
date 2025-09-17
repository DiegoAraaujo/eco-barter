# ♻️ EcoBarter

EcoBarter é uma aplicação web desenvolvida em **React** para promover o consumo consciente através da **troca de itens** entre usuários.  
A plataforma permite cadastrar produtos, enviar e receber propostas de troca e gerenciar sua área pessoal — tudo de forma simples, intuitiva e sustentável.  

---

## Equipe

- Diego Araujo  
- Tatiana Barbosa  
- Temis Handeri  
- Sâmia Luvanice  
- Fernando Araujo  

---

## Funcionalidades

- **Autenticação e Perfil**
  - Cadastro de usuário
  - Login/Logout
  - Edição de dados pessoais

- **Itens**
  - Cadastro de novos itens com foto, descrição e categoria
  - Catálogo com filtro por categorias
  - Página de detalhes do item

- **Trocas**
  - Enviar propostas de troca
  - Aceitar, recusar ou cancelar propostas recebidas
  - Histórico de propostas enviadas e recebidas
  - Área **Minha Área** para gerenciar itens e trocas

- **Interface**
  - Layout responsivo com CSS modular
  - Componentes reutilizáveis (botões, cards, diálogos)
  - Acessibilidade básica (labels, aria, foco gerenciado)

---

## Tecnologias

- **React + Vite**
- **React Router DOM** — navegação entre páginas
- **Context API** — controle global de autenticação e trocas
- **LocalStorage (Mock DB)** — persistência de usuários, itens e propostas
- **CSS modular** — estilização por componentes/páginas

---

## Estrutura do Projeto

public/

└── assets/ # imagens públicas e backgrounds

└── img/ # logos e ícones


src/

├── assets/ # ícones e imagens do catálogo

├── components/ # UI e layouts

│ ├── catalog/ # filtros e resultados do catálogo

│ ├── layout/ # header, footer, etc.

│ ├── trade/ # modal de propostas

│ └── ui/ # botões, cards, diálogos reutilizáveis

├── context/ # AuthContext, TradeContext, useTrade, TradeProvider

├── mocks/ # banco mockado (db.js, items.js)

├── models/ # modelos de domínio (ex: trade.js)

├── pages/ # páginas principais (Login, MyArea, Catalogo...)

├── services/ # serviços (auth.js, trades.js, storage.js)

├── styles/ # CSS organizado por pasta

├── App.jsx # ponto de montagem principal

├── router.jsx # rotas da aplicação

└── main.jsx # entrada React/Vite

---

## Como rodar

### Pré-requisitos
- Node.js (>= 18)
- npm ou yarn

### Passos
```bash
# Clonar repositório
git clone git@github.com:SamiaLuvanice/rtic_ecobarter.git

cd ecobarter

# Instalar dependências
npm install
# ou
yarn install

# Rodar em modo dev
npm run dev

```

---

## Roadmap Futuro
- Integração com API real (substituir mock/localStorage)
- Upload de imagens em servidor/cloud
- Notificações em tempo real para propostas
- Melhorias de acessibilidade e internacionalização
- Testes automatizados (Jest/RTL)

  ---

## Sobre o Projeto
- O EcoBarter é um exercício prático de desenvolvimento fullstack, mas também um convite à reflexão sobre consumo sustentável e economia circular.
