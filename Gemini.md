# Gemini AI Integration Guide

This document details the integration of Google's Gemini AI into the Kitchen SaaS application. It covers setup, usage patterns, and troubleshooting.

## 1. Overview

**Purpose:** Provide AI-powered kitchen layout generation and visualization.
**Model:** `gemini-pro` (via Google Generative AI REST API).
**Key Features:**
*   **Layout Generation:** Suggests optimal placement of appliances based on kitchen dimensions and constraints.
*   **Visualization:** Generates photorealistic images of the proposed design.

## 2. Configuration

### Environment Variables
Ensure the following are set in your `.env.local` file:
```env
GEMINI_API_KEY=your_api_key_here
```

### Service Implementation
The core logic resides in `src/services/aiService.ts`.
*   **Method:** `generateLayout(kitchenData: IKitchen)`
*   **Endpoint:** `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`
*   **Authentication:** API Key passed as a query parameter.

## 3. Usage Patterns

### A. Layout Generation Flow
1.  **Trigger:** User clicks "Generate Layout" in `AiDesignPanel`.
2.  **Action:** `generateAiLayout` (Server Action) is called with `kitchenId`.
3.  **Service:** `kitchenAiService.generateLayout` constructs a prompt with kitchen data (walls, obstacles).
4.  **AI Response:** Returns a JSON object matching `generatedDesignSchema`.
5.  **Validation:** Zod schema validates the response structure.
6.  **State Update:** The design is saved to `kitchen.generatedDesign` in MongoDB.
7.  **UI Update:** The frontend displays the suggestion for user review.

### B. Applying a Design
1.  **Trigger:** User clicks "Apply Layout".
2.  **Action:** `applyAiLayout` (Server Action) is called with the design object.
3.  **Transformation:** The design's `units` are converted into `IAppliance` objects.
4.  **Persistence:** The new appliances replace the old ones in the database.
5.  **Feedback:** Success toast notification.

### C. Image Visualization
1.  **Trigger:** User clicks "Visualize Kitchen" in `VisualizationPanel`.
2.  **Action:** `generateAiImage` (Server Action) is called with a descriptive prompt.
3.  **Service:** Currently returns a placeholder. *Future: Integrate with an image generation model (e.g., Gemini Pro Vision or DALL-E).*

## 4. Prompt Engineering

### Layout Prompt Template
```text
You are a professional kitchen designer. Based on the following kitchen data, generate a functional layout.
INPUT DATA:
- Walls: ${JSON.stringify(kitchenData.walls)}
- Obstacles: ${JSON.stringify(kitchenData.obstacles)}
STRICT JSON REQUIREMENT:
Return ONLY a raw JSON object matching this structure:
{
  "layoutType": "string",
  "aiReasoning": "string",
  "units": [{ "id": "string", "wallIndex": number, "type": "string", "position": { ... } }]
}
```

### Best Practices
*   **Context:** Explicitly state the role ("professional kitchen designer").
*   **Constraints:** Clearly define input data (walls, obstacles).
*   **Output Format:** Enforce strict JSON structure to ensure parseability.

## 5. Troubleshooting

### Common Errors
*   **"AI response was empty or malformed":** The model failed to generate valid JSON. Check the prompt structure or retry.
*   **"Validation failed for AI output":** The JSON structure did not match the Zod schema. Review `generatedDesignSchema` in `src/lib/validations.ts`.
*   **API Key Errors:** Ensure `GEMINI_API_KEY` is valid and has quota.

### Debugging
*   Check server logs for "Server Action Error" or "AI Service Error".
*   Inspect the raw AI response in the console if validation fails.

---
*Update this document as the AI integration evolves.*
