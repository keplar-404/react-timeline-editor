#!/bin/bash

set e

echo "🔔 Publish alpha version"

GIT_SHA=$(git rev-parse HEAD | cut -c1-9)

if [[ -n $GIT_SHA ]]; then
  echo "Aim Version: alpha.$GIT_SHA"
else 
  echo "💢 Please check Git SHA"
  exit 
fi

echo "==== Start Update Version ===="
echo "Version: alpha.$GIT_SHA"

BEFORE_VERSION=$(cat packages/timeline/package.json | grep version | cut -d '"' -f 4)

bunx npm version prerelease --preid=alpha.$GIT_SHA

AFTER_VERSION=$(cat packages/timeline/package.json | grep version | cut -d '"' -f 4)

BEFORE_VERSION=$BEFORE_VERSION AFTER_VERSION=$AFTER_VERSION npx zx scripts/release/compare-version.mjs

echo "==== Version Change Completed ===="

bun install
# clean \build
bun run build
bunx npm publish --access public --tag next

echo "==== ✅ Publish alpha version completed, version: $AFTER_VERSION ===="
