# Changelog

Notable user-visible changes to SwissKnife will be recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and published versions will follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- Let Docker Compose derive the stack and container names instead of imposing a fixed global container name.

## [0.1.3] - 2026-09-08

### Changed

- Make the default Compose file directly reference the published GHCR image, without an unnecessary image-override expression.

## [0.1.2] - 2026-09-08

### Changed

- Use the established port `2501` both on the Docker host and inside the container, and reduce the default Compose file to the settings required to run the image.

## [0.1.1] - 2026-09-08

### Changed

- Compose uses Docker's standard all-interface port mapping by default. Use `127.0.0.1:2501:8080` for localhost-only publication.
- No application configuration or data migration is required; operators recreating an existing container should review the new LAN-reachable port default.

## [0.1.0] - 2026-09-06

### Added

- The first deliberately maintained SwissKnife release line.
- Browser-local image, audio and video conversion without uploading source files to a conversion server.
- A consistent repository, quality, security, and release foundation.
- English, French, Spanish and German interfaces, a deterministic public demo and explicit browser/codec/memory limits.
- Stateless multi-architecture container delivery with the same-origin FFmpeg WASM runtime, SBOM, provenance and immutable commit-SHA rollback tags.

### Changed

- Adopted the standalone Format Loop identity across the product and browser icons.

Earlier development remains available in Git history; this changelog does not invent releases that were never deliberately published.

[Unreleased]: https://github.com/lucas-lepajollec/SwissKnife/compare/v0.1.3...HEAD
[0.1.3]: https://github.com/lucas-lepajollec/SwissKnife/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/lucas-lepajollec/SwissKnife/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/lucas-lepajollec/SwissKnife/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/lucas-lepajollec/SwissKnife/releases/tag/v0.1.0
