/**
 * Extracts the first JSON object from a text string.
 * Handles nested objects and arrays by counting braces.
 * @param text The input text containing JSON
 * @returns The first JSON object as a string
 * @throws Error if no valid JSON is found or if braces are unbalanced
 */
export function extractFirstJson(text: string): string {
  // Find the first opening brace
  const startIndex = text.indexOf('{');
  if (startIndex === -1) {
    throw new Error('NO_JSON_FOUND: No opening brace "{" found in the text');
  }

  let braceCount = 0;
  let i = startIndex;
  
  // Track if we're inside a string to avoid counting braces inside strings
  let inString = false;
  let escapeNext = false;

  for (; i < text.length; i++) {
    const char = text[i];

    // Handle escape sequences in strings
    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    // Toggle string state when encountering unescaped quotes
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    // Only count braces if we're not inside a string
    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        // When brace count reaches zero, we've found the matching closing brace
        if (braceCount === 0) {
          break;
        }
      }
    }
  }

  // If we reached the end without balancing braces, throw an error
  if (braceCount !== 0) {
    throw new Error('UNBALANCED_JSON: Braces are not balanced in the text');
  }

  // Extract the JSON substring
  const jsonString = text.substring(startIndex, i + 1);
  
  // Verify it's valid JSON by attempting to parse it
  try {
    JSON.parse(jsonString);
  } catch (e) {
    throw new Error(`INVALID_JSON: Extracted text is not valid JSON - ${(e as Error).message}`);
  }

  return jsonString;
}