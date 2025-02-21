import type { AuthConfig } from '$lib/auth/types';
import { createPrivateKey } from 'crypto';
import { SignJWT, type KeyLike } from 'jose';
import * as client from 'openid-client';

export async function getOidcServerConfiguration({
    issuerUrl,
    clientId,
    clientSecret,
}: AuthConfig): Promise<client.Configuration> {

	// const secret = client.PrivateKeyJwt(s);

    const config = await client.discovery(issuerUrl, clientId, clientSecret);
    console.log('config is ok');
    // const serverMetadata = config.serverMetadata();
    // JARM not needed because SvelteKit is the BFF
    // // Use JARM if the server supports it
    // if (serverMetadata.jwks_uri != null) {
    //     client.useJwtResponseMode(config);
    // }

    return config;
}
