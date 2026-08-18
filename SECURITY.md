# Security Policy

## Supported versions

The `main` branch and the Git tag `v1.0.0` are the versions covered by this policy.

## Reporting a vulnerability

Email **lucaslepajollecweb@gmail.com** with enough detail to reproduce the issue.

Do not open a public GitHub issue for a vulnerability that could expose user files or weaken the “no upload” guarantee.

## What this app does not do

SwissKnife is a static frontend. It does not receive user media on a server. Conversions run in the visitor’s browser.

The FFmpeg WebAssembly core is served **from the same origin** as the app (`/ffmpeg/`). User files stay in memory (`File` / `blob:`) and are downloaded locally.

## Self-hosted instances

Keep the Nginx security headers shipped in `nginx.conf` (COOP/COEP for WASM, CSP, frame denial). Do not proxy the app in a way that strips those headers if you still need FFmpeg WASM.
