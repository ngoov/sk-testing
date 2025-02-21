import { decryptToken, encryptToken } from '$lib/auth/cryptoUtils';
import type { CookieOptions } from './types';
import { BaseCookieConfig } from './baseCookieConfig';

export class EncryptedCookieConfig<TValue> extends BaseCookieConfig<TValue> {
    protected _cookieName: string;
    protected _options: CookieOptions;
    private _encryptionSecret: string;

    constructor({
        cookieName,
        encryptionSecret,
        options,
    }: {
        cookieName: string;
        encryptionSecret: string;
        options: CookieOptions;
    }) {
        super();
        this._cookieName = cookieName;
        this._encryptionSecret = encryptionSecret;
        this._options = options;
    }

    protected async serializeValue(value: TValue): Promise<string> {
        return await encryptToken({
            secret: this._encryptionSecret,
            token: value,
        });
    }

    protected async deserializeValue(value: string): Promise<TValue | null> {
        return await decryptToken<TValue>({
            token: value,
            secret: this._encryptionSecret,
        });
    }
}
