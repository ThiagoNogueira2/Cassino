
# 🎰 Casino Online Frontend — Plano Completo

## Visão Geral
Sistema de cassino online moderno no estilo **Blaze/Stake**, com tema escuro, roxo neon e elementos brilhantes. Foco na experiência do usuário com jogos simulados funcionando no front-end, sem backend real.

---

## 🎨 Design System
- **Tema:** Dark exclusivo (fundo preto profundo `#0d0d0d`)
- **Cores primárias:** Roxo neon (`#7c3aed`), dourado (`#f59e0b`), verde ganho (`#10b981`)
- **Efeitos:** Glow neon nos botões e cards, gradientes suaves, partículas animadas
- **Tipografia:** Moderna, bold, estilo gaming
- **Responsivo:** Mobile-first com bottom navigation no mobile

---

## 📄 Páginas & Rotas

### 1. Home (`/`)
- **Hero section** com banner animado e CTA de cadastro
- **Grid de jogos populares** com cards com hover glow e preview animado
- **Seção "Crash ao Vivo"** mostrando multiplicador em tempo real como isca visual
- **Seção de promoções** com cards de bônus e ofertas
- **Seção "Mais Jogados"** e "Novos Jogos"
- **Ticker de vencedores recentes** (mock) animado horizontalmente
- **Navbar** com logo, links de navegação, botões Login/Cadastro
- **Footer** completo com links, redes sociais e aviso de jogo responsável

### 2. Autenticação (Modais)
- **Modal de Login** com email/senha, "Lembrar de mim", link para cadastro
- **Modal de Cadastro** com nome, email, CPF (com máscara), senha, confirmação, aceite de termos
- **Modal de Recuperação de Senha** com campo de email e confirmação visual simulada
- Validação completa de campos com mensagens de erro inline
- Transições suaves entre os modais

### 3. Dashboard do Usuário (`/dashboard`)
- **Header** com avatar, nome, saldo em destaque
- **Cards de ação rápida:** Depositar, Sacar, Histórico
- **Seção de jogos favoritos** com acesso rápido
- **Histórico de apostas** recentes em tabela
- **Histórico de transações** com status visual (pendente/aprovado/rejeitado)
- **Perfil editável** com upload de avatar simulado

### 4. Jogo: Crash (`/games/crash`) — Principal
- **Gráfico animado** com linha subindo e multiplicador em tempo real
- **Sistema de aposta:** input de valor, botão "Apostar", botão "Retirar" (cashout)
- **Animação de crash** quando o avião/foguete cai
- **Painel lateral** com histórico de multiplicadores das últimas rodadas (código de cores: verde alto, vermelho baixo)
- **Chat ao vivo simulado** com apostas de outros jogadores
- **Timer de contagem regressiva** entre rodadas

### 5. Jogo: Slot Machine (`/games/slots`)
- **5 colunas** com símbolos animados girando (frutas, gems, 7s)
- **Apostas configuráveis** (0.10 a 100.00)
- **Animação de ganho** com efeito de brilho e confetti
- **Painel de pagamentos** visual
- **Auto-spin** simulado

### 6. Jogo: Roleta (`/games/roulette`)
- **Roda animada** girando com física realista
- **Mesa de apostas** com seleção de número, cor e faixa
- **Histórico de resultados** recentes (bolinhas coloridas)
- **Timer** entre rodadas

### 7. Jogo: Blackjack (`/games/blackjack`)
- **Mesa verde** com cartas animadas
- **Botões:** Pedir carta, Parar, Dobrar
- **Sistema de pontuação** com comparação dealer vs jogador
- **Animações de vitória/derrota**

### 8. Depósito (`/deposit`)
- Seleção de valor com botões rápidos (R$20, R$50, R$100, R$200, customizado)
- Opção **PIX** com QR Code gerado (fake/simulado)
- Código PIX copiável
- Status animado: "Aguardando pagamento..." → "Confirmado! ✅"

### 9. Saque (`/withdraw`)
- Input de valor (com validação de saldo)
- Input de chave PIX (CPF, email, telefone, aleatória)
- Status visual: pendente → aprovado (simulado com delay)

---

## 🧩 Componentes Principais
- `GameCard` — Card de jogo com animação hover
- `WinnersTicker` — Faixa de vencedores rolando
- `CrashGraph` — Gráfico animado do Crash
- `SlotReels` — Rolos da slot machine
- `AuthModal` — Modal de autenticação unificado
- `BalanceWidget` — Widget de saldo no topo
- `NotificationToast` — Notificações de ganhos/perdas
- `NavBar` + `BottomNav` (mobile)

---

## 🗃️ Estado Global (Context API)
- `AuthContext` — usuário logado, dados do perfil
- `BalanceContext` — saldo, histórico de transações
- `GameContext` — estado dos jogos (aposta ativa, resultado)
- Dados mock em `/mock` — usuários, jogos, histórico

---

## 📱 Responsividade
- **Mobile:** Bottom navigation com 4 ícones (Home, Jogos, Carteira, Perfil)
- **Tablet:** Layout de 2 colunas
- **Desktop:** Sidebar + conteúdo principal + chat lateral nos jogos

---

## ✨ Extras incluídos
- Sistema de **notificações toast** (ganhou, perdeu, depósito confirmado)
- **Loader animado** estilo neon ao trocar de página
- **Bônus diário** simulado com countdown
- **Ranking de jogadores** na home
