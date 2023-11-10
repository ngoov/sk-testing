import { getAuthConfig } from '$lib/auth/authConfig';
import { getAuthSessionStateCookieConfig } from '$lib/auth/authCookies';
import { getAuthStateCookieToCreate } from '$lib/auth/authState';
import { getOidcClient } from '$lib/auth/client';
import type { AuthConfig } from '$lib/auth/types';
import { redirect, type Cookies } from '@sveltejs/kit';

export async function GET({ url, cookies }) {
    const authConfig = await getAuthConfig();
    const sessionStateCookieValue = await getSessionStateCookieValue(cookies, authConfig);

    console.log('session state cookie', sessionStateCookieValue);
    // console.log('callback entered with url', url);
    const client = await getOidcClient(authConfig);
    const params = client.callbackParams(url.toString());
    console.log('param', params);

    const { codeVerifier: code_verifier, returnAfterLoginUrl } = sessionStateCookieValue;

    const tokenSet = await client.callback(authConfig.redirectUrl, params, {
        code_verifier,
    });

    const sessionCookie = await getAuthStateCookieToCreate(tokenSet, authConfig);
    cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);

    // const userinfo = await client.userinfo(access_token);
    // console.log('userinfo %j', userinfo);
    throw redirect(302, returnAfterLoginUrl || '/');
}
async function getSessionStateCookieValue(cookies: Cookies, authConfig: AuthConfig) {
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
