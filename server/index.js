require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { FT_UID, FT_SECRET, PORT = 3000, ALLOWED_ORIGIN = 'http://localhost:8100' } = process.env;

if (!FT_UID || !FT_SECRET) {
  console.error('Missing FT_UID or FT_SECRET in server/.env');
  process.exit(1);
}

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));

// Cached in memory so we don't hit 42's token endpoint on every app request.
let cachedToken = null;
let expiresAt = 0;

async function fetchToken() {
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: FT_UID,
    client_secret: FT_SECRET,
  });

  const res = await fetch('https://api.intra.42.fr/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error(`42 token endpoint responded ${res.status}`);
  }

  return res.json();
}

app.get('/api/token', async (_req, res) => {
  try {
    if (!cachedToken || Date.now() >= expiresAt) {
      const data = await fetchToken();
      cachedToken = data.access_token;
      expiresAt = Date.now() + data.expires_in * 1000;
    }
    res.json({ access_token: cachedToken, expires_in: Math.floor((expiresAt - Date.now()) / 1000) });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: 'Failed to obtain token from 42 API' });
  }
});

app.listen(PORT, () => {
  console.log(`Token proxy listening on http://localhost:${PORT}`);
});
