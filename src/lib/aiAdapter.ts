import { setTimeout } from 'timers/promises';

/**
 * Calls a text-generating AI model with the provided prompts
 * @param systemPrompt - System instruction for the AI
 * @param userPrompt - User query for the AI
 * @param opts - Options for the AI call (model, temperature, max tokens)
 * @returns Raw response from the provider and extracted text
 */
export async function callModelText(
  systemPrompt: string,
  userPrompt: string,
  opts?: { model?: string; temperature?: number; maxTokens?: number }
): Promise<{ raw: any; text?: string; tokensEstimate?: number }> {
  const model = opts?.model || process.env.GEMINI_MODEL || 'gemini-pro';
  const temperature = opts?.temperature ?? 0.0; // Low temp for more deterministic output
  const maxTokens = opts?.maxTokens ?? 2048;

  // Check if we're in mock mode (when API key is not provided)
  if (!process.env.GEMINI_API_KEY) {
    // Mock response for development/testing
    const mockDesign = {
      units: [
        {
          type: "appliance",
          wallIndex: 0,
          position: {
            x: 100.0,
            y: 0.0,
            width: 60.0,
            height: 85.0,
            depth: 60.0
          }
        }
      ],
      bom: [
        {
          item: "Sample Cabinet",
          qty: 1,
          price: 500.00
        }
      ],
      instructions: "Install according to manufacturer guidelines",
      imagePrompt: "Modern kitchen with sample cabinet"
    };
    
    const mockDesignString = JSON.stringify(mockDesign);
    
    return {
      raw: {
        candidates: [{
          content: {
            parts: [{
              text: mockDesignString
            }]
          },
          usageMetadata: {
            promptTokenCount: 50,
            candidatesTokenCount: 100,
            totalTokenCount: 150
          }
        }]
      },
      text: mockDesignString,
      tokensEstimate: 150
    };
  }

  // TODO: Implement real provider call here
  // Below is a template for how to implement the real call:
  /*
  const url = `${process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta'}`
    `/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I will follow these standards." }]
      },
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: temperature,
      maxOutputTokens: maxTokens,
      responseMimeType: "application/json" // Some providers support structured output
    }
  };

  // Retry logic for transient failures
  let attempts = 0;
  const maxAttempts = 2;
  let lastError;

  while (attempts <= maxAttempts) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return {
        raw: data,
        text: text,
        tokensEstimate: data.usageMetadata?.totalTokenCount
      };
    } catch (error) {
      lastError = error;
      attempts++;
      if (attempts > maxAttempts) {
        break;
      }
      // Exponential backoff: wait 1s, then 2s
      await setTimeout(Math.pow(2, attempts) * 500);
    }
  }

  throw lastError;
  */
  
  // For now, return mock response
  return {
    raw: {},
    text: '{}',
    tokensEstimate: 0
  };
}

/**
 * Calls an image-generating AI model with the provided prompt
 * @param imagePrompt - Text prompt for image generation
 * @param opts - Options for the image call (width, height)
 * @returns Image data and provider response
 */
export async function callImageModel(
  imagePrompt: string,
  opts?: { width?: number; height?: number }
): Promise<{ imageData?: string | Buffer; providerResponse?: any }> {
  const width = opts?.width || 1024;
  const height = opts?.height || 768;

  // Check if we're in mock mode
  if (!process.env.GEMINI_API_KEY) {
    // Mock response for development/testing
    return {
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
      providerResponse: {
        mock: true,
        prompt: imagePrompt,
        dimensions: { width, height }
      }
    };
  }

  // TODO: Implement real image provider call here
  // Below is a template for how to implement the real call:
  /*
  const url = `${process.env.IMAGE_API_URL || 'https://generativelanguage.googleapis.com/v1beta'}/models/image-generation-001:generateImage?key=${process.env.GEMINI_API_KEY}`;
  
  const requestBody = {
    prompt: {
      text: imagePrompt
    },
    // Add other parameters as needed
    imageSize: {
      height: height,
      width: width
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Image API call failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    imageData: data.candidates?.[0]?.image?.bytes, // Format depends on provider
    providerResponse: data
  };
  */
  
  // For now, return mock response
  return {
    imageData: undefined,
    providerResponse: {}
  };
}
