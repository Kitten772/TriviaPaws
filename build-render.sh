#!/bin/bash

# Install dependencies
npm install

# Run the standard build
npm run build

# Copy our production server file
cp server/index-prod.ts dist/
cd dist
node --loader ts-node/esm index-prod.ts