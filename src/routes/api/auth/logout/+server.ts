import { getAppAuthConfig } from '$lib/auth/duende-demo/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies.js';
import { getOidcServerConfiguration } from '$lib/auth/client';
import { redirect } from '@sveltejs/kit';
import * as client from 'openid-client';

export async function GET({ locals, cookies }) {
    if (!locals.session) return new Response(null, { status: 401 });

    const authConfig = await getAppAuthConfig();
    const serverConfig = await getOidcServerConfiguration(authConfig);

    var parameters: Record<string, string> = {
        id_token_hint: locals.session.id_token,
    };
    // Logout URL to end the session on the IdSrv
    const endSessionUrl = client.buildEndSessionUrl(serverConfig, parameters);
    const cookieConfig = getAuthStateCookieConfig(authConfig);
    // TODO: currently a local logout, should happen through backchannel logout
    cookies.delete(cookieConfig.name, { path: '/' });

    throw redirect(302, endSessionUrl);
}
