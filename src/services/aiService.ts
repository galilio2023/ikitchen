import { GoogleGenerativeAI } from "@google/generative-ai";
import { generatedDesignSchema } from "@/lib/validations";
import { IKitchen } from "@/types";

class KitchenAiService {
    /**
     * Generates a kitchen layout using Google Gemini.
     * Validates the output against the generatedDesignSchema.
     */
    async generateLayout(kitchenData: IKitchen) {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing from environment variables.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Using 1.5-pro for better spatial reasoning
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `
            You are a professional kitchen designer and spatial architect.
            Based on the following kitchen dimensions and existing obstacles, generate a functional kitchen layout.

            INPUT DATA:
            - Walls: ${JSON.stringify(kitchenData.walls)}
            - Obstacles: ${JSON.stringify(kitchenData.obstacles)}

            STRICT JSON REQUIREMENT:
            Return ONLY a raw JSON object. Do not include conversational text or explanations outside the JSON.
            The structure must strictly match this:
            {
              "layoutType": "string (e.g., L-Shape, U-Shape, Straight)",
              "aiReasoning": "Brief explanation of design choices",
              "units": [
                {
                  "id": "unique-string-id",
                  "wallIndex": number (index of the wall in the array),
                  "type": "cabinet" or "appliance",
                  "position": { 
                    "x": number (distance from left corner of the wall in cm), 
                    "y": number (distance from floor in cm), 
                    "z": number, 
                    "width": number, 
                    "height": number, 
                    "depth": number 
                  }
                }
              ]
            }

            Design Rules:
            1. Units MUST NOT overlap with existing obstacles like windows, doors, or pipes.
            2. 'x' is relative to the start of the wall specified by 'wallIndex'.
            3. Total width of units on a wall must not exceed that wall's length.
        `;

        try {
            const result = await model.generateContent(prompt);

            // TS80007 Fix: result.response is not a promise, so we access it directly
            const text = result.response.text();

            // Strip Markdown JSON blocks and trim whitespace
            const cleanJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

            const jsonResponse = JSON.parse(cleanJsonText);

            // Final validation against our Zod schema
            const validatedDesign = generatedDesignSchema.parse(jsonResponse);

            return validatedDesign;
        } catch (error: any) {
            console.error("AI Service Error:", error);

            if (error.name === "ZodError") {
                console.error("Validation failed for AI output:", JSON.stringify(error.errors, null, 2));
            }

            throw new Error(error.message || "AI failed to generate a valid layout.");
        }
    }
}

export const kitchenAiService = new KitchenAiService();