const readline = require("readline-sync");
const { extractKeywords, findShopsByKeyword, findProductsByKeyword } = require("./filterEngine");
const { buildPrompt } = require("./promptBuilder");
const { getLLMResponse } = require("./llmClient");

async function main() {
  console.log("🛍️ Welcome to the Intelligent Shop & Product Recommender!");
  const userQuery = readline.question("Type your shopping query:\n> ");

  // Extract keywords array from user query string
  const keywords = extractKeywords(userQuery);

  const relevantShops = findShopsByKeyword(keywords);
  const relevantProducts = findProductsByKeyword(keywords);

  // Debug print for dev — see what matched:
  console.log(`\n🔍 Matched Shops (${relevantShops.length}):`);
  relevantShops.forEach(s => console.log(`- ${s.name} (${s.category})`));
  console.log(`\n🔍 Matched Products (${relevantProducts.length}):`);
  relevantProducts.forEach(p => console.log(`- ${p.name} (${p.category}) ₹${p.price}`));

  const prompt = buildPrompt(userQuery, relevantShops, relevantProducts);
  console.log("\n🧠 Thinking...");

  const reply = await getLLMResponse(prompt);
  console.log("\n💡 Recommendation:\n");
  console.log(reply);
}

main();
