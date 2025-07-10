const express = require('express');
const cors = require('cors');

const {
  extractKeywords,
  findShopsByKeyword,
  findProductsByKeyword,
} = require('./filterEngine');

const { buildPrompt } = require('./promptBuilder');
const { getLLMResponse } = require('./llmClient');

const app = express();
const PORT = process.env.PORT || 6000;

// List allowed origins for CORS (update the deployed frontend URL accordingly)
const allowedOrigins = [
  'http://localhost:3000',                 // Local dev frontend
  'https://intelligent-shop-product-recommendation-tusl.onrender.com' // <-- Replace with your deployed frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Use built-in JSON body parser
app.use(express.json());

// Main recommendation endpoint
app.post('/api/recommend', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({ error: 'Invalid or missing "query" in request body.' });
  }

  try {
    // Extract keywords from query
    const keywords = extractKeywords(query);

    // Find matching shops and products
    const matchedShops = findShopsByKeyword(keywords);
    const matchedProducts = findProductsByKeyword(keywords);

    // Build prompt and get AI recommendation
    const prompt = buildPrompt(query, matchedShops, matchedProducts);
    const recommendation = await getLLMResponse(prompt);

    // Send combined response
    res.json({ matchedShops, matchedProducts, recommendation });
  } catch (error) {
    console.error('Error processing recommendation:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message || err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
