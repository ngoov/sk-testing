import { appsumAuthHook } from '$lib/hooks/appsumAuthHook';
import { i18nHook } from '$lib/hooks/i18nHook';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
// import { DEV_AUTOLOGIN } from "$env/static/private";

const DEV_AUTOLOGIN = false;

const autoLoginHook: Handle = async ({ event, resolve }) => {
    if (!DEV_AUTOLOGIN) return resolve(event);

    event.cookies.set(
        `next-auth.session-token`,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o',
        {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            // secure: true
        },
    );
    return resolve(event);
};
// i18nHook: this includes an invalid use of query params, should be fixed when using Paraglide
const hooks = [autoLoginHook, appsumAuthHook];
export const handle = sequence(...hooks);
