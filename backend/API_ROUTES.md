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
| **Forgot Password** | ![Em Dev](https://img.shields.io/badge/🔧_Em_Dev-orange) | Envio de email para reset |
| **Reset Password** | ![Em Dev](https://img.shields.io/badge/🔧_Em_Dev-orange) | Reset de senha via token |
| **Refresh Token** | ![Em Dev](https://img.shields.io/badge/🔧_Em_Dev-orange) | Atualizar token de acesso |

---

## Notas Importantes

1. **Soft Delete:** Quando um usuário é deletado via `/api/admin/users/{id}` (DELETE), ele não é realmente removido do banco. Apenas a coluna `deleted_at` é preenchida.

2. **Permissões:** As rotas de admin (`/api/admin/*`) requerem `role = 'admin'`. Usuários normais recebem erro 403.

3. **Validações:** 
   - Email é único
   - CPF é validado no formato `000.000.000-00`
   - Senhas mínimo 6 caracteres

4. **Response:** Todos as respostas são em JSON com HTTP status codes apropriados.

---

Atualizado em: **20 de Fevereiro de 2026**
