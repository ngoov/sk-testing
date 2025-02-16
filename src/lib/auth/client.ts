import type { AuthConfig } from '$lib/auth/types';
import * as client from 'openid-client';

export async function getOidcServerConfiguration({
    issuerUrl,
    clientId,
    clientSecret,
}: AuthConfig): Promise<client.Configuration> {
    const secret = client.ClientSecretJwt(clientSecret);
    const config = await client.discovery(issuerUrl, clientId, {}, secret);
    console.log('config', config.serverMetadata());
    // const serverMetadata = config.serverMetadata();
    // JARM not needed because SvelteKit is the BFF
    // // Use JARM if the server supports it
    // if (serverMetadata.jwks_uri != null) {
    //     client.useJwtResponseMode(config);
    // }

    return config;
}
