// @ts-check
/**
 * LambdaTest Playwright Configuration
 * Runs tests on LambdaTest cloud infrastructure with parallel execution
 * 
 * Setup Instructions:
 * 1. Sign up for a free account at https://www.lambdatest.com
 * 2. Get your Username and Access Key from LambdaTest Dashboard
 * 3. Set environment variables:
 *    - LT_USERNAME: Your LambdaTest username
 *    - LT_ACCESS_KEY: Your LambdaTest access key
 * 
 * Run tests with: npm run test:lambdatest
 */
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

// LambdaTest capabilities configuration
// Note: user/accessKey are in the WebSocket URL, not in capabilities
const capabilities = {
  'browserName': 'Chrome',
  'browserVersion': 'latest',
  'LT:Options': {
    'platform': 'Windows 10',
    'build': 'Amazon Shopping Cart Tests',
    'name': 'Playwright Parallel Execution',
    'network': true,
    // Disable server-side video to avoid ffmpeg dependency on remote hosts
    'video': false,
    'console': true,
    'tunnel': false,
    'geoLocation': 'IN',
    'terminal': true,
    'idleTimeout': 300
  }
};

// LambdaTest WebSocket endpoint with credentials
const wsEndpoint = `wss://${process.env.LT_USERNAME}:${process.env.LT_ACCESS_KEY}@cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;

module.exports = defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on failure
  retries: 1,

  // Number of parallel workers for running both tests simultaneously
  workers: 2,

  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Global timeout
  timeout: 300000,

  // Shared settings
  use: {
    baseURL: 'https://www.amazon.in',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
      // Disable local video capture to prevent Playwright from requiring ffmpeg
      video: 'off',
    actionTimeout: 60000,
    navigationTimeout: 120000,
  },

  // Configure LambdaTest project
  projects: [
    {
      name: 'LambdaTest Chrome',
      use: {
        connectOptions: {
          wsEndpoint: wsEndpoint,
          timeout: 120000,
        },
      },
    },
  ],
});
