import { getAuthConfig } from '$lib/auth/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies';
import { getAuthStateCookieToCreate } from '$lib/auth/authState';
import { getOidcClient } from '$lib/auth/client';
import type { AuthConfig, AuthState } from '$lib/auth/types';
import type { Cookies, Handle } from '@sveltejs/kit';

export const appsumAuthHook: Handle = async ({ resolve, event }) => {
    const authConfig = await getAuthConfig();
    const session = await getSession(event.cookies, authConfig);

    if (session == null) return resolve(event);

    const tokenExpired = session.expires_at > new Date().getTime();
    if (tokenExpired) {
        // Get a new access token
        const authConfig = await getAuthConfig();
        const client = await getOidcClient(authConfig);
        const newTokenSet = await client.refresh(session.refresh_token);
        const cookieConfig = await getAuthStateCookieToCreate(newTokenSet, authConfig);
        event.cookies.set(cookieConfig.name, cookieConfig.value, cookieConfig.options);
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
// import { SvelteKitAuth } from '@auth/sveltekit';
// import DuendeIdentityServer from '@auth/core/providers/duende-identity-server6';
// import {
//     APPSUM_AUTH_CLIENT_ID,
//     APPSUM_AUTH_CLIENT_SECRET,
//     APPSUM_AUTH_AUTHORIZATION_URL,
// } from '$env/static/private';
// import type { Profile, User } from '@auth/core/types';

// export const appsumAuthHook = SvelteKitAuth({
//     providers: [
//         DuendeIdentityServer({
//             id: 'duende-demo',
//             clientId: APPSUM_AUTH_CLIENT_ID,
//             clientSecret: APPSUM_AUTH_CLIENT_SECRET,
//             wellKnown: `${APPSUM_AUTH_AUTHORIZATION_URL}/.well-known/openid-configuration`,
//             issuer: APPSUM_AUTH_AUTHORIZATION_URL,
//             checks: ['pkce'],
//             authorization: {
//                 params: { scope: 'openid profile email api' },
//             },
//             profile: (profile) => {
//                 return {
//                     id: profile.sub,
//                 };
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt(data) {
//             data.token.userRole = 'admin';
//             const profile = data.profile as Profile & { iss: string };
//             let userInfo;
//             if (!data.user?.name && profile?.iss) {
//                 var userInfoResponse = await fetch(`${profile.iss}/connect/userinfo`, {
//                     headers: {
//                         Authorization: `Bearer ${data.account?.access_token}`,
//                     },
//                 });
//                 userInfo = await userInfoResponse.json();
//                 data.token = {
//                     ...data.token,
//                     user: userInfo,
//                 };
//             }
//             // TODO: map profile
//             return data.token;
//         },
//         async session(params) {
//             params.session.user = params.token.user as User;
//             return params.session;
//         },
//     },
//     debug: true,
// });
