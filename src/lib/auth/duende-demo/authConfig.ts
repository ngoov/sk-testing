import { USE_SECURE_COOKIES } from '$env/static/private';
import type { AuthConfig } from '$lib/auth/types';
import fs from 'fs/promises';
// import { APPSUM_AUTH_CLIENT_ID, APPSUM_AUTH_CLIENT_SECRET } from '$env/static/private';
const AUTH_CLIENT_ID = 'interactive.confidential.jwt';
const AUTH_CLIENT_SECRET = '511536EF-F270-4058-80CA-1C89C192F69A';

// eslint-disable-next-line @typescript-eslint/require-await
/**
 * Get the auth config for this application (client data, scopes to request, ...)
 * @returns
 */
export async function getDuendeDemoAuthConfig(): Promise<AuthConfig> {
    const clientSecret = await fs.readFile('./src/demo.key');
    return {
        clientId: AUTH_CLIENT_ID,
        clientSecret: clientSecret.toString(),
        issuerUrl: new URL('https://demo.duendesoftware.com'), //new URL('https://localhost:5666'),
        redirectUri: new URL('http://localhost:5173/api/auth/login/callback'),
        scope: 'api openid email profile offline_access',
        useSecureCookies: USE_SECURE_COOKIES == '1',
        useJwtCookie: true,
    };
}
