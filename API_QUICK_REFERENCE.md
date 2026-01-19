# 🚀 WatchMeGym API - Referência Rápida

**Base:** `http://localhost:3000/api`

---

## 🔐 Auth

| Endpoint | Method | Body |
|----------|--------|------|
| `/auth/register` | POST | `{ email, password, name, phone?, cpfCnpj? }` |
| `/auth/login` | POST | `{ email, password }` |
| `/auth/me` | GET | Header: `Authorization: Bearer {token}` |
| `/auth/refresh` | POST | `{ refreshToken }` |
| `/auth/logout` | POST | Header: `Authorization: Bearer {token}` |
| `/auth/forgot-password` | POST | `{ email }` |
| `/auth/reset-password` | POST | `{ token, password }` |

---

## 👤 Users

| Endpoint | Method | Body |
|----------|--------|------|
| `/users` | GET | - |
| `/users/:id` | GET | - |
| `/users` | POST | `{ email, name, phone?, cpfCnpj? }` |
| `/users/:id` | PUT | `{ name?, phone?, cpfCnpj? }` |
| `/users/:id` | DELETE | - |

---

## 📊 Bioimpedances

| Endpoint | Method | Body |
|----------|--------|------|
| `/bioimpedances` | GET | - |
| `/bioimpedances` | POST | `{ userId, weight, height, bmi, bmr }` |
| `/bioimpedances/:id` | GET | - |
| `/bioimpedances/user/:userId` | GET | - |

---

## 🏢 Academies

| Endpoint | Method | Body |
|----------|--------|------|
| `/academies` | GET | - |
| `/academies` | POST | `{ name, address, phone, email }` |
| `/academies/:id` | GET | - |
| `/academies/:id` | PUT | `{ name?, address?, phone?, email? }` |
| `/academies/:id` | DELETE | - |

---

## 🎥 Cameras

| Endpoint | Method | Body |
|----------|--------|------|
| `/cameras` | GET | - |
| `/cameras` | POST | `{ academyId, name, streamUrl, enabled }` |
| `/cameras/:id` | GET | - |
| `/cameras/academy/:academyId` | GET | - |

---

## 💪 Exercises

| Endpoint | Method | Body |
|----------|--------|------|
| `/exercises` | GET | - |
| `/exercises` | POST | `{ name, description }` |
| `/exercises/:id` | GET | - |

---

## 📈 Statistics

| Endpoint | Method | Body |
|----------|--------|------|
| `/statistics` | GET | - |
| `/statistics` | POST | `{ cameraId, userId, quantityRepetitions, quantitySets }` |
| `/statistics/user/:userId` | GET | - |

---

## 🎬 Recordings

| Endpoint | Method | Body |
|----------|--------|------|
| `/recordings/start` | POST | `{ cameraId, userId, duration }` |
| `/recordings/status/:recordId` | GET | - |

---

## 📹 Records

| Endpoint | Method | Body |
|----------|--------|------|
| `/records` | GET | - |
| `/records/user/:userId` | GET | - |
| `/records/camera/:cameraId` | GET | - |

---

## 💳 Plans

| Endpoint | Method | Body |
|----------|--------|------|
| `/plans` | GET | - |
| `/plans` | POST | `{ name, price, billingType, cycle }` |

---

## 📝 Subscriptions

| Endpoint | Method | Body |
|----------|--------|------|
| `/subscriptions` | GET | - |
| `/subscriptions` | POST | `{ userId, planId, paymentMethod, nextDueDate }` |
| `/subscriptions/user/:userId` | GET | - |

---

## 💰 Payments

| Endpoint | Method | Body |
|----------|--------|------|
| `/payments` | GET | - |
| `/payments` | POST | `{ subscriptionId, userId, amount, billingType, dueDate }` |
| `/payments/subscription/:subscriptionId` | GET | - |

---

## 🔗 Academy-Users

| Endpoint | Method | Body |
|----------|--------|------|
| `/academy-users` | POST | `{ userId, academyId }` |
| `/academy-users/active/:userId` | GET | - |
| `/academy-users/academy/:academyId` | GET | - |
| `/academy-users/user/:userId` | GET | - |

---

## 📌 Notas

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {accessToken}  // Para rotas protegidas
```

**Response Success:**
```json
{ "id": "uuid", "field": "value", ... }
```

**Response Error:**
```json
{ "error": "Mensagem de erro" }
```

**Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
