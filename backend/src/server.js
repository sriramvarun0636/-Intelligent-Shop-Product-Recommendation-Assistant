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

// CORS Configuration - allow requests from your frontend
const corsOptions = {
  origin: 'http://localhost:3000', // frontend URL
  methods: ['GET', 'POST', 'OPTIONS'],
  // credentials: true, // enable if you use cookies/auth headers
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

// Optional: basic error logging middleware (to catch unhandled errors)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
