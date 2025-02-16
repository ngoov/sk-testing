import { getAppsumAuthConfig } from '$lib/auth/appsum/authConfig';
import { getAuthSessionStateCookieConfig } from '$lib/auth/authCookies';
import { getAuthStateCookieToCreate } from '$lib/auth/authState';
import { getOidcServerConfiguration } from '$lib/auth/client';
import type { AuthConfig, AuthSessionState } from '$lib/auth/types';
import { redirect, type Cookies } from '@sveltejs/kit';
import * as client from 'openid-client';

export async function GET({ url, cookies }) {
    const authConfig = await getAppsumAuthConfig();

    // The session state data that was used for the authorization request, we need these to verify if nothing has been tampered with
    const sessionStateCookieValue = await getSessionStateCookieValue(cookies, authConfig);
    console.log('session state cookie', sessionStateCookieValue);

    const { codeVerifier, nonce, returnAfterLoginUrl } = sessionStateCookieValue;
    // console.log('callback entered with url', url);
    const serverConfig = await getOidcServerConfiguration(authConfig);

    var parameters: Record<string, string> = {
        // resource: 'https://my.api.example.com/',
        // resource: 'https://my.api2.example.com/',
    };

    const token = await client.authorizationCodeGrant(serverConfig, url, {
        expectedNonce: nonce,
        pkceCodeVerifier: codeVerifier,
    });

    const sessionCookie = await getAuthStateCookieToCreate(token, authConfig);
    // TODO: remove any when issue is fixed: https://github.com/sveltejs/kit/pull/13386
    // Set SerializeOptions as any, because we are using a more up to date version the cookie library
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options as any);

    // const userinfo = await client.userinfo(access_token);
    // console.log('userinfo %j', userinfo);
    throw redirect(302, returnAfterLoginUrl || '/');
}

// Read the session state that is used to persist data between the login request and the callback
// Then delete the cookie, because we only need it for 1 request
async function getSessionStateCookieValue(cookies: Cookies, authConfig: AuthConfig): Promise<AuthSessionState> {
    const cookieConfig = getAuthSessionStateCookieConfig(authConfig);
    const value = cookies.get(cookieConfig.name);
    if (!value) throw Error(`The cookie ${cookieConfig.name} must be set`);

    const decryptedValue = await cookieConfig.decryptValue(value);
    if (!decryptedValue) throw Error(`The cookie ${cookieConfig.name} could not be decrypted`);

    // The data is used, so remove it
    // Need to add the path to make sure the delete happens correctly
    cookies.delete(cookieConfig.name, { path: '/' });

    return decryptedValue;
}
