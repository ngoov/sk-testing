import { PUBLIC_APP_BASE_URL } from '$env/static/public';
import { getAppsumAuthConfig } from '$lib/auth/appsum/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies.js';
import { getOidcServerConfiguration } from '$lib/auth/client';
import { redirect } from '@sveltejs/kit';
import * as client from 'openid-client';

export async function GET({ locals, cookies }) {
    if (!locals.session) return new Response(null, { status: 401 });

    const authConfig = await getAppsumAuthConfig();
    const serverConfig = await getOidcServerConfiguration(authConfig);
    const cookieConfig = getAuthStateCookieConfig(authConfig);

    // Logout URL to end the session on the IdSrv
    const endSessionUrl = client.buildEndSessionUrl(serverConfig, {
        post_logout_redirect_uri: PUBLIC_APP_BASE_URL
    });

    // Delete all cookies including chunks
    cookieConfig.deleteCookies(cookies);

    throw redirect(302, endSessionUrl);
}
