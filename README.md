# Projeto Magnum

Este é o projeto frontend para a plataforma Magnum, uma aplicação de marketplace com funcionalidades para usuários e administradores.

## Tecnologias Utilizadas

*   **React:** Biblioteca para construção de interfaces de usuário.
*   **Vite:** Ferramenta de build e servidor de desenvolvimento rápido.
*   **React Router:** Para roteamento do lado do cliente.
*   **Tailwind CSS:** Framework de CSS utilitário.
*   **Axios:** Cliente HTTP para requisições à API.
*   **Lucide React:** Biblioteca de ícones.

## Estrutura do Projeto

A estrutura do projeto foi organizada para separar o frontend e o backend:

```
/
├── backend/      # Contém a API e a lógica do servidor
└── src/          # Contém o código-fonte do frontend
    ├── components/
    ├── hooks/
    ├── pages/
    │   ├── Admin.jsx
    │   ├── Home.jsx
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── Usuario.jsx
    ├── App.jsx
    └── main.jsx
```

## Scripts Disponíveis

No diretório raiz do projeto, você pode executar:

### `npm install`

Instala as dependências do projeto (frontend e backend).

### `npm run dev`

Executa a aplicação completa (frontend e backend) em modo de desenvolvimento.
O frontend estará disponível em [http://localhost:5173](http://localhost:5173).

### `npm run build`

Compila a aplicação frontend para produção na pasta `dist`.

## Atualizações Recentes (Novembro/2025)

Nesta sessão de desenvolvimento, realizamos uma grande reformulação visual e de usabilidade na aplicação.

### 1. Implementação de um Novo Tema Escuro
- **Padronização Visual:** Todas as páginas (`Login`, `Home`, `Usuário`, `Admin`, `Register`) foram atualizadas para um tema escuro consistente, com um fundo preto-avermelhado (`#0a0708`), textos brancos e detalhes em rosa/vermelho (`#ff0050`).
- **Cabeçalho Fixo:** O cabeçalho da aplicação agora é fixo no topo da página, com o novo tema escuro e uma borda inferior para destaque.

### 2. Redesign da Página de Login
- A página de login foi completamente redesenhada para uma estética mais moderna e imersiva.
- Adição de uma logo (`logo.png`) e um círculo decorativo com efeito de "glow".
- Os campos de input foram estilizados para serem transparentes, com bordas brancas e efeito de iluminação ao focar.
- Implementamos soluções de CSS para corrigir o problema de preenchimento automático dos navegadores, garantindo que o tema escuro seja mantido.

### 3. Melhorias na Página de Administrador
- O painel de administração foi atualizado para o tema escuro.
- O formulário de "Cadastrar Novo Usuário" foi reestruturado com rótulos (`labels`) e melhor espaçamento para maior usabilidade.
- A tabela de usuários e todos os seus componentes (inputs, selects, botões) foram estilizados para o novo tema.

### 4. Configurações Gerais
- O título da aplicação no navegador foi alterado para "Magnum".
- O ícone da aba (favicon) foi atualizado para um novo arquivo (`favicon.png`).
