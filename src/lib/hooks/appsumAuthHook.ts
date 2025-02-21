import { getAppsumAuthConfig } from '$lib/auth/appsum/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies';
import type { AuthConfig, AuthState } from '$lib/auth/types';
import type { Handle } from '@sveltejs/kit';

export const appsumAuthHook: Handle = async ({ resolve, event }) => {
    const authConfig = await getAppsumAuthConfig();
    const cookieConfig = getAuthStateCookieConfig(authConfig);
    
    // Get the session state from cookies
    const session = await cookieConfig.getCookieValue(event.cookies);
    console.log('session', session);
    
    if (!session) return resolve(event);

    if (!authConfig.useJwtCookie) {
        // TODO: Get authState from db using session.sessionId
        return resolve(event);
    }

    const authState = session as AuthState;
    const tokenExpired = authState.expires_at > new Date().getTime();
    
    if (tokenExpired) {
        console.error('token expired, handle the expired token');
        // TODO: Implement token refresh
        // const client = await getOidcServerConfiguration(authConfig);
        // const newTokenSet = await client.refresh(authState.refresh_token);
        // await cookieConfig.setCookie(event.cookies, newTokenSet);
    }

    event.locals.session = authState;
    return resolve(event);
};
