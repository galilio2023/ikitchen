## Plan: Review & Harden DB + Projects API

TL;DR — I'll review and harden database connectivity, seeding, and the projects endpoints so the DB is safe and stable and the API returns correct status codes and shapes. The plan focuses on `dbConnect`, health/readiness, `projects` endpoints (GET/POST/+id handlers), models (`Project`, `Kitchen`, `User`), seeding, validations, and CI checks.

### Steps
1. Inspect and harden `dbConnect` (`src/lib/dbConnect.ts`) — verify global cache, timeout options, error logging, and that it never swallows errors; confirm `MONGODB_URI` guard and return types for `dbConnect`.
2. Audit health endpoints (`src/app/api/health/route.ts`) — ensure `GET` reports DB readiness and returns 200/503 consistently; confirm `HEAD` readiness uses `dbConnect` and short timeout.
3. Review `GET` in `src/app/api/projects/route.ts` — remove inline auto-seeding from a GET handler; replace with: only read, use `Promise.race` with a connection timeout, return 200/503 or 200 with empty list on DB-unavailable, and ensure response is `.lean()` and contains `id` fields where expected.
4. Move seeding into `scripts/seed.ts` (or a dedicated `POST /api/seed` gated by env/auth) — ensure `scripts/seed.ts` uses `src/models/Project` and `Kitchen` correctly, validates env, and exits with proper codes; remove or disable GET-triggered seed steps.
5. Harden `POST` in `src/app/api/projects/route.ts` and `/projects/[id]` handlers — add input validation (use `src/lib/validations` or `safeValidateRequest` patterns), authenticate/authorize (note admin-only operations), create `Project` then `Kitchen` transactionally (or ensure rollback on failure), and return proper JSON with status codes and canonical ids.
6. Validate model schemas and indexes (`src/models/Project.ts`, `src/models/Kitchen.ts`, `src/models/User.ts`) — ensure required fields align with API, default enums/mapping are correct, and that virtual `id`/toJSON behavior is consistent for responses.
7. Add tests and quality gates — unit tests for `dbConnect` behavior (cache + error), integration tests for `health` and `projects` endpoints (happy + DB-down), run lint/types (`eslint`, `tsc`), and ensure `get_errors`/CI passes before merge.

### Further Considerations
1. Seeding policy: Should seeding run on GET when DB empty? Option A: never — use `scripts/seed.ts` (recommended). Option B: gated auto-seed behind `NODE_ENV !== 'production' && process.env.AUTO_SEED === '1'`. Option C: expose an authenticated admin-only `POST /api/seed`.
2. Validation & Auth: Should `POST /api/projects` be authenticated? Recommendation: require session; if not possible now, add clear TODO and stricter validation to prevent malformed DB writes.
3. Error reporting & monitoring: Add structured logging in `dbConnect`, endpoints, and seed script; decide whether to return 503 vs 200+empty on DB errors for public endpoints to avoid leaking internal state.

Please review this draft plan and tell me which option for seeding and auth you prefer (or any constraints like "must keep GET auto-seed for demo"), then I’ll produce a concrete edit checklist and prioritized patch list you can apply.
