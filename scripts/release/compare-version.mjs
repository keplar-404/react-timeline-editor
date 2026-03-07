import semver from 'semver';

const { BEFORE_VERSION, AFTER_VERSION } = process.env;

async function main() {
  const beforeSemver = semver.coerce(BEFORE_VERSION);
  const afterSemver = semver.coerce(AFTER_VERSION);
  const result = afterSemver.compare(beforeSemver);
  if (result === -1) {
    console.error(`💢 Please check the stableVersion and the bun version strategy, the version was downgraded. BEFORE_VERSION=${BEFORE_VERSION}, AFTER_VERSION=${AFTER_VERSION}`);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();