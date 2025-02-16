import { getAppsumAuthConfig } from '$lib/auth/appsum/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies';
import { getAuthStateCookieToCreate } from '$lib/auth/authState';
import { getOidcServerConfiguration } from '$lib/auth/client';
import type { AuthConfig, AuthState } from '$lib/auth/types';
import type { Cookies, Handle } from '@sveltejs/kit';
import * as client from 'openid-client';

export const appsumAuthHook: Handle = async ({ resolve, event }) => {
    const authConfig = await getAppsumAuthConfig();
    const session = await getSession(event.cookies, authConfig);

    if (session == null) return resolve(event);

    const tokenExpired = session.expires_at > new Date().getTime();
    if (tokenExpired) {
        console.error('token expired, handle the expired token');
        // Get a new access token
        // const authConfig = await getAppAuthConfig();
        // const client = await getOidcServerConfiguration(authConfig);
        // const newTokenSet = await client.refresh(session.refresh_token);
        // const cookieConfig = await getAuthStateCookieToCreate(newTokenSet, authConfig);
        // event.cookies.set(cookieConfig.name, cookieConfig.value, cookieConfig.options);
    }

    event.locals.session = session;

    return resolve(event);
};
async function getSession(cookies: Cookies, authConfig: AuthConfig): Promise<AuthState | null> {
    const cookieConfig = getAuthStateCookieConfig(authConfig);

    const authCookie = cookies.get(cookieConfig.name);

    // Not logged in, just continue
    if (!authCookie) return null;

    const state = await cookieConfig.decryptValue(authCookie);
    // Bad value in the cookie
    if (!state) return null;

    if (!authConfig.useJwtCookie) {
        // const sessionState = state as SessionState;
        // Get authState from db
        return null;
    }
    const authState = state as AuthState;

    return authState;
}
