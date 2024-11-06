/* eslint-disable import/order */
import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { defineConfig, devices } from '@playwright/test';
import * as project from '@project-config';
import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';
import { getAppBaseHrefFromJson } from './src/utils/helpers';

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL =
  process.env['BASE_URL'] ||
  // TODO: extract this to a helper function in separate nx library
  `${project.targets.serve.options.ssl ? 'https' : 'http'}://${project.targets.serve.options.host}:${
    project.targets.serve.options.port || 4200
  }${getAppBaseHrefFromJson()}` ||
  'https://localhost.xxxx.com:4200';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
dotenvConfig({
  path: resolve(workspaceRoot, process.env['ENV_FILE'] || '.env.e2e'),
});

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './src' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  reporter: [
    ['list'],
    [
      'junit',
      {
        outputFile: `${workspaceRoot}/test-results/playwright/apps/xxxx/test-playwright.xml`,
      },
    ],
  ],
  globalTeardown: require.resolve('./playwright.teardown'),
  expect: { timeout: 10000 },
  use: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ignoreHTTPSErrors: true,
  },
  /* Run your local dev server before starting the tests */
  webServer: process.env['DISABLE_PLAYWRIGHT_WEBSERVER']
    ? undefined
    : {
        command: 'npm run start -- --verbose',
        url: baseURL,
        reuseExistingServer: !process.env['CI'],
        cwd: workspaceRoot,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ignoreHTTPSErrors: true,
        timeout: 120000,
        stdout: 'pipe',
        stderr: 'pipe',
      },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});
