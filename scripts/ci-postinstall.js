#!/usr/bin/env node

/**
 * Skip database bootstrap commands inside Vercel/CI environments where Docker
 * is not available. Locally we still run the original postinstall sequence.
 */

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const pnpmBin = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const run = (args) => {
  const result = spawnSync(pnpmBin, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

if (process.env.CI || process.env.VERCEL) {
  console.log('CI environment detected. Running prisma generate only.');
  run(['db:generate']);
  process.exit(0);
}

run(['db:start']);
run(['db:push']);
run(['db:generate']);
