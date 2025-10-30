#!/usr/bin/env node

/**
 * Skip database bootstrap commands inside Vercel/CI environments where Docker
 * is not available. Locally we still run the original postinstall sequence.
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');

if (process.env.CI || process.env.VERCEL) {
  console.log('Skipping postinstall database setup in CI environment.');
  process.exit(0);
}

const pnpmBin =
  process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const run = (args) => {
  const result = spawnSync(pnpmBin, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(['db:start']);
run(['db:push']);
run(['db:generate']);
