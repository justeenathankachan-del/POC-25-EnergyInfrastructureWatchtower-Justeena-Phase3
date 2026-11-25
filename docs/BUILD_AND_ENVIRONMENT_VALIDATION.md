# Build and Environment Validation — PoC-25
- **Runtime**: Node.js `v22.x`, Next.js `16.4.5` (Turbopack, standalone output), React `19.3.0`, Python `3.12`
- **Environment**: `.env.example` documents optional server-side `EIA_API_KEY`; zero secrets in `NEXT_PUBLIC_*` or client bundles.
- **Build & Container**: `npm run build` runs `publish_intelligence.py` before `next build`; multi-stage `Dockerfile` builds cleanly with non-root user and health check on `/`.
- **Final Result**: `PASS`
