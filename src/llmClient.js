import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in .env file");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getLLMResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-pro' }); // <-- key fix
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("🚨 Error from Gemini API:", error.message);
    return "⚠️ Failed to fetch response from Gemini.";
  }
}
