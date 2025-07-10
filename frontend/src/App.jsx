import React, { useState } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchedShops, setMatchedShops] = useState([]);
  const [matchedProducts, setMatchedProducts] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setMatchedShops([]);
    setMatchedProducts([]);
    setRecommendation('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      setMatchedShops(data.matchedShops || []);
      setMatchedProducts(data.matchedProducts || []);
      setRecommendation(data.recommendation || '');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100 p-6 flex flex-col items-center font-sans">
      <h1 className="text-5xl font-extrabold text-blue-800 mb-10 drop-shadow-md text-center select-none font-sans">
        🛍️ Intelligent Shop & Product Recommender
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl"
        aria-label="Search for shops and products"
      >
        <input
          type="text"
          placeholder="Type your shopping query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
          required
          autoFocus
          aria-required="true"
          className="flex-grow rounded-xl border-2 border-blue-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-300 px-5 py-3 text-lg transition duration-300 shadow-md outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          aria-disabled={loading}
          className={`relative bg-blue-700 text-white rounded-xl px-8 py-3 font-semibold text-lg shadow-lg transition 
            hover:bg-blue-800 focus:ring-4 focus:ring-blue-400 focus:outline-none disabled:bg-blue-400 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-6 w-6 mr-2 inline-block text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Thinking...
            </>
          ) : (
            'Get Recommendations'
          )}
        </button>
      </form>

      {error && (
        <div
          className="bg-red-100 text-red-700 p-5 rounded-lg shadow-md mt-8 max-w-4xl w-full animate-fadeIn text-center font-semibold"
          role="alert"
          aria-live="assertive"
        >
          ❌ {error}
        </div>
      )}

      {(matchedShops.length > 0 || matchedProducts.length > 0 || recommendation) && (
        <div className="mt-12 max-w-4xl w-full space-y-12">
          {matchedShops.length > 0 && (
            <section className="animate-fadeIn" aria-label="Matched Shops">
              <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b-4 border-blue-500 pb-2">
                🔍 Matched Shops
              </h2>
              <ul className="space-y-5">
                {matchedShops.map((shop) => (
                  <li
                    key={shop.id}
                    tabIndex={0}
                    className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
                    title={shop.address}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-xl text-blue-800">{shop.name}</strong>
                      <span className="text-yellow-500 font-semibold text-lg">⭐ {shop.rating}/5</span>
                    </div>
                    <div className="text-sm italic text-blue-600 mb-1">({shop.category})</div>
                    <div className="text-gray-700">{shop.address}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {matchedProducts.length > 0 && (
            <section className="animate-fadeIn" aria-label="Matched Products">
              <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b-4 border-blue-500 pb-2">
                📦 Matched Products
              </h2>
              <ul className="space-y-5">
                {matchedProducts.map((prod) => (
                  <li
                    key={prod.id}
                    tabIndex={0}
                    className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-300"
                    title={`Benefits: ${prod.benefits.join(', ')}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-xl text-blue-800">{prod.name}</strong>
                      <span className="font-bold text-blue-700 text-lg">₹{prod.price}</span>
                    </div>
                    <div className="text-sm italic text-blue-600 mb-2">[{prod.category}]</div>
                    <div className="text-gray-800 mb-2">Benefits: {prod.benefits.join(', ')}</div>
                    {prod.upsell?.length > 0 && (
                      <div className="mt-2 inline-flex flex-wrap gap-3">
                        <span className="bg-green-200 text-green-800 font-semibold px-4 py-1 rounded-full shadow-sm">
                          ⚡ Upsell: {prod.upsell.join(', ')}
                        </span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recommendation && (
            <section className="animate-fadeIn" aria-label="AI Recommendation">
              <h2 className="text-3xl font-bold mb-6 text-blue-900 border-b-4 border-blue-500 pb-2">
                💡 AI Recommendation
              </h2>
              <pre className="bg-white p-6 rounded-2xl shadow-inner whitespace-pre-wrap text-gray-900 font-mono text-lg leading-relaxed select-text">
                {recommendation}
              </pre>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
