#!/bin/bash

set e

echo "🔔 Publish release version"

# Make sure to run bunx npm version <major|minor|patch> first

echo "==== Start Update Version ==== "

# Update component versions (since they depend on each other, they should have the same version)
cd packages/engine
bunx npm version patch
bun install
bun run build
bun publish --access public

cd ../timeline
bunx npm version patch
bun install
bun run build
bun publish --access public

echo "==== ✅ Publish release version completed ===="
