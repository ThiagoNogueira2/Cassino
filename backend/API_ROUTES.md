# Rotas da API
Na raíz do projeto execute "./start-project.sh" para iniciar os containers e jogos

## Health Check

### GET `/api/health`
Verifica se a API está funcionando.

**Resposta (200):**
```json
{
  "status": "ok",
  "message": "Sistema de Cassino funcionando!",
  "timestamp": "2026-02-20T17:33:12+00:00"
}
```

---

## Autenticação

### POST `/api/auth/register`
Registra um novo usuário.

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "password": "Senha123!",
  "password_confirmation": "Senha123!"
}
```

**Resposta (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00",
    "avatar": null,
    "balance": 0,
    "level": "VIP Silver",
    "role": "user",
    "joinedAt": "2026-02-20T17:33:12+00:00"
  },
  "token": "1|abcdef123456xyz..."
}
```

---

### POST `/api/auth/login`
Autentica um usuário e retorna o token.

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "Senha123!",
  "rememberMe": false
}
```

**Resposta (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00",
    "avatar": null,
    "balance": 1500.50,
    "level": "VIP Silver",
    "role": "user",
    "joinedAt": "2026-02-20T17:33:12+00:00"
  },
  "token": "1|abcdef123456xyz..."
}
```

---

### GET `/api/auth/me`
Retorna os dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00",
    "avatar": null,
    "balance": 1500.50,
    "level": "VIP Silver",
    "role": "user",
    "joinedAt": "2026-02-20T17:33:12+00:00"
  }
}
```

---

### POST `/api/auth/logout`
Faz logout e revoga o token.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "message": "Logout successful"
}
```

---

### POST `/api/auth/forgot-password`
Solicita reset de senha (em desenvolvimento).

**Body:**
```json
{
  "email": "joao@example.com"
}
```

**Resposta (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

---

### POST `/api/auth/reset-password`
Reseta a senha (em desenvolvimento).

**Body:**
```json
{
  "token": "reset_token_here",
  "email": "joao@example.com",
  "password": "NovaSenha123!",
  "password_confirmation": "NovaSenha123!"
}
```

**Resposta (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

### POST `/api/auth/refresh-token`
Atualiza o token (em desenvolvimento).

**Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Resposta (200):**
```json
{
  "message": "Token refreshed successfully",
  "token": "new_token_here"
}
```

---

## Usuário (Autenticado)

### GET `/api/users/profile`
Retorna o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00",
    "avatar": null,
    "balance": 1500.50,
    "level": "VIP Silver",
    "role": "user",
    "joinedAt": "2026-02-20T17:33:12+00:00"
  }
}
```

---

### PUT `/api/users/profile`
Atualiza o perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Resposta (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com",
    "cpf": "123.456.789-00",
    "avatar": "https://example.com/avatar.jpg",
    "balance": 1500.50,
    "level": "VIP Silver",
    "role": "user",
    "joinedAt": "2026-02-20T17:33:12+00:00"
  }
}
```

---

### PUT `/api/users/change-password`
Altera a senha do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "SenhaAtual123!",
  "newPassword": "NovaSenha123!",
  "newPassword_confirmation": "NovaSenha123!"
}
```

**Resposta (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## Admin (Requer role: admin)

### GET `/api/admin/users`
Lista todos os usuários do sistema (sem os deletados).

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Resposta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@cassino.com",
      "cpf": "00000000001",
      "avatar": null,
      "balance": 0,
      "level": "VIP Diamond",
      "role": "admin",
      "joinedAt": "2026-02-20T17:33:12+00:00"
    },
    {
      "id": 2,
      "name": "João Silva",
      "email": "joao@example.com",
      "cpf": "123.456.789-00",
      "avatar": null,
      "balance": 1500.50,
      "level": "VIP Silver",
      "role": "user",
      "joinedAt": "2026-02-20T17:34:00+00:00"
    }
  ],
  "total": 11
}
```

---

### GET `/api/admin/users/{id}`
Retorna os detalhes de um usuário específico.

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Parâmetro URL:**
- `id`: ID do usuário

**Resposta (200):**
```json
{
  "user": {
    "id": 2,
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00",
    "avatar": null,
    "balance": 1500.50,
    "level": "VIP Silver",
    "role": "user",
    "joinedAt": "2026-02-20T17:34:00+00:00"
  }
}
```

**Resposta (404):**
```json
{
  "message": "User not found"
}
```

---

