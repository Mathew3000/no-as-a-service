const express = require('express');
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();
app.use(cors());
app.set('trust proxy', true);
const PORT = process.env.PORT || 3000;

// Load reasons from JSON
const reasons = JSON.parse(fs.readFileSync('./reasons.json', 'utf-8'));
const nicks = JSON.parse(fs.readFileSync('./nicks.json', 'utf-8'));

// Helper
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Rate limiter: 120 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  keyGenerator: (req, res) => {
    return req.headers['cf-connecting-ip'] || req.ip;
  },
  message: { error: "Too many requests, please try again later. (120 reqs/min/IP)" }
});

app.use(limiter);

// Original endpoint
app.get('/no', (req, res) => {
  res.json({ reason: randomFrom(reasons) });
});

// New endpoint
app.get('/nick', (req, res) => {
  res.json({ reason: randomFrom(nicks) });
});

// Start server
app.listen(PORT, () => {
  console.log(`No-as-a-Service is running on port ${PORT}`);
});
