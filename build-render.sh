#!/bin/bash

# Update browserslist database
echo "Updating browserslist database..."
npx update-browserslist-db@latest

# Continue with normal build process
echo "Building application..."
npm run build