### PUT `/api/admin/users/{id}`
Atualiza um usuário específico (apenas admin).

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Parâmetro URL:**
- `id`: ID do usuário

**Body:**
```json
{
  "name": "João Silva Atualizado",
  "email": "joao.novo@example.com",
  "avatar": "https://example.com/avatar.jpg",
  "balance": 5000.00,
  "level": "VIP Platinum",
  "role": "user"
}
```

**Resposta (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "name": "João Silva Atualizado",
    "email": "joao.novo@example.com",
    "cpf": "123.456.789-00",
    "avatar": "https://example.com/avatar.jpg",
    "balance": 5000.00,
    "level": "VIP Platinum",
    "role": "user",
    "joinedAt": "2026-02-20T17:34:00+00:00"
  }
}
```

---

### DELETE `/api/admin/users/{id}`
Deleta um usuário (Soft Delete - o usuário é ocultado mas os dados permanecem no banco).

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Parâmetro URL:**
- `id`: ID do usuário

**Resposta (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Comportamento:**
- O usuário não aparecerá mais nas listagens
- Os dados são preservados no banco de dados
- Uma coluna `deleted_at` será preenchida com o timestamp
- Se necessário, pode ser recuperado consultando com `.withTrashed()`

**Resposta (404):**
```json
{
  "message": "User not found"
}
```

### Transações
#### GET `/api/admin/transactions`
Lista todas as transações.

**Resposta (200):**
```json
{
  "data": [
        {
            "id": "10",
            "type": "withdraw",
            "amount": 1.11,
            "date": "2026-02-25T13:52:57+00:00",
            "status": "approved",
            "description": "Saque PIX - cpf: 123.456.789-00",
            "user": {
                "id": 12,
                "name": "João teste",
                "email": "joao1@example.com"
            }
        },
        //...
  ]
}
```

#### GET `/api/admin/transactions/{id}`
Lista uma transação específica.

**Resposta (200):**
```json
{
    "id": "9",
    "type": "withdraw",
    "amount": 20.01,
    "date": "2026-02-25T13:36:59+00:00",
    "status": "approved",
    "description": "Saque PIX - cpf: 123.456.789-00",
    "user": {
        "id": 12,
        "name": "João teste",
        "email": "joao1@example.com"
    }
}
```

#### PUT `/api/admin/transactions/{id}/approve`
Aprova uma transação de saque pendente.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Parâmetro URL:**
- `id`: ID da transação

**Resposta (200):**
```json
{
  "message": "Transaction approved successfully",
  "transaction": {
    "id": "9",
    "type": "withdraw",
    "amount": 20.01,
    "status": "approved",
    "approvedAt": "2026-02-26T10:00:00+00:00",
    "approvedBy": "admin@cassino.com"
  }
}
```

---

#### PUT `/api/admin/transactions/{id}/reject`
Rejeita uma transação de saque pendente.

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Parâmetro URL:**
- `id`: ID da transação

**Body (opcional):**
```json
{
  "rejectionReason": "Saldo insuficiente"
}
```

**Resposta (200):**
```json
{
  "message": "Transaction rejected successfully",
  "transaction": {
    "id": "9",
    "type": "withdraw",
    "amount": 20.01,
    "status": "rejected",
    "rejectedAt": "2026-02-26T10:00:00+00:00",
    "rejectedBy": "admin@cassino.com",
    "rejectionReason": "Saldo insuficiente"
  }
}
```

---

## Dados de Teste

### Admin
- **Email:** `admin@cassino.com`
- **Senha:** `admin123456`
- **Role:** `admin`

### Usuários Normais (Exemplo)
- **Email:** `joao@example.com`
- **Senha:** `password123`
- **Role:** `user`

---

## Autenticação

Todas as rotas que requerem autenticação devem incluir o header:
```
Authorization: Bearer {token}
```

Onde `{token}` é o valor retornado ao fazer login.

---

## Status de Desenvolvimento

| Rota | Status | Descrição |
| :--- | :--- | :--- |
| **Autenticação** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Register, Login, Logout, Me |
| **Perfil** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Ver e atualizar perfil, trocar senha |
| **Admin - Listar** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Lista todos os usuários |
| **Admin - Ver** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Ver detalhes de um usuário |
| **Admin - Atualizar** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Atualizar qualquer usuário |
| **Admin - Deletar** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Soft Delete de usuário |
| **Forgot Password** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Envia token para resetar senha |
| **Reset Password** | ![Completa](https://img.shields.io/badge/✅_Completa-brightgreen) | Reset de senha via token |
| **Refresh Token** | ![Em Dev](https://img.shields.io/badge/🔧_Em_Dev-orange) | Atualizar token de acesso |

---

## Carteira

### GET `/api/wallet/balance`
Retorna o saldo atual

**Resposta (200):**
```json
{
    "balance": 10100.5,
    "currency": "BRL"
}
```

### Depósito
#### POST	/api/wallet/deposit
Cria depósito PIX (gera QR code / copia-cola)	{ amount }

**Body:**
```json
{
    "amount": 100.50
}
```

**Resposta (201):**
```json
{
    "id": "3",
    "amount": 100.5,
    "pixCode": "PIX-aHuxsgjX2Ojma9Ab-1771856176",
    "qrCodeBase64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCI+CiAgICBQSVgtYUh1eHNnalgyT2ptYTlBYi0xNzcxODU2MTc2CiAgPC90ZXh0Pgo8L3N2Zz4=",
    "status": "approved",
    "expiresAt": "2026-02-23T14:46:16+00:00"
}
```

#### GET	/api/wallet/deposit/:id/status
Verifica status do depósito(depositId)

**Resposta (200):**
```json
{
    "id": "3",
    "amount": 100.5,
    "pixCode": "PIX-aHuxsgjX2Ojma9Ab-1771856176",
    "qrCodeBase64": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCI+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMjgwIiBoZWlnaHQ9IjI4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPHRleHQgeD0iMTUwIiB5PSIxNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCI+CiAgICBQSVgtYUh1eHNnalgyT2ptYTlBYi0xNzcxODU2MTc2CiAgPC90ZXh0Pgo8L3N2Zz4=",
    "status": "approved",
    "expiresAt": "2026-02-23T14:46:16+00:00"
}
```

### Saque
#### POST	/api/wallet/withdraw
Solicita saque PIX { amount, pixKeyType, pixKey }

**Body:**
```json
{
    "amount": 100.1,
    "pix_key_type": "cpf",
    "pix_key": "000.000.000-01"
}
```

**Resposta (201):**
```json
{
    "id": "1",
    "amount": 100.1,
    "pixKeyType": "cpf",
    "pixKey": "000.000.000-01",
    "status": "approved",
    "createdAt": "2026-02-23T13:52:15+00:00"
}
```

#### GET	/api/wallet/withdraw/:id/status
Verifica status do saque (withdrawId)

**Resposta (200):**
```json
{
    "id": "1",
    "amount": 100.1,
    "pixKeyType": "cpf",
    "pixKey": "000.000.000-01",
    "status": "approved",
    "createdAt": "2026-02-23T13:52:15+00:00"
}
```

---

## Transações
Lista todas as transações de usuários

- **Endpoints**:
  ```
  GET    /api/transactions              - Listar transações do usuário
  GET    /api/transactions/{id}         - Detalhes de uma transação
  POST   /api/transactions              - Criar transação (interno)
  PUT    /api/transactions/{id}         - Atualizar transação
  DELETE /api/transactions/{id}         - Deletar transação
  ```

```bash
GET /api/transactions
GET /api/transactions?type=deposit
GET /api/transactions?type=withdraw
GET /api/transactions?status=approved
GET /api/transactions?type=deposit&status=approved&page=1&limit=20
```

---

## Jogo — Crash

**Descrição:** Jogo de apostas em tempo real onde o multiplicador sobe até "crashar". Os jogadores devem retirar antes do crash para ganhar.

**Configurações Atuais:**
- **Tempo de aposta:** 10 segundos
- **Multiplicador máximo:** 3.00x
- **Velocidade:** 0.01 a cada 100ms
- **Duração máxima da rodada:** ~20 segundos

---

### GET `/api/games/crash/current`
Retorna o estado da rodada atual.

**Resposta (200):**
```json
{
  "status": "flying",
  "multiplier": 2.45,
  "countdown": null,
  "roundId": "round_abc123"
}
```

**Status possível:**
- `waiting` - Aguardando próxima rodada
- `betting` - Fase de apostas (temporizador 10s)
- `flying` - Multiplicador subindo
- `crashed` - Rodada finalizada

---

### GET `/api/games/crash/history`
Retorna o histórico das últimas 15 rodadas.

**Query Params:**
- `limit`: Limite de resultados (default: 15)

**Resposta (200):**
```json
{
  "data": [
    {
      "id": "round_abc123",
      "multiplier": 2.45,
      "timestamp": "2026-02-25T14:30:00+00:00",
      "hash": "a1b2c3d4e5f6..."
    },
    {
      "id": "round_abc122",
      "multiplier": 1.15,
      "timestamp": "2026-02-25T14:28:00+00:00",
      "hash": "f6e5d4c3b2a1..."
    }
  ]
}
```

---

### POST `/api/games/crash/bet`
Registra aposta na próxima rodada do Crash. Desconta o valor da carteira e cria transação.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 50.00
}
```

