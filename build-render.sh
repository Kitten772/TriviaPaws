#!/usr/bin/env bash
# Build script for Render deployment

# Exit on error
set -e

# Install dependencies
npm install

# Build the client
npm run build

# Log build complete
echo "Build completed successfully!"

# Log file structure for debugging
echo "Checking dist directory structure:"
find dist -type f | sort