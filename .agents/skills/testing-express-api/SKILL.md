---
name: testing-express-api
description: Test Express API endpoints end-to-end locally. Use when verifying new or modified API routes.
---

# Testing Express API Endpoints

## Prerequisites
- Node.js 20 LTS
- Dependencies installed: `npm ci`

## Running the Server
```bash
cd /home/ubuntu/repos/devinai-test-repo
node src/server.js
# Server starts on port 3000 (or PORT env var)
```

## Running Tests
```bash
npm test
# Runs Jest with --forceExit --detectOpenHandles
```

## Manual API Testing
The auth middleware (`src/middleware/auth.js`) requires any `Authorization` header to be present. Use a dummy bearer token for testing:

```bash
# Authenticated request
curl -s -w "\nHTTP_STATUS:%{http_code}" -H "Authorization: Bearer test" http://localhost:3000/<endpoint>

# Unauthenticated request (expect 401)
curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3000/<endpoint>
```

## Route Registration
All routes are registered in `src/app.js`. Protected routes use the `auth` middleware. Check `src/routes/` for available route files.

## Key Conventions
- Route files: `src/routes/[name].js` (each exports an Express Router)
- Data files: `src/data/[name].json`
- Test files: `__tests__/[name].test.js`
- Run `npx prettier --write .` before committing
- Use conventional commit format (feat:, fix:, test:, docs:)

## Notes
- Testing is shell-based (curl), no browser recording needed
- Health endpoint (`/health`) does not require auth
- Weather endpoint (`/api/weather`) does not require auth but needs `WEATHER_API_KEY` env var
- All other routes require the `Authorization` header

## Devin Secrets Needed
- `WEATHER_API_KEY` — only needed if testing the weather endpoint (OpenWeatherMap API key)