**Resposta (201):**
```json
{
  "message": "Aposta realizada",
  "betId": "123",
  "newBalance": 950.00,
  "roundId": "round_abc123"
}
```

**Resposta (400) - Saldo insuficiente:**
```json
{
  "message": "Saldo insuficiente"
}
```

**Resposta (400) - Fora da fase de aposta:**
```json
{
  "message": "Aguarde a próxima rodada para apostar"
}
```

---

### POST `/api/games/crash/cashout`
Faz cashout durante o voo do Crash. Adiciona o ganho à carteira.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "betId": "123"
}
```

**Resposta (200):**
```json
{
  "message": "Cashout realizado",
  "winAmount": 122.50,
  "multiplier": 2.45,
  "newBalance": 1122.50
}
```

**Resposta (400) - Jogo já crashou:**
```json
{
  "message": "Jogo já crashou ou não está em andamento"
}
```

**Resposta (400) - Cashout já realizado:**
```json
{
  "message": "Aposta já foi processada ou cashout realizada"
}
```

**Resposta (404) - Aposta não encontrada:**
```json
{
  "message": "Aposta não encontrada ou inválida"
}
```

---

### WebSocket: `ws://localhost:6003`

**Canal:** `crash-game`  
**Evento:** `.game.update`

**Eventos emitidos pelo servidor:**

