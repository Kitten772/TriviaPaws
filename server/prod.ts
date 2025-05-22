/**
 * Production server file for Render deployment
 */
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../public')));

// Register API routes
import { registerRoutes } from './routes';

// Start the server
const server = createServer(app);
registerRoutes(app).then(httpServer => {
  // For any other request, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  // Listen on the specified port
  httpServer.listen(PORT, () => {
    console.log(`Purrfect Trivia production server running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});