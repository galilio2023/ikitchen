import { generatedDesignSchema } from "@/lib/validations";
import { IKitchen } from "@/types";
import { env, hasGeminiAPI, isProd } from "@/lib/env";
import { logger } from "@/lib/logger";

class KitchenAiService {
    private parseResponse(text: string): any {
        try {
            // First attempt: Direct parse
            return JSON.parse(text);
        } catch (e) {
            // Second attempt: Extract JSON block
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    return JSON.parse(jsonMatch[0]);
                } catch (e2) {
                    logger.error("Failed to parse extracted JSON", { text: jsonMatch[0] });
                    throw new Error("AI returned invalid JSON structure.");
                }
            }
            logger.error("Failed to parse AI response", { text });
            throw new Error("AI response could not be parsed as JSON.");
        }
    }

    private getMockLayout(kitchenData: IKitchen) {
        logger.warn("Using Mock AI Layout - GEMINI_API_KEY is missing or request failed.");
        return {
            layoutType: "L-Shape (Mock)",
            aiReasoning: "This is a mock layout generated because no API key was provided or the request timed out. In production, please ensure GEMINI_API_KEY is set.",
            units: kitchenData.walls.length > 0 ? [
                {
                    id: "mock-1",
                    wallIndex: 0,
                    type: "cabinet",
                    position: { x: 10, y: 0, z: 0, width: 60, height: 90, depth: 60 }
                },
                {
                    id: "mock-2",
                    wallIndex: 0,
                    type: "appliance",
                    position: { x: 80, y: 0, z: 0, width: 60, height: 90, depth: 60 }
                }
            ] : []
        };
    }

    async generateLayout(kitchenData: IKitchen) {
        // Use centralized env check
        if (!hasGeminiAPI) {
            if (isProd) {
                throw new Error("AI Generation is unavailable in production: GEMINI_API_KEY is missing.");
            }
            return generatedDesignSchema.parse(this.getMockLayout(kitchenData));
        }

        const apiKey = env.GEMINI_API_KEY;
        const modelName = "gemini-1.5-flash"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const prompt = `
            You are a professional kitchen designer. Generate a functional layout.
            INPUT DATA:
            - Walls: ${JSON.stringify(kitchenData.walls)}
            - Obstacles: ${JSON.stringify(kitchenData.obstacles)}
            
            STRICT REQUIREMENT:
            Return ONLY a JSON object. No markdown, no preamble.
            Structure:
            {
              "layoutType": "string",
              "aiReasoning": "string",
              "units": [{ "id": "string", "wallIndex": number, "type": "string", "position": { "x": number, "y": number, "z": number, "width": number, "height": number, "depth": number } }]
            }
            Types: "socket", "vent", "window", "door", "appliance", "pipe", "pillar", "radiator", "clearance", "cabinet".
            Coordinates: Relative to wall top-left (0,0). x=horizontal, y=vertical from floor.
        `;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        logger.ai('generation_start', { model: modelName, kitchenId: kitchenData.id });

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.0, // Deterministic
                        topP: 0.95,
                        maxOutputTokens: 2048,
                        response_mime_type: "application/json",
                    }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`AI API Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) throw new Error("AI response was empty.");

            const jsonResponse = this.parseResponse(text);
            const result = generatedDesignSchema.parse(jsonResponse);
            
            logger.ai('generation_success', { model: modelName });
            return result;

        } catch (error: any) {
            clearTimeout(timeoutId);
            logger.ai('generation_failed', { model: modelName, error: error.message });
            
            // Fallback to mock in dev if API fails, but throw in prod
            if (!isProd || error.name === 'AbortError') {
                return generatedDesignSchema.parse(this.getMockLayout(kitchenData));
            }
            throw new Error(error.message || "AI failed to generate layout.");
        }
    }
}

export const kitchenAiService = new KitchenAiService();
