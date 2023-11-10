import { AUTH_CRYPTO_SECRET } from '$env/static/private';
import { decryptToken, encryptToken } from '$lib/auth/cryptoUtils';
import type dayjs from 'dayjs';
import type { CookieSerializeOptions } from 'cookie';
import type { AuthConfig } from '$lib/auth/types';

export interface Cookie {
    name: string;
    value: string;
    options: CookieSerializeOptions;
}

export class AuthCookieConfig<TValue> {
    private _authConfig: AuthConfig;
    private _internalCookieName: string;
    private _expirationDate: dayjs.Dayjs;

    public get name(): string {
        const prefix = this._authConfig.useSecureCookies ? '__Host-' : '';
        return `${prefix}${this._internalCookieName}`;
    }
    constructor({
        authConfig,
        cookieName,
        expirationDate,
    }: {
        authConfig: AuthConfig;
        cookieName: string;
        expirationDate: dayjs.Dayjs;
    }) {
        this._authConfig = authConfig;
        this._internalCookieName = cookieName;
        this._expirationDate = expirationDate;
    }

    private getCookieOptions(): CookieSerializeOptions {
        return {
            httpOnly: true,
            sameSite: this._authConfig.useSecureCookies ? 'strict' : 'lax',
            path: '/',
            secure: this._authConfig.useSecureCookies,
            expires: this._expirationDate.toDate(),
        };
    }
    public async createCookie(value: TValue): Promise<Cookie> {
        return {
            name: this.name,
            value: await encryptToken<TValue>({
                secret: AUTH_CRYPTO_SECRET,
                token: value,
            }),
            options: this.getCookieOptions(),
        };
    }

    public async decryptValue(encryptedValue: string): Promise<TValue | null> {
        return await decryptToken<TValue>({ token: encryptedValue, secret: AUTH_CRYPTO_SECRET });
    }
}
