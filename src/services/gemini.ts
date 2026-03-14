import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiResponse = async (prompt: string, systemInstruction?: string) => {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction || "You are Banoon x, a highly advanced AI analytical assistant. Your responses must be formal, precise, and structured like an information-analytical system report. Use markdown for structure.",
      tools: [{ googleSearch: {} }],
    },
  });

  return {
    text: response.text || "No response generated.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
  };
};
