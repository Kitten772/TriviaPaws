/**
 * Script to fix the routes.ts file to properly use our 50,000 question database
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the routes file
const routesPath = path.join(__dirname, '..', 'server', 'routes.ts');

// Read the current file
const fileContent = fs.readFileSync(routesPath, 'utf8');

// Replace all instances of questionCount with totalQuestions
const updatedContent = fileContent.replace(/questionCount/g, 'totalQuestions');

// Write the updated content back to the file
fs.writeFileSync(routesPath, updatedContent);

console.log('Fixed all questionCount references in routes.ts to use totalQuestions');