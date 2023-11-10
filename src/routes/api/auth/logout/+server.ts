import { getAuthConfig } from '$lib/auth/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies.js';
import { getOidcClient } from '$lib/auth/client';
import { redirect } from '@sveltejs/kit';

export async function GET({ locals, cookies }) {
    if (!locals.session) return new Response(null, { status: 401 });

    const authConfig = await getAuthConfig();
    const client = await getOidcClient(authConfig);
    // Logout URL to end the session on the IdSrv
    const endSessionUrl = client.endSessionUrl({
        id_token_hint: locals.session.id_token,
    });
    const cookieConfig = getAuthStateCookieConfig(authConfig);
    // Local logout, should happen through backchannel logout
    cookies.delete(cookieConfig.name, { path: '/' });

    throw redirect(302, endSessionUrl);
}
