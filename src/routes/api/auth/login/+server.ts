import oidc from 'openid-client';
import { redirect, type Cookies } from '@sveltejs/kit';
import { getOidcClient } from '$lib/auth/client';
import { getAuthConfig } from '$lib/auth/authConfig';
import type { AuthConfig, AuthSessionState } from '$lib/auth/types';
import { getAuthSessionStateCookieConfig } from '$lib/auth/authCookies';

export async function GET({ url, cookies }) {
    const authConfig = await getAuthConfig();

    const client = await getOidcClient(authConfig);

    // State, nonce and PKCE provide protection against CSRF in various forms. See:
    // https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/
    const sessionState = {
        codeVerifier: oidc.generators.codeVerifier(),
        returnAfterLoginUrl: url.searchParams.get('returnUrl') ?? 'http://localhost:5173',
    } satisfies AuthSessionState;

    await setSessionStateCookie(cookies, sessionState, authConfig);

    const pkce_code_challenge = oidc.generators.codeChallenge(sessionState.codeVerifier);
    const authorizationUrl = client.authorizationUrl({
        scope: authConfig.scope,
        // resource: 'https://my.api.example.com/resource/32178',
        code_challenge: pkce_code_challenge,
        code_challenge_method: 'S256',
    });
    console.log(`Authorization URL ${authorizationUrl}`);

    throw redirect(302, authorizationUrl);
}

async function setSessionStateCookie(cookies: Cookies, sessionState: AuthSessionState, authConfig: AuthConfig) {
    const sessionStateCookieConfig = getAuthSessionStateCookieConfig(authConfig);
    const { name, options, value } = await sessionStateCookieConfig.createCookie(sessionState);

    cookies.set(name, value, options);
}
