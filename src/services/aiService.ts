import { generatedDesignSchema } from "@/lib/validations";
import { IKitchen } from "@/types";

// This service now uses a direct `fetch` call to the Google AI REST API,
// bypassing the SDK which was causing persistent, unresolvable errors.
class KitchenAiService {
    async generateLayout(kitchenData: IKitchen) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing from environment variables.");
        }

        // Using the 'gemini-pro' model which is standard for text-based tasks.
        const modelName = "gemini-pro";
        // FINAL, DEFINITIVE CORRECTION: Using the stable 'v1' API endpoint instead of the deprecated 'v1beta'.
        const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

        const prompt = `
            You are a professional kitchen designer. Based on the following kitchen data, generate a functional layout.
            INPUT DATA:
            - Walls: ${JSON.stringify(kitchenData.walls)}
            - Obstacles: ${JSON.stringify(kitchenData.obstacles)}
            STRICT JSON REQUIREMENT:
            Return ONLY a raw JSON object matching this structure:
            {
              "layoutType": "string",
              "aiReasoning": "string",
              "units": [{ "id": "string", "wallIndex": number, "type": "string", "position": { "x": number, "y": number, "z": number, "width": number, "height": number, "depth": number } }]
            }
            Ensure that 'type' in 'units' is one of: "socket", "vent", "window", "door", "appliance", "pipe", "pillar", "radiator", "clearance", "cabinet".
            Ensure that the generated layout is physically possible and does not overlap with obstacles.
            The 'position' coordinates must be relative to the wall's top-left corner (0,0).
            'x' is the horizontal distance along the wall. 'y' is the vertical distance from the floor.
        `;

        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                response_mime_type: "application/json",
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Google AI API Error Response:", errorText);
                throw new Error(`Google AI API call failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error("AI response was empty or malformed.");
            }

            const jsonResponse = JSON.parse(text);
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
