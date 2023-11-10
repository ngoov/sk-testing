import { USE_SECURE_COOKIES } from '$env/static/private';
import type { AuthConfig } from '$lib/auth/types';
// import { APPSUM_AUTH_CLIENT_ID, APPSUM_AUTH_CLIENT_SECRET } from '$env/static/private';
const APPSUM_AUTH_CLIENT_ID = 'm2m.client';
const APPSUM_AUTH_CLIENT_SECRET = '511536EF-F270-4058-80CA-1C89C192F69A';

// eslint-disable-next-line @typescript-eslint/require-await
export async function getAuthConfig(): Promise<AuthConfig> {
    return {
        clientId: APPSUM_AUTH_CLIENT_ID,
        clientSecret: APPSUM_AUTH_CLIENT_SECRET,
        issuerUrl: 'https://localhost:5666',
        redirectUrl: 'http://localhost:5173/api/auth/login/callback',
        scope: 'openid email profile offline_access',
        useSecureCookies: USE_SECURE_COOKIES == '1',
        useJwtCookie: true,
    };
}
