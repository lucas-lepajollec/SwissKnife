import { spawnSync } from 'node:child_process';

const result = spawnSync('npx', ['vite', 'build'], {
  stdio: 'inherit',
  env: { ...process.env, VITE_DEMO: 'true' },
  shell: true,
});

process.exit(result.status ?? 1);
