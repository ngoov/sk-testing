export interface AuthSessionState {
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
    email?: string;
    email_verified?: boolean;
    user_name?: string;
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
    id_token: string;
    access_token: string;
    refresh_token: string;
    /**
     * Timestamp when the access_token expires
     */
    expires_at: number;
    token_type: string;
    claims: Profile;
}
