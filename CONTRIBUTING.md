# Contributing to SwissKnife

Thank you for contributing.

## Requirements

- Node.js **20 or later** (see `engines` in `package.json`)
- npm 10+

You cannot develop against the pre-built GHCR image; use the source.

### Option 1 — Vite (recommended)

```bash
git clone https://github.com/lucas-lepajollec/SwissKnife.git
cd SwissKnife
npm install
npm run dev
```

App URL: `http://localhost:2499`

### Option 2 — Docker from source

```bash
docker compose -f docker-compose.build.yml up -d --build
```

App URL: `http://localhost:2501` (host 2501 → container 8080).

## Checks before a pull request

```bash
npm run lint
npm test
npm run build
```

Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

Open the pull request against `main`.
