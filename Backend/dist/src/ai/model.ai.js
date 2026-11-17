import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";
export const geminiModel1 = new ChatGoogle({
    model: "gemini-3.5-flash-lite",
    apiKey: config.GEMINI_API_KEY
});
export const geminiModel2 = new ChatGoogle({
    model: "gemini-3.5-flash-lite",
    apiKey: config.GEMINI_API_KEY
});
export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY
});
//# sourceMappingURL=model.ai.js.map