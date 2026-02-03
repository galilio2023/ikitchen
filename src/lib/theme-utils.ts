/**
 * Theme utility functions optimized for Tailwind v4 and Next.js
 */

export const THEME_CONSTANTS = {
    RADIUS_DEFAULT: '0.5rem',

    ANIMATION: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
    },

    // Critical for 3D Canvas layering
    Z_INDEX: {
        canvas_base: 0,
        canvas_ui: 10,
        sidebar: 40,
        modal: 1400,
        toast: 1700,
    },
};

/**
 * Checks if the current theme is dark.
 * prioritizes the 'dark' class (from next-themes) over system preference.
 */
export function isDarkTheme(): boolean {
    if (typeof window === 'undefined') return false;

    const isHtmlDark = document.documentElement.classList.contains('dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    return isHtmlDark || (isHtmlDark === false ? false : prefersDark);
}

/**
 * Gets a Tailwind v4 color value.
 * Example: getTailwindColor('zinc-500')
 */
export function getTailwindColor(name: string, fallback: string = '#000000'): string {
    if (typeof window === 'undefined') return fallback;

    // Tailwind v4 uses --color-{name}
    const variableName = `--color-${name}`;
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();

    return value || fallback;
}

/**
 * Bridge for Canvas/Three.js to get the current theme's primary text color
 */
export function getCanvasTextColor(): string {
    return isDarkTheme() ? '#f4f4f5' : '#18181b'; // zinc-100 : zinc-900
}