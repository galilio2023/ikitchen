/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at runtime
 */

interface EnvConfig {
    MONGODB_URI: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GEMINI_API_KEY?: string; // Optional - app works without it (uses mock data)
    NEXT_PUBLIC_GEMINI_API_KEY?: string;
}

function validateEnv(): EnvConfig {
    const requiredVars = [
        'MONGODB_URI',
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
    ];

    const missing: string[] = [];

    requiredVars.forEach(varName => {
        if (!process.env[varName]) {
            missing.push(varName);
        }
    });

    if (missing.length > 0) {
        const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║  CRITICAL: Missing Required Environment Variables             ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Missing variables: ${missing.join(', ')}
║                                                                ║
║  Please create a .env.local file in the project root with:   ║
║                                                                ║
${missing.map(v => `║  ${v}=your_value_here`).join('\n')}
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
        `;
        
        console.error(errorMessage);
        
        if (process.env.NODE_ENV === 'production') {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
    }

    // Warn about optional but recommended variables
    if (!process.env.GEMINI_API_KEY) {
        console.warn('[ENV] GEMINI_API_KEY not set - AI generation will use mock data');
    }

    return {
        MONGODB_URI: process.env.MONGODB_URI!,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    };
}

// Export validated environment variables
export const env = validateEnv();

// Type-safe environment access
export function getEnv<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
    return env[key];
}

// Check if running in production
export const isProd = process.env.NODE_ENV === 'production';
export const isDev = process.env.NODE_ENV === 'development';

// Utility to check if Gemini AI is available
export const hasGeminiAPI = Boolean(env.GEMINI_API_KEY);
