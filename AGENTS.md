# SwissKnife agent guide

This file is public repository guidance for maintainers and AI agents. Inspect the current branch, working tree, code, configuration and documentation before changing anything. Preserve unrelated work.

## Product boundaries

SwissKnife converts media locally in the browser. User files must not be uploaded, and FFmpeg WebAssembly's COOP/COEP requirements must remain intact. Add formats only when browser feasibility, codec/container support, memory limits and licensing are understood.

## Development

- Use Node.js 20 or later and install reproducibly with `npm ci`.
- Local development: `npm run dev`; trusted-LAN development: `npm run dev:lan`.
- Validate with `npm run lint`, `npm test` and `npm run build`.
- Use `npm run build:demo` when public-demo behavior changes.
- Validate container changes with the repository Docker Compose build path.

## Repository expectations

- Update tests, `README.md`, compatibility notes, `NOTICE.md` and `CHANGELOG.md` when applicable.
- Never commit `.env` values, user media, generated builds or dependencies.
- Follow `CONTRIBUTING.md` for pull requests and `SECURITY.md` for vulnerabilities.
- GitHub is the public review surface; maintainers integrate the exact accepted result into authoritative Forgejo history.

Local machine notes belong in ignored `AGENTS.override.md` and `.project-local/`, never in this public file.
