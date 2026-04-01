# 💰 financeFlow

> Aplicação web de gerenciamento de finanças pessoais

O FinanceFlow permite que usuários registrem transações financeiras, definam metas de economia e visualizem um resumo completo das suas finanças de forma simples e intuitiva.

🔗 **Deploy:** [financefloweb.vercel.app](https://financefloweb.vercel.app)

---

## 📦 Funcionalidades

- Cadastro e autenticação de usuários
- Registro de transações (entradas e despesas)
- Criação e acompanhamento de metas financeiras
- Resumo financeiro com saldo, entradas e saídas
- Filtros de transações por data e tipo
- Atualização e exclusão de dados do usuário

---

## 🧱 Arquitetura

O projeto é dividido em duas partes independentes:

```
FinanceFlow/
├── backend/     → API REST em Node.js + Express
└── frontend/    → Interface em Next.js + TypeScript
```

---

## ⚙️ Tecnologias

### Backend
- **Node.js** + **Express** — servidor e rotas
- **PostgreSQL** — banco de dados relacional (hospedado na nuvem)
- **Knex.js** — query builder
- **JWT** — autenticação via token
- **Bcrypt** — criptografia de senhas
- **CORS** — controle de acesso entre origens
- **Dotenv** — variáveis de ambiente

### Frontend
- **Next.js** — framework React com SSR
- **TypeScript** — tipagem estática
- **CSS** — estilização

---

## 🔐 Autenticação

- Rotas protegidas via **JWT**
- Token armazenado no `localStorage`
- Senhas criptografadas com **bcrypt**

---

## 🚀 Deploy

| Serviço | Responsabilidade |
|---|---|
| [Vercel](https://vercel.com) | Frontend (Next.js) |
| [Railway](https://railway.app) | Backend (Node.js + Express) |
| Nuvem | Banco de dados PostgreSQL |

---
