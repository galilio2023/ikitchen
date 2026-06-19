import { generatedDesignSchema } from "@/lib/validations";
import { IKitchen } from "@/types";
import { env, hasGeminiAPI, isProd } from "@/lib/env";
import { logger } from "@/lib/logger";

class KitchenAiService {
    private parseResponse(text: string): any {
        try {
            return JSON.parse(text);
        } catch (e) {
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
        if (!hasGeminiAPI) {
            if (isProd) {
                throw new Error("AI Generation is unavailable in production: GEMINI_API_KEY is missing.");
            }
            return generatedDesignSchema.parse(this.getMockLayout(kitchenData));
        }

        const apiKey = env.GEMINI_API_KEY;
        const modelName = "gemini-1.5-flash"; 
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const shape = kitchenData.layoutShape || 'I';
        const role = kitchenData.kitchenRole || 'standard';
        const region = kitchenData.region || 'Egypt';
        const cabinetMaterial = kitchenData.cabinetMaterial || 'Alumetal Standard';
        const countertopMaterial = kitchenData.countertopMaterial || 'Local Granite';

        const prompt = `
            You are a senior professional kitchen interior architect specialized in Egyptian and Gulf (Arabian GCC) residential designs.
            Provide a premium, ergonomically optimized kitchen design summary based on the following requirements:

            INPUT METADATA:
            - Target Region: ${region} (Egyptian/Gulf cultural expectations)
            - Kitchen Type: ${role === 'show' ? 'Show/Dry Kitchen (Open plan, breakfast bar, high aesthetics, integrated coffee/beverage station)' : role === 'wet' ? 'Wet/Dirty Kitchen (Heavy-duty cooking, massive storage, high-performance exhaust placement, laundry space, double sinks)' : 'Standard Family Residential Kitchen'}
            - Layout Configuration: ${shape}-Shape (Straight, L-Shape, U-Shape, Parallel, or Island)
            - Cabinets Materials selected: ${cabinetMaterial}
            - Countertop Slab selected: ${countertopMaterial}

            SPATIAL ENVIRONMENT:
            - Walls: ${JSON.stringify(kitchenData.walls)}

            DESIGN GUIDELINES:
            1. Validate the user's choices. Discuss how the chosen shape, kitchen type (Show vs. Service), and materials fit local Egyptian or Gulf lifestyles.
            2. Explain the "Kitchen Work Triangle" rules: where the Refrigerator, Sink, and Cooker should be placed along their walls.
            3. Draft a natural, highly engaging opening WhatsApp message in Arabic that the user will send to the kitchen showroom rep. The message must summarize their configuration details (size, shape, style, materials) and request a free site survey (رفع مقاسات) and catalog. It must sound like a real Egyptian or Gulf customer wrote it.

            STRICT OUTPUT FORMAT:
            Return ONLY a single valid JSON object. No markdown, no code block wrapping, no preamble.
            Structure:
            {
              "layoutType": "${shape}-Shape ${role === 'show' ? 'Show' : role === 'wet' ? 'Wet' : 'Standard'} Kitchen",
              "aiReasoning": "Provide a beautiful, warm, and highly professional layout design advice in Arabic (5-6 sentences) talking directly to the client (e.g. 'لقد قمنا بتصميم مطبخك المودرن كلاسيك...'). Include design tips and how it fits their space.",
              "units": [],
              "instructions": "The pre-written Arabic WhatsApp message. Start with 'السلام عليكم...' and write a natural message detailing their choice of shape, materials, and requesting a site survey (رفع مقاسات). Do not use placeholders; use the actual values provided (e.g. dimensions, Acrylic, Quartz, etc.)."
            }
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
                        temperature: 0.0,
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
            
            // Restricted fallback: only return mock in development.
            // In production, we throw so the user sees a proper error message (masked by Server Action).
            if (!isProd) {
                return generatedDesignSchema.parse(this.getMockLayout(kitchenData));
            }
            
            if (error.name === 'AbortError') {
                throw new Error("AI generation timed out. Please try again.");
            }
            throw new Error(error.message || "AI failed to generate layout.");
        }
    }
}

export const kitchenAiService = new KitchenAiService();
