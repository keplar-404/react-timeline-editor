#!/bin/bash

set e

echo "🔔 Publish release version"

# Make sure to run bunx npm version <major|minor|patch> first

echo "==== Start Update Version ===="

BEFORE_VERSION=$(cat packages/timeline/package.json | grep version | cut -d '"' -f 4)

bunx --bun npm version apply

AFTER_VERSION=$(cat packages/timeline/package.json | grep version | cut -d '"' -f 4)

echo "==== Version Change Completed, before: $BEFORE_VERSION, after: $AFTER_VERSION ===="

bun install
# clean \build
bun run build
bun publish --access public

echo "==== ✅ Publish release version completed, version: $AFTER_VERSION ===="
