import type { Cookies } from '@sveltejs/kit';
import type { Cookie, ChunkedCookies } from './types';

const MAX_COOKIE_SIZE = 2048; // bytes

export class ChunkedCookieManager {
    /**
     * Creates chunked cookies if the value is too large, otherwise returns a single cookie
     */
    public static createCookies(name: string, value: string, options: Cookie['options']): Cookie | ChunkedCookies {
        if (value.length <= MAX_COOKIE_SIZE) {
            return { name, value, options };
        }

        const chunks: string[] = [];
        for (let i = 0; i < value.length; i += MAX_COOKIE_SIZE) {
            chunks.push(value.slice(i, i + MAX_COOKIE_SIZE));
        }

        const cookies: Cookie[] = chunks.map((chunk, index) => ({
            name: `${name}.${index}`,
            value: chunk,
            options
        }));

        return {
            cookies,
            totalChunks: chunks.length
        };
    }

    /**
     * Gets all cookie chunks and combines them
     */
    public static getCombinedValue(cookies: Cookies, baseName: string): string | null {
        // Try to get the main cookie first
        const mainValue = cookies.get(baseName);
        if (mainValue) {
            return mainValue;
        }

        // If main cookie doesn't exist, try to find chunked cookies
        const chunks: string[] = [];
        let index = 0;
        let chunk: string | undefined;
        
        // Collect all chunks
        while ((chunk = cookies.get(`${baseName}.${index}`))) {
            chunks.push(chunk);
            index++;
        }

        if (chunks.length === 0) {
            return null;
        }

        return chunks.join('');
    }

    /**
     * Deletes all cookies including chunks
     */
    public static deleteCookies(cookies: Cookies, baseName: string): void {
        // Delete main cookie
        cookies.delete(baseName, { path: '/' });

        // Delete any potential chunks
        let index = 0;
        while (cookies.get(`${baseName}.${index}`)) {
            cookies.delete(`${baseName}.${index}`, { path: '/' });
            index++;
        }
    }
}
