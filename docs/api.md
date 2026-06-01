# StockFlow API Reference

Base URL: `http://localhost:3001/api`

All protected endpoints require a `Authorization: Bearer <token>` header. Tokens are obtained from `/api/auth/signup` or `/api/auth/login`.

All responses follow the shape:
```json
{ "success": true, "data": { ... } }
// or on error:
{ "success": false, "message": "..." }
```

---

## Authentication

### POST /api/auth/signup

Creates a new organization and its first user, returns a JWT.

**Request body**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "organizationName": "Acme Corp"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | User's display name |
| email | string | yes | Must be unique |
| password | string | yes | Minimum 6 characters |
| organizationName | string | yes | Name of the new organization |

**Response `201`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "organizationId": "uuid",
    "createdAt": "2026-06-01 12:00:00",
    "updatedAt": "2026-06-01 12:00:00"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 409 | Email already in use |
| 422 | Validation errors array |

---

### POST /api/auth/login

Authenticates an existing user, returns a JWT.

**Request body**
```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "organizationId": "uuid",
    "createdAt": "2026-06-01 12:00:00",
    "updatedAt": "2026-06-01 12:00:00"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | Invalid credentials |
| 422 | Validation errors array |

---

### POST /api/auth/logout

Stateless logout — the client should discard the token.

**Request body** — none

**Response `200`**
```json
{ "success": true, "message": "Logged out" }
```

---

### GET /api/auth/me

Returns the currently authenticated user. **Protected.**

**Response `200`**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "organizationId": "uuid",
    "createdAt": "2026-06-01 12:00:00",
    "updatedAt": "2026-06-01 12:00:00"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 401 | Authentication required / Invalid or expired token |

---

## Dashboard

### GET /api/dashboard

Returns a summary scoped to the authenticated user's organization. **Protected.**

**Response `200`**
```json
{
  "success": true,
  "data": {
    "totalProducts": 50,
    "totalInventory": 1200,
    "lowStockProducts": [
      {
        "id": "uuid",
        "name": "Wireless Mouse",
        "sku": "WM-001",
        "quantity": "3",
        "lowStockThreshold": 10,
        "costPrice": 15.00,
        "sellPrice": 29.99,
        "organizationId": "uuid",
        "createdAt": "2026-06-01 12:00:00",
        "updatedAt": "2026-06-01 12:00:00",
        "updatedBy": "uuid"
      }
    ]
  }
}
```

| Field | Description |
|-------|-------------|
| totalProducts | Count of all products in the organization |
| totalInventory | Sum of all product quantities |
| lowStockProducts | Products where `quantity <= lowStockThreshold` |

---

## Products

All product endpoints are **protected** and automatically scoped to the authenticated user's organization.

### GET /api/products

Lists all products. Supports optional search by name or SKU.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| search | string | Filters by name or SKU (case-insensitive partial match) |

**Example:** `GET /api/products?search=WM-001`

**Response `200`**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Wireless Mouse",
      "sku": "WM-001",
      "description": "Ergonomic wireless mouse",
      "quantity": "50",
      "lowStockThreshold": 10,
      "costPrice": 15.00,
      "sellPrice": 29.99,
      "organizationId": "uuid",
      "createdAt": "2026-06-01 12:00:00",
      "updatedAt": "2026-06-01 12:00:00",
      "updatedBy": "uuid"
    }
  ]
}
```

---

### GET /api/products/:id

Returns a single product by ID.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "description": "Ergonomic wireless mouse",
    "quantity": "50",
    "lowStockThreshold": 10,
    "costPrice": 15.00,
    "sellPrice": 29.99,
    "organizationId": "uuid",
    "createdAt": "2026-06-01 12:00:00",
    "updatedAt": "2026-06-01 12:00:00",
    "updatedBy": "uuid"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 404 | Product not found |

---

### POST /api/products

Creates a new product. `organizationId` and `updatedBy` are set automatically from the JWT.

**Request body**
```json
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "description": "Ergonomic wireless mouse",
  "quantity": "50",
  "lowStockThreshold": 10,
  "costPrice": 15.00,
  "sellPrice": 29.99
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | yes | |
| sku | string | yes | Must be unique within the organization |
| description | string | no | Defaults to `""` |
| quantity | string | no | Defaults to `"0"` |
| lowStockThreshold | integer | no | Defaults to `10` |
| costPrice | number | yes | Non-negative |
| sellPrice | number | yes | Non-negative |

**Response `201`**
```json
{
  "success": true,
  "data": { /* full product object */ }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 409 | SKU already exists in this organization |
| 422 | Validation errors array |

---

### PUT /api/products/:id

Updates one or more fields on an existing product. Send only the fields you want to change.

**Request body** (all fields optional)
```json
{
  "name": "Wireless Mouse v2",
  "sellPrice": 34.99
}
```

**Response `200`**
```json
{
  "success": true,
  "data": { /* updated product object */ }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 404 | Product not found |
| 409 | SKU already exists in this organization |

---

### DELETE /api/products/:id

Deletes a product.

**Response `200`**
```json
{
  "success": true,
  "message": "Product deleted",
  "data": { /* deleted product object */ }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 404 | Product not found |

---

## Inventory

### POST /api/products/:id/adjust-stock

Adjusts a product's quantity by a positive or negative integer. Quantity cannot go below 0. **Protected.**

**Request body**
```json
{
  "adjustment": 5,
  "note": "Stock Received"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| adjustment | number | yes | Positive to add stock, negative to remove |
| note | string | no | Informational only, not persisted |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wireless Mouse",
    "sku": "WM-001",
    "quantity": "55",
    "updatedAt": "2026-06-01T13:00:00.000Z",
    "updatedBy": "uuid"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 404 | Product not found |
| 422 | adjustment is required / must be a number |

---

## Settings

Settings map to the authenticated user's organization. Both endpoints are **protected.**

### GET /api/settings

Returns the current organization settings.

**Response `200`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "defaultLowStockThreshold": 10,
    "createdAt": "2026-06-01 12:00:00",
    "updatedAt": "2026-06-01 12:00:00"
  }
}
```

---

### PUT /api/settings

Updates organization settings.

**Request body**
```json
{
  "defaultLowStockThreshold": 5
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| defaultLowStockThreshold | integer | no | Non-negative integer |

**Response `200`**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Acme Corp",
    "defaultLowStockThreshold": 5,
    "createdAt": "2026-06-01 12:00:00",
    "updatedAt": "2026-06-01T13:00:00.000Z"
  }
}
```

**Errors**

| Status | Message |
|--------|---------|
| 422 | defaultLowStockThreshold must be a non-negative number |