| Evento | Dados | Descrição |
| :--- | :--- | :--- |
| `status` | `{ status: 'betting', roundId: 'round_XXX' }` | Nova rodada iniciada |
| `countdown` | `{ seconds: 10 }` | Contagem regressiva (10s → 0s) |
| `multiplier` | `{ multiplier: 1.25 }` | Atualização do multiplicador |
| `crash` | `{ multiplier: 2.45, roundId: 'round_XXX' }` | Rodada crashou |
| `player_cashout` | `{ playerId: 1, multiplier: 1.5, winAmount: 75 }` | Jogador fez cashout |

**Exemplo de fluxo:**
```
1. status: { status: 'betting', roundId: 'round_abc' }
2. countdown: { seconds: 10 }
3. countdown: { seconds: 9 }
...
4. countdown: { seconds: 0 }
5. status: { status: 'flying' }
6. multiplier: { multiplier: 1.01 }
7. multiplier: { multiplier: 1.02 }
...
8. multiplier: { multiplier: 2.45 }
9. crash: { multiplier: 2.45, roundId: 'round_abc' }
10. status: { status: 'waiting', roundId: 'round_xyz' }
```

---

### Game Loop (Backend)
O jogo é gerenciado pelo comando `php artisan game:crash-loop`, que roda em background e:

1. **Fase Betting (10s):** Aguarda apostas
2. **Fase Flying:** Multiplicador sobe de 0.01 em 0.01 a cada 100ms
3. **Crash:** Multiplicador crasha em ponto aleatório (1x - 3x)
4. **Processa Resultados:** Verifica apostas e cashouts
5. **Fase Waiting (3s):** Prepara próxima rodada

**Distribuição de Crash:**
- **10%** → Crash instantâneo (1.00x - 1.30x)
- **50%** → Crash baixo (1.30x - 1.80x)
- **30%** → Crash médio (1.80x - 2.50x)
- **10%** → Crash alto (2.50x - 3.00x)

---

## Jogo - Slots

### POST `/api/games/slots/spin`
Aposta no jogo Slots.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 10.00
}
```

**Resposta (200):**
```json
{
  "reels": [
    ["7️⃣", "⭐", "🍋", "💎", "🍋"],
    ["🍊", "🍊", "🍊", "🍊", "🍊"],
    ["7️⃣", "🍋", "💎", "🍊", "🔔"]
  ],
  "win": true,
  "multiplier": 10,
  "prize": 100,
  "newBalance": 26180.5,
  "betId": 184
}
```

---

Atualizado em: **27 de Fevereiro de 2026**