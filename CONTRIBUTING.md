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
npm ci
npm run dev
```

App URL: `http://localhost:2499`

The development server is loopback-only by default. Use `npm run dev:lan`
only when testing from another device on a trusted local network.

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

Use `npm ci` for an existing checkout so the committed lockfile remains unchanged. Use `npm install` only when intentionally changing dependencies, and include the resulting `package.json` and `package-lock.json` changes in the same pull request.

## Maintainer release process

Releases are deliberate milestones, not snapshots of every merge. Prepare a release pull request that updates the declared version, moves completed entries out of `Unreleased` in [CHANGELOG.md](CHANGELOG.md), and documents compatibility when relevant. After all required checks pass, tag the exact accepted `main` commit with an annotated `vMAJOR.MINOR.PATCH` tag and push it through the authoritative Forgejo remote. Verify that the identical tag reaches GitHub and that the versioned container finishes successfully before publishing a draft GitHub release. Never move or reuse a published version tag.
