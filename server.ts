// server.ts
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Health check endpoint (Cloud Run pings this)
app.get('/healthz', (req, res) => {
  res.status(200).send('OK - FlightSnapp Backend Ready');
});

// Serve static files
app.use(express.static(__dirname + '/dist'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

// Listen immediately
app.listen(PORT, '0.0.0.0', () => {  // Bind to all interfaces
  console.log(`FlightSnapp LIVE on port ${PORT}`);
});