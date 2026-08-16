import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({

  
  testDir: '.',
  testMatch: /validate\.spec\.ts/,
  timeout: 300_000,
  expect: { timeout: 60_000 },
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    headless: false, // <-- Add this line
    trace: 'retain-on-failure',
  },
  
});


