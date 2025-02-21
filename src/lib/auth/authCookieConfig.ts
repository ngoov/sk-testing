import { AUTH_CRYPTO_SECRET } from '$env/static/private';
import type { AuthConfig } from '$lib/auth/types';
import { EncryptedCookieConfig } from './cookies/encryptedCookieConfig';

/**
 * Cookie configuration specifically for auth-related cookies.
 * Handles secure cookie prefixes and auth-specific cookie options.
 */
export class AuthCookieConfig<TValue> extends EncryptedCookieConfig<TValue> {
    constructor({
        authConfig,
        cookieName,
        expirationDate,
    }: {
        authConfig: AuthConfig;
        cookieName: string;
        expirationDate: Date;
    }) {
        const prefix = authConfig.useSecureCookies ? '__Host-' : '';
        super({
            cookieName: `${prefix}${cookieName}`,
            encryptionSecret: AUTH_CRYPTO_SECRET,
            options: {
                httpOnly: true,
                sameSite: authConfig.useSecureCookies ? 'strict' : 'lax',
                path: '/',
                secure: authConfig.useSecureCookies,
                expires: expirationDate,
            }
        });
    }
}

export type { Cookie, ChunkedCookies } from './cookies/types';
