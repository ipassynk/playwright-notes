import { execSync } from 'child_process';
import { resolve } from 'path';

async function teardown() {
  try {
    const nycPath = resolve(`${__dirname}/../../node_modules/.bin/nyc`);
    const nycRcPath = resolve(`${__dirname}/../../.nycrc.e2e.json`);
    const coverageDir = resolve(`${__dirname}/../../coverage/playwright/apps/xxxx/`);

    return execSync(`${nycPath} --nycrc-path=${nycRcPath} --report-dir=${coverageDir} report`, {
      encoding: 'utf8',
      stdio: 'inherit',
      stderr: 'inherit',
    });
  } catch (_e) {
    process.exit(-1);
  }
}

export default teardown;
