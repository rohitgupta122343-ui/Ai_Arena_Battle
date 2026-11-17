import { ChatGroq } from "@langchain/groq";
import config from "../config/config.js";

export const geminiModel1 = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: config.GROQ_API_KEY
});

export const geminiModel2 = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: config.GROQ_API_KEY
});

export const cohereModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: config.GROQ_API_KEY
});