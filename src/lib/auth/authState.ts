import { getAuthStateCookieConfig } from '$lib/auth/authCookies';
import type { AuthConfig, AuthState, SessionState, TokenWithClaims } from '$lib/auth/types';
import type { Cookies } from '@sveltejs/kit';

export function getAuthState(token: TokenWithClaims): AuthState {
	console.log('getAuthState', token)
    if (!token.access_token || !token.id_token || !token.refresh_token || !token.expires_in || !token.token_type)
        throw new Error('Given TokenSet is invalid.');

    const claims = token.claims();
    return {
        access_token: token.access_token,
        id_token: token.id_token,
        expires_at: token.expires_in as number,
        token_type: token.token_type,
        refresh_token: token.refresh_token,
        claims: claims,
    } satisfies AuthState;
}

export async function setAuthStateCookie(cookies: Cookies, token: TokenWithClaims, authConfig: AuthConfig): Promise<void> {
    const authState = getAuthState(token);
    const cookieConfig = getAuthStateCookieConfig(authConfig);
    if (authConfig.useJwtCookie) {
        // save the whole authstate encrypted in the cookie
        await cookieConfig.setCookie(cookies, authState);
    } else {
        // create a session to store in the database and save the encrypted session id in the cookie
        const sessionState = {
            sessionId: crypto.randomUUID(),
        } satisfies SessionState;
        console.log('store tokenset in db and save sessionid in cookie', sessionState.sessionId);
        // TODO: store in db
        await cookieConfig.setCookie(cookies, sessionState);
    }
}
