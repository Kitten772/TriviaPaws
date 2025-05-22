/**
 * Production server file for Render deployment
 */
import express from 'express';
import path from 'path';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client')));

// Register API routes
registerRoutes(app).then(server => {
  // For any request that doesn't match our API routes, send the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });

  server.listen(PORT, () => {
    console.log(`Production server running on port ${PORT}`);
  });
});