# API Documentation

Base URL: `http://localhost:<PORT>`

---

## Table of Contents

- [GET /health](#get-health)
- [GET /health/ready](#get-healthready)
- [GET /api/products](#get-apiproducts)
- [GET /api/weather/:city](#get-apiweathercity)
- [GET /api/dashboard](#get-apidashboard)

---

## GET /health

Basic health check endpoint. Returns the current status, uptime, and application version. No authentication required.

- **Method:** `GET`
- **Path:** `/health`
- **Authentication:** None

### Query Parameters

None.

### Response Shape

| Field     | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| `status`  | string | Server status (`"ok"`)                     |
| `uptime`  | number | Seconds since the server started           |
| `version` | string | Application version from `package.json`    |

### Example Response

```json
{
  "status": "ok",
  "uptime": 123,
  "version": "1.0.0"
}
```

### Error Codes

| Status | Description            |
| ------ | ---------------------- |
| `200`  | Success                |

---

## GET /health/ready

Readiness probe endpoint. Verifies that required data files are accessible before accepting traffic. No authentication required.

- **Method:** `GET`
- **Path:** `/health/ready`
- **Authentication:** None

### Query Parameters

None.

### Response Shape

| Field    | Type   | Description                                                    |
| -------- | ------ | -------------------------------------------------------------- |
| `status` | string | `"ready"` if all checks pass, `"not ready"` otherwise         |
| `checks` | object | Key-value pairs of subsystem names to their status (`"ok"` or `"fail"`) |

### Example Response

```json
{
  "status": "ready",
  "checks": {
    "products": "ok",
    "orders": "ok"
  }
}
```

### Error Codes

| Status | Description                         |
| ------ | ----------------------------------- |
| `200`  | All readiness checks passed         |
| `503`  | One or more readiness checks failed |

---

## GET /api/products

Returns the list of products. Supports optional filtering by category. Requires an `Authorization` header.

- **Method:** `GET`
- **Path:** `/api/products`
- **Authentication:** Bearer token (`Authorization` header)

### Query Parameters

| Parameter  | Type   | Required | Description                                      |
| ---------- | ------ | -------- | ------------------------------------------------ |
| `category` | string | No       | Filter products by category (case-insensitive)   |

### Response Shape

Returns an array of product objects:

| Field      | Type    | Description                    |
| ---------- | ------- | ------------------------------ |
| `id`       | number  | Unique product identifier      |
| `name`     | string  | Product name                   |
| `price`    | number  | Product price in USD           |
| `category` | string  | Product category               |
| `inStock`  | boolean | Whether the product is in stock|

### Example Response

```json
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 79.99,
    "category": "electronics",
    "inStock": true
  },
  {
    "id": 2,
    "name": "USB-C Charger",
    "price": 24.99,
    "category": "electronics",
    "inStock": true
  }
]
```

**Filtered example** (`GET /api/products?category=books`):

```json
[
  {
    "id": 3,
    "name": "JavaScript: The Good Parts",
    "price": 29.99,
    "category": "books",
    "inStock": true
  },
  {
    "id": 4,
    "name": "Clean Code",
    "price": 34.99,
    "category": "books",
    "inStock": false
  }
]
```

### Error Codes

| Status | Description                              |
| ------ | ---------------------------------------- |
| `200`  | Success                                  |
| `401`  | Missing or invalid `Authorization` header|

---

## GET /api/weather/:city

Returns current weather data for the specified city. Proxies the OpenWeatherMap API. No authentication required.

- **Method:** `GET`
- **Path:** `/api/weather/:city`
- **Authentication:** None

### Path Parameters

| Parameter | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| `city`    | string | Yes      | City name to look up (e.g. `London`) |

### Query Parameters

None.

### Response Shape

| Field         | Type   | Description                          |
| ------------- | ------ | ------------------------------------ |
| `city`        | string | Resolved city name                   |
| `temperature` | number | Temperature in Celsius               |
| `description` | string | Weather condition description        |
| `humidity`    | number | Humidity percentage                  |

### Example Response

```json
{
  "city": "London",
  "temperature": 15.2,
  "description": "scattered clouds",
  "humidity": 72
}
```

### Error Codes

| Status | Description                              |
| ------ | ---------------------------------------- |
| `200`  | Success                                  |
| `404`  | City not found                           |
| `502`  | Weather service unavailable or timed out |

---

## GET /api/dashboard

Returns an aggregated summary of the product catalog, including totals and a breakdown by category. No authentication required.

- **Method:** `GET`
- **Path:** `/api/dashboard`
- **Authentication:** None

### Query Parameters

None.

### Response Shape

| Field                | Type   | Description                                         |
| -------------------- | ------ | --------------------------------------------------- |
| `totalProducts`      | number | Total number of products                            |
| `totalCategories`    | number | Number of distinct product categories               |
| `productsByCategory` | object | Key-value pairs of category name to product count   |
| `timestamp`          | string | ISO 8601 timestamp of when the response was generated |

### Example Response

```json
{
  "totalProducts": 6,
  "totalCategories": 3,
  "productsByCategory": {
    "electronics": 2,
    "books": 2,
    "clothing": 2
  },
  "timestamp": "2026-03-26T12:00:00.000Z"
}
```

### Error Codes

| Status | Description |
| ------ | ----------- |
| `200`  | Success     |
