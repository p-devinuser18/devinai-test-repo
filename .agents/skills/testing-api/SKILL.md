---
name: testing-api-endpoints
description: Test Express API endpoints (health, profile, etc.) end-to-end locally. Use when verifying API route changes.
---

# Testing API Endpoints

## Prerequisites
- Node.js installed
- `npm install` run in the repo root

## Running the Server
```bash
cd /home/ubuntu/repos/devinai-test-repo
PORT=3001 node src/server.js
```
Use a non-default port (e.g. 3001) to avoid conflicts.

## Running Jest Tests
```bash
npx jest --forceExit --detectOpenHandles __tests__/<test-file>.test.js
```
- `--forceExit` and `--detectOpenHandles` are required (configured in package.json)
- Run specific test files rather than the full suite if `products.js` has syntax errors (see Known Issues)

## Testing Endpoints via curl

### Unauthenticated endpoints (e.g. /health)
```bash
curl -s http://localhost:3001/health
```

### Authenticated endpoints (e.g. /api/profile, /users, /api/products)
The auth middleware (`src/middleware/auth.js`) only checks for the presence of an `Authorization` header — any non-empty value works:
```bash
curl -s -H "Authorization: Bearer test" http://localhost:3001/api/profile/1
```
Without the header, you get `401 {"error":"Authorization token required"}`.

## Known Issues
- `src/routes/products.js` on the `te-main` branch may have a syntax error. The app wraps its import in a try-catch so it can still start. If running the full Jest suite, products-related tests will fail due to this — run specific test files instead.
- No CI checks are configured on this repo. Rely on local Jest runs for validation.

## Test Strategy
This is a REST API with no frontend UI. All testing is shell-based (curl + Jest). No screen recording is needed.

### Key things to verify for new endpoints:
1. Correct HTTP status codes (200, 404, 401)
2. Correct JSON response body with expected fields and values
3. Auth middleware applied correctly (protected routes return 401 without auth)
4. Edge cases: non-existent IDs, non-numeric IDs, missing parameters
