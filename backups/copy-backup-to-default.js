/**
 * Script to copy the latest backup file to a default name that can be used by the server
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get most recent backup file
const backupFiles = fs.readdirSync(__dirname)
  .filter(file => file.startsWith('trivia-backup-') && file.endsWith('.json'))
  .sort()
  .reverse();

if (backupFiles.length === 0) {
  console.error('No backup files found');
  process.exit(1);
}

const latestBackup = backupFiles[0];
console.log(`Found latest backup: ${latestBackup}`);

// Copy to default name
const sourcePath = path.join(__dirname, latestBackup);
const destPath = path.join(__dirname, 'default-trivia-backup.json');

fs.copyFileSync(sourcePath, destPath);
console.log(`Copied ${latestBackup} to default-trivia-backup.json`);