import { getAuthConfig } from '$lib/auth/authConfig';
import { getAuthStateCookieConfig } from '$lib/auth/authCookies.js';
import { getOidcClient } from '$lib/auth/client';
import { redirect } from '@sveltejs/kit';

export async function GET({ locals, cookies }) {
    if (!locals.session) return new Response(null, { status: 401 });

    const authConfig = await getAuthConfig();
    const client = await getOidcClient(authConfig);

    const endSessionUrl = client.endSessionUrl({
        id_token_hint: locals.session.tokenSet.id_token,
    });
    const cookieConfig = getAuthStateCookieConfig(authConfig);

    cookies.delete(cookieConfig.name, { path: '/' });

    throw redirect(302, endSessionUrl);
}
