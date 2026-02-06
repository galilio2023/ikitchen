// src/lib/aiAdapter.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeneratedDesign, generatedDesignSchema } from "./validations";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function callTextModel(
  prompt: string,
  options: { json?: boolean } = {},
): Promise<GeneratedDesign> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (options.json) {
    const cleanJsonText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const jsonResponse = JSON.parse(cleanJsonText);
    return generatedDesignSchema.parse(jsonResponse);
  }
  
  // CORRECTED: Added the missing 'bom' property
  return { layoutType: "text", aiReasoning: text, units: [], bom: [] };
}

// ... (callImageModel remains the same)
