require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Middleware to parse form data

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// In-memory storage for shortened URLs
const urlDatabase = {};

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// POST route to shorten the URL
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Simple URL validation (you can enhance this)
  const urlPattern = /^(http|https):\/\/[^\s$.?#].[^\s]*$/gm;
  if (!urlPattern.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate a random short URL (use a database in real-world apps)
  const shortUrl = Math.floor(Math.random() * 1000);

  // Store the mapping between the short URL and the original URL
  urlDatabase[shortUrl] = url;

  // Respond with the original and short URL
  res.json({ original_url: url, short_url: shortUrl });
});

// GET route to handle redirection for short URLs
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  // Look up the original URL using the short URL
  const originalUrl = urlDatabase[shortUrl];

  // If the short URL is not found, respond with an error
  if (!originalUrl) {
    return res.json({ error: 'No short URL found for the given input' });
  }

  // Redirect to the original URL
  res.redirect(originalUrl);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
