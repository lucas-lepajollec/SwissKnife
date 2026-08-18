import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { defineConfig, type Plugin, type ViteDevServer } from 'vitest/config';

const require = createRequire(import.meta.url);

function ffmpegCorePlugin(): Plugin {
  const umdJs = require.resolve('@ffmpeg/core');
  const esmDir = path.join(path.dirname(umdJs), '..', 'esm');
  const files = ['ffmpeg-core.js', 'ffmpeg-core.wasm'] as const;

  const send = (res: import('http').ServerResponse, filePath: string, type: string) => {
    res.setHeader('Content-Type', type);
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    fs.createReadStream(filePath).pipe(res);
  };

  const middleware = (req: { url?: string }, res: import('http').ServerResponse, next: () => void) => {
    const name = path.basename((req.url ?? '').split('?')[0] ?? '');
    if (!files.includes(name as typeof files[number])) {
      next();
      return;
    }
    const filePath = path.join(esmDir, name);
    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      res.end();
      return;
    }
    send(res, filePath, name.endsWith('.wasm') ? 'application/wasm' : 'text/javascript');
  };

  return {
    name: 'ffmpeg-core-static',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0];
        if (pathname === '/favicon.ico' || pathname === '/logo.svg') {
          res.setHeader('Cache-Control', 'no-store');
        }
        next();
      });
      server.middlewares.use('/ffmpeg', middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/ffmpeg', middleware);
    },
    closeBundle() {
      const outDir = path.resolve('dist/ffmpeg');
      fs.mkdirSync(outDir, { recursive: true });
      for (const file of files) {
        fs.copyFileSync(path.join(esmDir, file), path.join(outDir, file));
      }
    },
  };
}

function demoModePlugin(): Plugin {
  const isDemo = process.env.VITE_DEMO === 'true' || process.env.VERCEL === '1';
  return {
    name: 'swissknife-demo-mode',
    config() {
      return {
        define: {
          'import.meta.env.VITE_DEMO': JSON.stringify(isDemo ? 'true' : ''),
        },
      };
    },
    transformIndexHtml(html) {
      if (!isDemo) return html;
      return html
        .replace(
          '<meta name="theme-color"',
          '<meta name="robots" content="noindex, nofollow" />\n  <meta name="theme-color"',
        )
        .replace(
          '<title>SwissKnife — convertisseur local</title>',
          '<title>SwissKnife — démo publique</title>',
        );
    },
    closeBundle() {
      if (!isDemo) return;
      fs.writeFileSync(
        path.resolve('dist/robots.txt'),
        'User-agent: *\nDisallow: /\n',
      );
    },
  };
}

const isolationHeaders = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
};

export default defineConfig({
  plugins: [react(), tailwindcss(), ffmpegCorePlugin(), demoModePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 2499,
    headers: isolationHeaders,
  },
  preview: {
    port: 2499,
    headers: isolationHeaders,
  },
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util', '@ffmpeg/core'],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
