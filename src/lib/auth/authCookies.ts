import { AuthCookieConfig } from '$lib/auth/authCookieConfig';
import type { AuthConfig, AuthSessionState, AuthState, SessionState } from '$lib/auth/types';
import { addMinutes, addMonths } from 'date-fns';

/**
 * Get the config for a cookie to save the intermediate state of an Authentication flow
 */
export const getAuthSessionStateCookieConfig = (authConfig: AuthConfig) =>
    new AuthCookieConfig<AuthSessionState>({
        cookieName: 'appsum.auth-session-state',
        expirationDate: addMinutes(new Date(), 15),
        authConfig,
    });

/**
 * Get the config for a cookie to save the actual AuthState containing the TokenSet or SessionId (which can be used to get the TokenSet from storage) after a successful Authentication
 */
export const getAuthStateCookieConfig = (authConfig: AuthConfig) =>
    new AuthCookieConfig<AuthState | SessionState>({
        cookieName: 'appsum.auth-state',
        expirationDate: addMonths(new Date(), 1),
        authConfig,
    });
