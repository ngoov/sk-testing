import type { SerializeOptions } from 'cookie';

export interface Cookie {
    name: string;
    value: string;
    options: SerializeOptions;
}

export interface ChunkedCookies {
    cookies: Cookie[];
    totalChunks: number;
}

export interface CookieOptions {
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    secure?: boolean;
    expires?: Date;
}
