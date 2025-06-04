#!/bin/bash

set -e

echo "🌱 Building Garden Calm project in correct order..."

# Clean all packages first
echo "🧹 Cleaning previous builds..."
pnpm -r clean

# Build in correct order
echo "🔨 Building @garden-calm/types..."
cd packages/types
pnpm build
cd ../..

echo "🔨 Building @garden-calm/core..."
cd packages/core
pnpm build
cd ../..

echo "🔨 Building @garden-calm/storage..."
cd packages/storage
pnpm build
cd ../..

echo "🔨 Building @garden-calm/api..."
cd apps/api
pnpm build
cd ../..

echo "✅ All packages built successfully!"
