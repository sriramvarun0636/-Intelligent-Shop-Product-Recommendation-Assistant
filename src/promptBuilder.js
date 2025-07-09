export function buildPrompt(userQuery, relevantShops, relevantProducts) {
  const shopText = relevantShops.map(s =>
    `- ${s.name} (${s.category}) at ${s.address}, rated ${s.rating}/5`
  ).join("\n");

  const productText = relevantProducts.map(p => {
    return `- ${p.name} [${p.category}] – ₹${p.price}\n  Benefits: ${p.benefits.join(", ")}\n  Upsell: ${p.upsell.join(", ")}`;
  }).join("\n");

  return `
You are a smart shopping assistant.
User asked: "${userQuery}"

Nearby Relevant Shops:
${shopText || "No relevant shops found."}

Matching Products:
${productText || "No matching products found."}

IMPORTANT:
- ONLY use the shops and products listed above.
- Do NOT invent new shop names or products.
- Recommend from the provided list only.

Now:
1. Recommend best matching shops.
2. Suggest top product(s).
3. Recommend a smart upsell combo if applicable.
Respond in a helpful, human tone.
`;
}
