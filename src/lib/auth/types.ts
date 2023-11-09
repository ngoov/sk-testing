import type { IdTokenClaims, TokenSet } from 'openid-client';

export interface AuthSessionState {
    state?: string;
    nonce?: string;
    codeVerifier?: string;
    returnAfterLoginUrl?: string;
}

/**
 * Used when the auth state is persisted to a database
 */
export interface SessionState {
    sessionId: string;
}

export interface Profile {
    sub: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    middle_name?: string;
    nickname?: string;
    preferred_username?: string;
    profile?: string;
    picture?: string;
    website?: string;
    email?: string;
    email_verified?: boolean;
    gender?: string;
    birthdate?: string;
    zoneinfo?: string;
    locale?: string;
    phone_number?: string;
    updated_at?: number;
    address?: {
        formatted?: string;
        street_address?: string;
        locality?: string;
        region?: string;
        postal_code?: string;
        country?: string;
    };
    [claim: string]: unknown;
}

export type Awaitable<T> = T | PromiseLike<T>;

export interface DefaultJWT extends Record<string, unknown> {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface AuthConfig {
    clientId: string;
    clientSecret: string;
    issuerUrl: string;
    redirectUrl: string;
    useSecureCookies: boolean;
    scope: string;
    useJwtCookie: boolean;
}

export interface AuthState {
    tokenSet: TokenSet;
    claims?: IdTokenClaims & Profile;
    iat?: number;
    exp?: number;
}
