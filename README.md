<div align="center">

# 🔧 SwissKnife

**A universal file converter that runs entirely in your browser.**

Convert video, audio, and image files instantly — no upload, no server, no limits.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![FFmpeg WASM](https://img.shields.io/badge/FFmpeg-WASM-007808?logo=ffmpeg&logoColor=white)](https://ffmpegwasm.netlify.app)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## ✨ Features

- **🔒 100% Private** — All conversions happen locally in your browser via WebAssembly. No file ever leaves your device.
- **🎬 Video Conversion** — MP4, MKV, WEBM, AVI, MOV, GIF
- **🎵 Audio Conversion** — MP3, WAV, AAC, OGG, FLAC
- **🖼️ Image Conversion** — JPG, PNG, WEBP, TIFF, BMP
- **📦 Batch Processing** — Drag & drop multiple files, convert them all at once
- **🎨 Modern UI** — Bento Grid layout with smooth animations (Motion), dark theme, fully responsive
- **🛠️ Debug Console** — Built-in FFmpeg log viewer for troubleshooting
- **🚀 Instant Start** — FFmpeg engine is lazy-loaded only when needed

---

## 🖥️ Supported Formats

| Category | Input / Output Formats |
|----------|----------------------|
| **Video** | `MP4` · `MKV` · `WEBM` · `AVI` · `MOV` · `GIF` |
| **Audio** | `MP3` · `WAV` · `AAC` · `OGG` · `FLAC` |
| **Image** | `JPG` · `PNG` · `WEBP` · `TIFF` · `BMP` |

> Images are converted using the native **Canvas API** for maximum speed.  
> Video and audio files are processed through **FFmpeg WASM** (single-threaded, compatible with all devices).

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+)

### Local Development

```bash
# Clone the repository
git clone https://github.com/lucas-lepajollec/SwissKnife.git
cd SwissKnife

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:2499**.

---

## 🐳 Docker Deployment

SwissKnife ships with a multi-stage Dockerfile (Node build → Nginx serve).

```bash
# Build and run with Docker Compose
docker compose up -d
```

The app will be available at **http://localhost:2501**.

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build (Node 20 → Nginx Alpine) |
| `docker-compose.yml` | One-command deployment on port `2501` |
| `nginx.conf` | Production-ready Nginx configuration |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 + TypeScript |
| **Bundler** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Conversion Engine** | FFmpeg WASM 0.12 + Canvas API |
| **Icons** | Lucide React |
| **Deployment** | Docker + Nginx |

---

## 📂 Project Structure

```
SwissKnife/
├── src/
│   ├── components/       # UI components
│   │   ├── Header.tsx        # Top navigation bar
│   │   ├── Dropzone.tsx      # Drag & drop file input
│   │   ├── FileQueue.tsx     # Conversion queue & controls
│   │   ├── PrivacyCard.tsx   # Privacy information card
│   │   └── DebugConsole.tsx  # FFmpeg log viewer
│   ├── hooks/
│   │   └── useFFmpeg.ts      # FFmpeg WASM lifecycle & conversion logic
│   ├── lib/
│   │   ├── formats.ts        # Format detection, mapping & FFmpeg args
│   │   ├── imageConverter.ts # Canvas-based image conversion
│   │   └── utils.ts          # Shared utilities
│   ├── App.tsx               # Root application component
│   └── main.tsx              # Entry point
├── Dockerfile                # Multi-stage production build
├── docker-compose.yml        # Docker Compose config
├── nginx.conf                # Nginx serving config
└── package.json
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 2499) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run clean` | Remove `dist/` folder |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

Made with ❤️ using React, FFmpeg WASM & Vite

</div>
