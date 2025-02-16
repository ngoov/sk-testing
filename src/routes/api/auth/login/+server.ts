import * as client from 'openid-client';
import { redirect, type Cookies } from '@sveltejs/kit';
import { getOidcServerConfiguration } from '$lib/auth/client';
import { getAppsumAuthConfig } from '$lib/auth/appsum/authConfig';
import type { AuthConfig, AuthSessionState } from '$lib/auth/types';
import { getAuthSessionStateCookieConfig } from '$lib/auth/authCookies';
import { PUBLIC_APP_BASE_URL } from '$env/static/public';

export async function GET({ url, cookies }) {
    const authConfig = await getAppsumAuthConfig();

    const serverConfig = await getOidcServerConfiguration(authConfig);

    // Nonce and PKCE provide protection against CSRF in various forms. See:
    // https://danielfett.de/2020/05/16/pkce-vs-nonce-equivalent-or-not/
    const nonce = client.randomNonce();
    const returnAfterLoginUrl =
        url.searchParams.get('returnUrl') ?? url.searchParams.get('return_url') ?? PUBLIC_APP_BASE_URL;
    const codeVerifier = client.randomPKCECodeVerifier();
    const sessionState = {
        codeVerifier,
        returnAfterLoginUrl,
        nonce,
    } satisfies AuthSessionState;
    // Set the session state cookie to have persisted state over requests
    await setSessionStateCookie(cookies, sessionState, authConfig);

    const pkce_code_challenge = await client.calculatePKCECodeChallenge(sessionState.codeVerifier);

    const parameters: Record<string, string> = {
        redirect_uri: authConfig.redirectUri.href,
        scope: authConfig.scope,
        code_challenge: pkce_code_challenge,
        code_challenge_method: 'S256',
        nonce,
        // resource: 'https://my.api.example.com/resource/32178',
        ui_locales: 'en',
    };

    // JAR/PAR not needed because SvelteKit is the BFF
    const authorizationUrl = client.buildAuthorizationUrl(serverConfig, parameters);
    console.log(`Authorization URL ${authorizationUrl}`);

    redirect(302, authorizationUrl);
}

async function setSessionStateCookie(cookies: Cookies, sessionState: AuthSessionState, authConfig: AuthConfig) {
    const sessionStateCookieConfig = getAuthSessionStateCookieConfig(authConfig);
    const { name, options, value } = await sessionStateCookieConfig.createCookie(sessionState);

    // TODO: remove any when issue is fixed: https://github.com/sveltejs/kit/pull/13386
    // Set SerializeOptions as any, because we are using a more up to date version the cookie library
    cookies.set(name, value, options as any);
}
