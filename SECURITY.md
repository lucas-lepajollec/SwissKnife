# Security policy

SwissKnife converts media inside the visitor's browser. Reports that could expose user files, introduce an upload path, weaken the same-origin isolation required by FFmpeg WebAssembly, or compromise the dependency and container supply chain are especially important.

## Supported versions

Until the first deliberate public release, security fixes target `main`. After releases begin, this section will identify the supported release line explicitly.

## Reporting a vulnerability

Use the repository's [private vulnerability reporting form](https://github.com/lucas-lepajollec/SwissKnife/security/advisories/new).

If private reporting is unavailable, open a minimal public issue asking for a private contact channel. Do not include sample media, exploit code, credentials, or other sensitive details in that issue.

Include the affected commit or image tag, clear reproduction steps, the expected impact, and a sanitized proof of concept when possible. You should receive an acknowledgement within seven days and an initial assessment within fourteen days.

## Self-hosted deployments

Keep the security headers shipped in `nginx.conf`, including the COOP and COEP headers required by FFmpeg WebAssembly. Do not configure a proxy that strips them. SwissKnife should not require user media to leave the browser; any behavior that contradicts that promise should be reported privately.
