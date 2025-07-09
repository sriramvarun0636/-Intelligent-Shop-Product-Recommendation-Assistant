// utils.js

const fs = require("fs");

const shops = JSON.parse(fs.readFileSync("./data/shops.json", "utf-8"));
const products = JSON.parse(fs.readFileSync("./data/products.json", "utf-8"));

function extractKeywords(query) {
  const stopwords = ["find", "good", "near", "place", "shop", "store", "in", "the", "a", "to", "of", "for", "me"];
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(w => w.length > 2 && !stopwords.includes(w));
}

function findShopsByKeyword(keywords) {
  return shops.filter(shop =>
    keywords.some(kw =>
      shop.name.toLowerCase().includes(kw) ||
      shop.address.toLowerCase().includes(kw) ||
      shop.category.toLowerCase().includes(kw)
    )
  );
}

function findProductsByKeyword(keywords) {
  return products.filter(p =>
    keywords.some(kw =>
      p.name.toLowerCase().includes(kw) ||
      p.category.toLowerCase().includes(kw) ||
      (p.benefits || []).some(b => b.toLowerCase().includes(kw))
    )
  );
}

function getUpsells(product) {
  return product.upsell || [];
}

module.exports = {
  extractKeywords,
  findShopsByKeyword,
  findProductsByKeyword,
  getUpsells,
  shops,
  products
};
