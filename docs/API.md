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

Readiness probe endpoint. Indicates whether the service is ready to accept traffic. No authentication required.

- **Method:** `GET`
- **Path:** `/health/ready`
- **Authentication:** None

### Query Parameters

None.

### Response Shape

| Field   | Type   | Description                          |
| ------- | ------ | ------------------------------------ |
| `ready` | boolean | Whether the service is ready        |

### Example Response

```json
{
  "ready": true
}
```

### Error Codes

| Status | Description                        |
| ------ | ---------------------------------- |
| `200`  | Service is ready                   |
| `503`  | Service is not ready               |

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

Aggregated dashboard endpoint. Returns a combined summary of health status, product statistics, and weather data in a single response.

- **Method:** `GET`
- **Path:** `/api/dashboard`
- **Authentication:** Bearer token (`Authorization` header)

### Query Parameters

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| `city`    | string | No       | City name for weather summary (default: none)|

### Response Shape

| Field               | Type   | Description                              |
| ------------------- | ------ | ---------------------------------------- |
| `health`            | object | Current health status                    |
| `health.status`     | string | Server status (`"ok"`)                   |
| `health.uptime`     | number | Seconds since the server started         |
| `health.version`    | string | Application version                      |
| `products`          | object | Product statistics                       |
| `products.total`    | number | Total number of products                 |
| `products.inStock`  | number | Number of products currently in stock    |
| `weather`           | object \| null | Weather summary (null if `city` not provided) |
| `weather.city`      | string | Resolved city name                       |
| `weather.temperature` | number | Temperature in Celsius                 |
| `weather.description` | string | Weather condition description          |
| `weather.humidity`  | number | Humidity percentage                      |

### Example Response

```json
{
  "health": {
    "status": "ok",
    "uptime": 456,
    "version": "1.0.0"
  },
  "products": {
    "total": 6,
    "inStock": 5
  },
  "weather": {
    "city": "London",
    "temperature": 15.2,
    "description": "scattered clouds",
    "humidity": 72
  }
}
```

**Without `city` parameter:**

```json
{
  "health": {
    "status": "ok",
    "uptime": 456,
    "version": "1.0.0"
  },
  "products": {
    "total": 6,
    "inStock": 5
  },
  "weather": null
}
```

### Error Codes

| Status | Description                              |
| ------ | ---------------------------------------- |
| `200`  | Success                                  |
| `401`  | Missing or invalid `Authorization` header|
| `502`  | Weather service unavailable (if `city` provided) |
