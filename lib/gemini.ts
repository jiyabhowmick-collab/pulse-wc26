import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let client: GoogleGenAI | null = null;

export function getClient(): GoogleGenAI | null {
  if (!apiKey) return null;
  if (!client) client = new GoogleGenAI({ apiKey });
  return client;
}

export const isAIConfigured = () => Boolean(apiKey);

export const MODEL_NAME = "gemini-2.0-flash";
