#!/usr/bin/env bash
# Script to build and prepare the application for Render deployment

# Exit on error
set -e

# Install dependencies
npm install

# Create production build
npm run build

# Ensure backups directory exists
mkdir -p backups

# Check if we need to create database tables and load questions
echo "Checking for database setup needs..."

# Run database initialization script
echo "Initializing database with trivia questions..."
node render-db-setup.js

echo "Build completed successfully!"