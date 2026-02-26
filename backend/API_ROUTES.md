# Rotas da API

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
  "newPassword": "NovaSenha123!",
  "newPassword_confirmation": "NovaSenha123!"
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
Por ora é necessário rodar o comando "./docker-artisan.sh game:crash-loop" para iniciar o loop do jogo.

### GET `/api/games/crash/current`
Retorna o estado da rodada atual do Crash.

**Resposta (200):**
```json
{
  "status": "flying",
  "multiplier": 2.45,
  "countdown": null,
  "roundId": "round_abc123"
}
```

**Status possíveis:** `waiting`, `flying`, `crashed`

---

### GET `/api/games/crash/history`
Retorna o histórico das últimas rodadas.

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
Registra aposta na próxima rodada do Crash.

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
  "message": "Bet placed successfully",
  "bet": {
    "id": "bet_123",
    "amount": 50.00,
    "roundId": "round_abc123",
    "status": "pending"
  }
}
```

---

### POST `/api/games/crash/cashout`
Faz cashout durante o voo do Crash.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "betId": "bet_123"
}
```

**Resposta (200):**
```json
{
  "message": "Cashout successful",
  "multiplier": 2.45,
  "payout": 122.50,
  "newBalance": 1122.50
}
```

---

### ⚡ WebSocket: `ws://host/ws/crash`

**Eventos emitidos pelo servidor:**

| Evento | Descrição |
| :--- | :--- |
| `round_start` | Nova rodada iniciada, contagem regressiva |
| `multiplier_update` | Multiplicador em tempo real |
| `round_crash` | Rodada crashou + multiplicador final |
| `player_cashout` | Jogador fez cashout (público) |
| `countdown` | Contagem regressiva para próxima rodada |

---

Atualizado em: **26 de Fevereiro de 2026**