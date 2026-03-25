# Post-Deploy Checklist

## Pre-Deployment

- [ ] All tests pass on main branch (`npm test`)
- [ ] CI pipeline is green
- [ ] PR has been reviewed and approved
- [ ] No pending merge conflicts

## Deployment Verification

- [ ] `GET /health` returns 200 with correct version
- [ ] `GET /health/ready` returns 200 (all dependencies up)
- [ ] `GET /api/products` returns product list
- [ ] `GET /api/weather/London` returns weather data (if configured)

## Post-Deployment Monitoring (first 15 min)

- [ ] No new ERROR-level log entries
- [ ] Response times within normal range
- [ ] No 5xx errors in server logs
- [ ] Previous version available for rollback if needed

## Rollback Procedure

1. Identify the last known good commit hash
2. Create a revert PR or deploy previous version
3. Verify health checks pass after rollback
4. Investigate root cause before re-deploying
