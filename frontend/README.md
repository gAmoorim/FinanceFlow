# FinanceFlow Frontend

Um frontend moderno e responsivo para o sistema de controle financeiro FinanceFlow, construído com React, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

### ✨ Interface Moderna
- Design responsivo e intuitivo
- Tema claro/escuro automático
- Animações suaves e transições
- Componentes reutilizáveis

### 🔐 Autenticação
- Login e cadastro de usuários
- Gerenciamento de sessão com JWT
- Proteção de rotas
- Validação de formulários

### 💰 Gestão Financeira
- Dashboard com resumo financeiro
- CRUD completo de transações (receitas e despesas)
- Filtros avançados por data e tipo
- Sistema de metas financeiras

### 📊 Visualizações
- Cards de resumo com valores totais
- Barras de progresso para metas
- Indicadores visuais de status
- Gráficos e estatísticas

### ⚙️ Configurações
- Perfil do usuário
- Alteração de senha
- Preferências de tema
- Gerenciamento de conta

## 🛠️ Tecnologias

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilização
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **Recharts** - Gráficos (futuro)

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd FRONTEND
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure a URL da API**
   Edite o arquivo `src/services/api.ts` e ajuste a `baseURL` para apontar para seu backend:
   ```typescript
   baseURL: 'http://localhost:3000', // Ajuste conforme necessário
   ```

4. **Execute o projeto**
   ```bash
   npm start
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── dashboard/      # Componentes do dashboard
│   ├── goals/          # Componentes de metas
│   ├── layout/         # Layout e navegação
│   ├── transactions/   # Componentes de transações
│   └── ui/             # Componentes de interface
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── services/           # Serviços e API
├── store/              # Gerenciamento de estado
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
└── App.tsx             # Componente principal
```

## 🎨 Temas e Estilização

O projeto utiliza Tailwind CSS com suporte a temas claro e escuro:

- **Tema Claro**: Interface limpa com cores claras
- **Tema Escuro**: Interface moderna com cores escuras
- **Transições**: Animações suaves entre estados
- **Responsividade**: Adaptação para todos os dispositivos

### Cores Principais
- **Primary**: Azul (#3b82f6)
- **Success**: Verde (#22c55e)
- **Danger**: Vermelho (#ef4444)
- **Warning**: Amarelo (#f59e0b)

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
REACT_APP_API_URL=http://localhost:3000
```

### Personalização
- **Cores**: Edite `tailwind.config.js`
- **Componentes**: Modifique os arquivos em `src/components/`
- **Rotas**: Ajuste `src/App.tsx`

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🚀 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Gera build de produção
- `npm test` - Executa os testes
- `npm eject` - Ejeta as configurações do Create React App

## 🔗 Integração com Backend

O frontend se conecta com o backend através da API REST:

### Endpoints Utilizados
- `POST /cadastro` - Cadastro de usuário
- `POST /login` - Login de usuário
- `GET /transacoes` - Listar transações
- `POST /transacoes` - Criar transação
- `GET /metas` - Listar metas
- `POST /metas` - Criar meta

## 🎯 Funcionalidades Futuras

- [ ] Gráficos avançados com Recharts
- [ ] Exportação de relatórios
- [ ] Notificações push
- [ ] Modo offline
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos issues do GitHub ou email.

---

Desenvolvido com ❤️ para o controle financeiro pessoal.
