import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";
export const geminiModel1 = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.GEMINI_API_KEY
});
export const geminiModel2 = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.GEMINI_API_KEY
});
export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY
});
//# sourceMappingURL=model.ai.js.map