<div align="center">
  <img src="public/mark.png" alt="SwissKnife mark" width="112" height="112" />
  <h1>SwissKnife</h1>
  <p><strong>Local-first image, audio, and video conversion—directly in your browser.</strong></p>
  <p>Your files stay in the tab. No account. No conversion server.</p>

  <p>
    <a href="https://swissknife.lucas-homelab.fr"><strong>Website</strong></a> ·
    <a href="https://demo.swissknife.lucas-homelab.fr"><strong>Live demo</strong></a> ·
    <a href="https://docs.swissknife.lucas-homelab.fr"><strong>Documentation</strong></a>
  </p>

  <p>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-5b8def" alt="MIT license" /></a>
    <img src="https://img.shields.io/badge/processing-local-111827" alt="Local processing" />
    <img src="https://img.shields.io/badge/FFmpeg-WebAssembly-111827" alt="FFmpeg WebAssembly" />
  </p>

  <img src="docs/assets/screenshots/swissknife-demo.png" alt="SwissKnife local media conversion interface" width="1200" />
</div>

SwissKnife converts common media formats without sending source files to a third-party conversion service. Images use browser-native Canvas APIs; audio and video use a single-threaded FFmpeg WebAssembly engine served with the application.

That boundary is the product: media is represented by browser `File` and `blob:` objects, conversion happens in the current tab, and the result is downloaded by the user.

## What it does

- Converts multiple images concurrently with the Canvas API.
- Queues audio and video conversions through one FFmpeg WASM worker.
- Serves the FFmpeg core from the same application origin instead of a public CDN.
- Loads FFmpeg only when an audio or video file requires it.
- Rejects unsupported document and arbitrary file types before they enter the queue.
- Shows a practical memory warning above 50 MB rather than pretending browser memory is unlimited.
- Runs as a static application or an unprivileged Nginx container.

## Supported formats

| Category | Recognized input | Output |
| --- | --- | --- |
| Video | MP4, MKV, WEBM, AVI, MOV, GIF | MP4, MKV, WEBM, AVI, MOV, GIF |
| Audio | MP3, WAV, AAC, OGG, FLAC, M4A | MP3, WAV, AAC, OGG, FLAC |
| Image | JPG, PNG, WEBP; BMP/TIFF when the browser can decode them | JPG, PNG, WEBP |

GIF is handled by FFmpeg as video. BMP and TIFF support depends on browser decoding and they are not offered as output formats because Canvas cannot encode them reliably.

The codecs actually available are those compiled into `@ffmpeg/core@0.12.6`. A listed container can still fail when its internal codec or media structure is unsupported. See [NOTICE.md](NOTICE.md) for FFmpeg and x264 licensing information.

## Quick start

### Requirements

- Node.js 20 or newer.
- A modern browser with WebAssembly support.

```bash
git clone https://github.com/lucas-lepajollec/SwissKnife.git
cd SwissKnife
npm ci
npm run dev
```

Open `http://127.0.0.1:2499`. Local development binds only to localhost by default; use `npm run dev:lan` deliberately when testing from another device on a trusted network.

## Docker

The published image listens on port `8080` as a non-root user:

```yaml
services:
  swissknife:
    image: ghcr.io/lucas-lepajollec/swissknife:latest
    container_name: swissknife
    ports:
      - "2501:8080"
    restart: unless-stopped
```

```bash
docker compose up -d
```

Open `http://localhost:2501`. The repository's `docker-compose.yml` uses the published image; build the current checkout with:

```bash
docker compose -f docker-compose.build.yml up -d --build
```

Validated `main` builds publish `latest`; release tags publish matching image tags such as `v1.0.0`.

## Privacy and limitations

- User media stays in the browser tab and is never uploaded by SwissKnife.
- The FFmpeg runtime is downloaded from this application on first audio/video use; image-only conversion does not load it.
- The browser holds both input and output data in memory. Large files can exhaust the tab even when disk space is available.
- Conversion speed and codec support depend on the browser, device memory, and the bundled FFmpeg build.
- Deploying the static app yourself does not introduce a media-processing backend.

The project does not claim that every theoretically valid codec/container combination works. Support is constrained by the browser and the exact FFmpeg WASM build.

## Architecture

| Layer | Technology |
| --- | --- |
| Interface | React 19, TypeScript, Tailwind CSS 4 |
| Image conversion | Canvas API |
| Audio/video conversion | FFmpeg WASM 0.12, same-origin core |
| Build and tests | Vite 6, Vitest, ESLint, TypeScript |
| Production | Docker and unprivileged Nginx |

```text
src/
├── components/              # Interface and queue views
├── hooks/useFFmpeg.ts       # Worker lifecycle
├── lib/
│   ├── formats.ts           # Accepted format contracts
│   ├── imageConverter.ts    # Canvas pipeline
│   └── ffmpegEngine.ts      # FFmpeg queue and commands
├── App.tsx
└── main.tsx
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local-only development on port 2499. |
| `npm run dev:lan` | Expose development to the local network. |
| `npm test` | Run the Vitest suite. |
| `npm run lint` | Run TypeScript and ESLint checks. |
| `npm run build` | Build the app and copy the FFmpeg core into `dist/ffmpeg/`. |
| `npm run build:demo` | Build the isolated Vercel demo with `noindex`. |

## Public demo

The [public demo](https://demo.swissknife.lucas-homelab.fr) is built from the same application. It remains browser-only, displays an explicit demo marker, and applies the headers required by FFmpeg WASM. See [DEMO.md](DEMO.md) for the deployment and validation contract.

## Contributing and license

Contributions are welcome through [CONTRIBUTING.md](CONTRIBUTING.md) and governed by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

SwissKnife's source code is available under the [MIT License](LICENSE). FFmpeg WASM and its compiled components retain their own notices and obligations; see [NOTICE.md](NOTICE.md).
