# 🎲 Velvet Stake Hub - API Documentation

## ✅ Status: Todos os Endpoints Funcionando!

**Base URL:** `http://localhost:8000/api`

---

## 1. 🔐 AUTENTICAÇÃO (`/api/auth`)

### POST `/api/auth/register`
Cadastro de novo usuário.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "password": "senha123",
  "password_confirmation": "senha123"
}
```

**Response (201):**
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
    "joinedAt": "2026-02-19T18:36:35+00:00"
  },
  "token": "3|EeUGS8v1JzQTAbcdef..."
}
```

---

### POST `/api/auth/login`
Login com email e senha.

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "senha123",
  "rememberMe": true // opcional
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "7|WssBRifnYBHeNYQs35tQA0mGsYXsY..."
}
```

---

### GET `/api/auth/me`
Retorna dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": 5,
    "name": "Carlos",
    "email": "carlos@example.com",
    "cpf": "333.444.555-66",
    "avatar": null,
    "balance": 0,
    "level": "VIP Silver",
    "joinedAt": "2026-02-19T18:36:35+00:00"
  }
}
```

---

### POST `/api/auth/logout`
Encerra a sessão (revoga o token).

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### POST `/api/auth/forgot-password`
Envia email de recuperação de senha.

**Request:**
```json
{
  "email": "joao@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account with that email exists, a password reset link has been sent."
}
```

---

### POST `/api/auth/reset-password`
Redefine senha via token.

**Request:**
```json
{
  "token": "reset_token_here",
  "newPassword": "novaSenha123",
  "newPassword_confirmation": "novaSenha123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

### POST `/api/auth/refresh-token`
Renova o token de acesso (JWT).

**Request:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "token": "new_token_here"
}
```

---

## 2. 👤 USUÁRIO / PERFIL (`/api/users`)

### GET `/api/users/profile`
Dados completos do perfil do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "user": {
    "id": 5,
    "name": "Carlos",
    "email": "carlos@example.com",
    "cpf": "333.444.555-66",
    "avatar": null,
    "balance": 0,
    "level": "VIP Silver",
    "joinedAt": "2026-02-19T18:36:35+00:00"
  }
}
```

---

### PUT `/api/users/profile`
Atualiza dados do perfil.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "name": "Carlos Updated",
  "email": "carlos.new@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 5,
    "name": "Carlos Updated",
    "email": "carlos.new@example.com",
    "cpf": "333.444.555-66",
    "avatar": "https://example.com/avatar.jpg",
    "balance": 0,
    "level": "VIP Silver",
    "joinedAt": "2026-02-19T18:36:35+00:00"
  }
}
```

---

### PUT `/api/users/change-password`
Altera a senha do usuário.

**Headers:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha123",
  "newPassword_confirmation": "novaSenha123"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## 📊 Modelo User

```typescript
{
  id: number;                    // ID único
  name: string;                  // Nome do usuário
  email: string;                 // Email único
  cpf: string;                   // CPF formato 000.000.000-00
  avatar: string | null;         // URL da foto de perfil
  balance: number;               // Saldo em decimal (15,2)
  level: string;                 // "VIP Silver", "VIP Gold", etc.
  joinedAt: string;              // ISO 8601 datetime
}
```

---

## 🔒 Autenticação

- **Tipo:** Sanctum Token (Laravel)
- **Header:** `Authorization: Bearer {token}`
- **Formato:** `{id}|{token_string}`
- **Armazenamento:** Banco de dados PostgreSQL

---

## 📦 Stack

- **Backend:** Laravel 10
- **Banco:** PostgreSQL 16
- **Cache:** Redis 7
- **Autenticação:** Laravel Sanctum
- **Validação:** Laravel Validation
- **ORM:** Eloquent

---

## 🚀 Como Testar

### 1. Registrar novo usuário
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "cpf": "123.456.789-00",
    "password": "senha123",
    "password_confirmation": "senha123"
  }'
```

### 2. Fazer login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "senha123"
  }'
```

### 3. Usar token para acessar dados protegidos
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/profile
```

---

## ✅ Testes Executados

- ✅ POST `/api/auth/register` - Cadastro funcionando
- ✅ POST `/api/auth/login` - Login funcionando
- ✅ GET `/api/auth/me` - Retorna usuário autenticado
- ✅ GET `/api/users/profile` - Retorna perfil completo
- ✅ PUT `/api/users/profile` - Atualiza perfil
- ✅ PUT `/api/users/change-password` - Altera senha
- ✅ POST `/api/auth/logout` - Logout revoga token

---

## 🗄️ Acessos ao Banco

| Ferramenta | URL | Credenciais |
|-----------|-----|-------------|
| **PGAdmin** | http://localhost:8081 | admin@example.com / admin123 |
| **PostgreSQL** | localhost:5432 | velvet / secret123 |

---

## 📝 Próximas Etapas

1. [ ] Implementar endpoints de jogos (Crash, Slots, Roulette, Blackjack)
2. [ ] Criar endpoints de apostas (Bets)
3. [ ] Implementar sistema de transações (depósito/saque)
4. [ ] Criar endpoints de histórico
5. [ ] Implementar validações avançadas
6. [ ] Adicionar testes automatizados (PHPUnit)
7. [ ] Configurar rate limiting
8. [ ] Adicionar logging detalhado
