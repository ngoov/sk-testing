import type { Cookies } from '@sveltejs/kit';
import type { Cookie, ChunkedCookies, CookieOptions } from './types';
import { ChunkedCookieManager } from './chunkedCookieManager';

export abstract class BaseCookieConfig<TValue> {
    protected abstract readonly _cookieName: string;
    protected abstract readonly _options: CookieOptions;

    public get name(): string {
        return this._cookieName;
    }

    protected abstract serializeValue(value: TValue): Promise<string>;
    protected abstract deserializeValue(value: string): Promise<TValue | null>;

    protected getCookieOptions(): Cookie['options'] {
        return {
            httpOnly: this._options.httpOnly ?? true,
            sameSite: this._options.sameSite ?? 'lax',
            path: this._options.path ?? '/',
            secure: this._options.secure ?? false,
            expires: this._options.expires,
        };
    }

    /**
     * Creates a cookie with the serialized value, handling chunking if needed
     */
    public async createCookie(value: TValue): Promise<Cookie | ChunkedCookies> {
        const serializedValue = await this.serializeValue(value);
        return ChunkedCookieManager.createCookies(
            this.name,
            serializedValue,
            this.getCookieOptions()
        );
    }

    /**
     * Sets the cookie value in the SvelteKit cookies store, handling both single and chunked cookies
     */
    public async setCookie(cookies: Cookies, value: TValue): Promise<void> {
        const result = await this.createCookie(value);

        if ('cookies' in result) {
            // Handle chunked cookies
            result.cookies.forEach(cookie => {
                cookies.set(cookie.name, cookie.value, cookie.options as any);
            });
        } else {
            // Handle single cookie
            cookies.set(result.name, result.value, result.options as any);
        }
    }

    /**
     * Gets and decrypts the cookie value from the SvelteKit cookies store
     */
    public async getCookieValue(cookies: Cookies, deleteAfterRead = false): Promise<TValue | null> {
        const value = ChunkedCookieManager.getCombinedValue(cookies, this.name);
        if (!value) return null;

        if (deleteAfterRead) {
            this.deleteCookies(cookies);
        }

        return await this.deserializeValue(value);
    }

    /**
     * Gets and decrypts the cookie value, throwing an error if not found or decryption fails
     */
    public async getAndDeleteCookieValueOrThrow(cookies: Cookies): Promise<TValue> {
        const value = await this.getCookieValue(cookies, true);
        if (!value) {
            throw Error(`The cookie ${this.name} must be set and could not be decrypted`);
        }
        return value;
    }

    /**
     * Deletes all cookies associated with this config, including any chunked cookies
     */
    public deleteCookies(cookies: Cookies): void {
        ChunkedCookieManager.deleteCookies(cookies, this.name);
    }
}
