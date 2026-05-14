---
name: testing-api-endpoints
description: Test REST API endpoints end-to-end in the devinai-test-repo. Use when verifying new or modified routes.
---

# Testing API Endpoints

## Prerequisites
- Node.js 20 LTS
- Run `npm install` (or `npm ci` for lockfile-exact install)

## Running Unit Tests
```bash
npm test
# Runs: jest --forceExit --detectOpenHandles
```
All existing + new tests must pass before opening a PR.

## Running the Server Locally
```bash
cd /home/ubuntu/repos/devinai-test-repo
node src/server.js
# Listens on port 3000 by default (override with PORT env var)
```

## Auth for Protected Routes
Most routes require an `Authorization` header. The auth middleware (`src/middleware/auth.js`) checks for the presence of a token but does not validate it, so any bearer token works for local testing:
```bash
curl -H "Authorization: Bearer test-token" http://localhost:3000/api/<route>
```
Without the header, protected routes return `401 {"error": "Authorization token required"}`.

Unprotected routes: `/health`

## Route Registration
All routes are registered in `src/app.js`. Auth middleware must be mounted before route handlers.

## Data Files
Static JSON data lives in `src/data/`. Routes read data via `fs.promises.readFile` (see `src/routes/products.js` for the pattern).

## ESLint
The repo currently has no ESLint config file at the project root. `npx eslint` will fail with a config-not-found error. This might be fixed in the future — try running it and if it fails due to missing config, note it as a pre-existing issue.

## Off-Limits Files (Do NOT Modify)
- `__tests__/existing.test.js`
- `package.json` scripts section
- `src/middleware/auth.js`
- `.github/` directory

## Conventions
- Route files: `src/routes/[name].js` (Express Router)
- Test files: `__tests__/[name].test.js`
- Follow patterns in `src/routes/users.js` and `__tests__/products.test.js`
- Commit messages: conventional format (`feat:`, `fix:`, `test:`, `docs:`)
- Branching: `feature/[short-description]`
