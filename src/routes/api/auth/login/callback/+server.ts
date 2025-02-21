import { getAppsumAuthConfig } from '$lib/auth/appsum/authConfig';
import { getAuthSessionStateCookieConfig } from '$lib/auth/authCookies';
import { setAuthStateCookie } from '$lib/auth/authState';
import { getOidcServerConfiguration } from '$lib/auth/client';
import type { AuthConfig, AuthSessionState } from '$lib/auth/types';
import { redirect, type Cookies } from '@sveltejs/kit';
import * as client from 'openid-client';

export async function GET({ url, cookies }) {
    const authConfig = await getAppsumAuthConfig();

    // The session state data that was used for the authorization request, we need these to verify if nothing has been tampered with
    const sessionStateCookieValue = await getSessionStateCookieValue(cookies, authConfig);
    console.log('session state cookie', sessionStateCookieValue);
    const serverConfig = await getOidcServerConfiguration(authConfig);	

    const { codeVerifier, nonce, returnAfterLoginUrl } = sessionStateCookieValue;
    // console.log('callback entered with url', url);

    var parameters: Record<string, string> = {
        // resource: 'https://my.api.example.com/',
        // resource: 'https://my.api2.example.com/',
    };

    const token = await client.authorizationCodeGrant(serverConfig, url, {
        expectedNonce: nonce,
        pkceCodeVerifier: codeVerifier,
    });

    await setAuthStateCookie(cookies, token, authConfig);

    throw redirect(302, returnAfterLoginUrl || '/');
}

// Read the session state that is used to persist data between the login request and the callback
// Then delete the cookie, because we only need it for 1 request
async function getSessionStateCookieValue(cookies: Cookies, authConfig: AuthConfig): Promise<AuthSessionState> {
    const cookieConfig = getAuthSessionStateCookieConfig(authConfig);
    return await cookieConfig.getAndDeleteCookieValueOrThrow(cookies);
}
