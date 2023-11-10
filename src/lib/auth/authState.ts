import { getAuthStateCookieConfig } from '$lib/auth/authCookies';
import type { AuthConfig, AuthState, SessionState } from '$lib/auth/types';
import type { TokenSet } from 'openid-client';

export async function getAuthStateCookieToCreate(tokenSet: TokenSet, authConfig: AuthConfig) {
    const authState = getAuthState(tokenSet);
    const cookieConfig = getAuthStateCookieConfig(authConfig);
    if (authConfig.useJwtCookie) {
        // save the whole authstate encrypted in the cookie
        return await cookieConfig.createCookie(authState);
    }
    // create a session to store in the database and save the encrypted session id in the cookie
    const sessionState = {
        sessionId: crypto.randomUUID(),
    } satisfies SessionState;
    console.log('store tokenset in db and save sessionid in cookie', sessionState.sessionId);
    // TODO: store in db
    return cookieConfig.createCookie(sessionState);
}

function getAuthState(tokenSet: TokenSet) {
    if (
        !tokenSet.access_token ||
        !tokenSet.id_token ||
        !tokenSet.refresh_token ||
        !tokenSet.expires_at ||
        !tokenSet.token_type
    )
        throw new Error('Given TokenSet is invalid.');

    const claims = tokenSet.claims();
    return {
        access_token: tokenSet.access_token,
        id_token: tokenSet.id_token,
        expires_at: tokenSet.expires_at,
        token_type: tokenSet.token_type,
        refresh_token: tokenSet.refresh_token,
        claims: {
            sub: claims.sub,
            email: claims.email,
            email_verified: claims.email_verified,
            user_name: claims.user_name as string,
            name: claims.name,
            family_name: claims.family_name,
            given_name: claims.given_name,
        },
    } satisfies AuthState;
}
