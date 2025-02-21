import { USE_SECURE_COOKIES } from '$env/static/private';
import type { AuthConfig } from '$lib/auth/types';
import fs from 'fs/promises';
import { importPKCS8 } from 'jose';
// import { APPSUM_AUTH_CLIENT_ID, APPSUM_AUTH_CLIENT_SECRET } from '$env/static/private';
const AUTH_CLIENT_ID = 'sk-testing';
const AUTH_CLIENT_SECRET = 'QjDGK2R7CBIf4sf8sbYVDVNygBQ3uWfh';

// eslint-disable-next-line @typescript-eslint/require-await
/**
 * Get the auth config for this application (client data, scopes to request, ...)
 * @returns
 */
export async function getAppsumAuthConfig(): Promise<AuthConfig> {
    // const clientSecret = await fs.readFile('./src/private_key_test.pem', {encoding: 'utf8'});
    // const secret = await importPKCS8(clientSecret, 'RS256');
    return {
        clientId: AUTH_CLIENT_ID,
        clientSecret: AUTH_CLIENT_SECRET,
        issuerUrl: new URL('https://localhost:5666/realms/appsum'),
        redirectUri: new URL('http://localhost:5173/api/auth/login/callback'),
        scope: 'openid email profile',
        useSecureCookies: USE_SECURE_COOKIES == '1',
        useJwtCookie: true,
    };
}
