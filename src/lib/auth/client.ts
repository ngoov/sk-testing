import { PUBLIC_APP_BASE_URL } from '$env/static/public';
import type { AuthConfig } from '$lib/auth/types';
import oidc from 'openid-client';

export async function getOidcClient({ issuerUrl, clientId, clientSecret, redirectUrl }: AuthConfig) {
    const issuer = await oidc.Issuer.discover(issuerUrl);

    return new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        usePKCE: true,
        redirect_uris: [redirectUrl],
        response_types: ['code'],
        post_logout_redirect_uris: [PUBLIC_APP_BASE_URL],
    });
}
