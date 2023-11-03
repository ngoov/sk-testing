import { detectLocale, i18n } from '$lib/i18n/i18n-util';
import { loadAllLocales } from '$lib/i18n/i18n-util.sync';
import { redirect, type Handle, type RequestEvent } from '@sveltejs/kit';
import { getPreferredLocale } from '$lib/i18n/i18n-helpers';
import { dev } from '$app/environment';

loadAllLocales();
const L = i18n();
const langParam = 'lang';
const cookieName = `${dev ? '' : '__Host-'}Language`;

export const i18nHook: Handle = async ({ event, resolve }) => {
    // TODO: Keep the language on the session cookie for logged in users, then this cookie can be removed, because it is only used for guests
    const newLang = event.url.searchParams.get(langParam);

    if (newLang) {
        event.cookies.set(cookieName, newLang, { path: '/' });
        event.url.searchParams.delete(langParam);
        // Redirect to remove the GET var
        throw redirect(303, event.url.toString());
    }

    const locale = getFromCookie(event) ?? getBrowserLocale(event);

    const LL = L[locale];
    console.info(LL.log({ fileName: 'hooks.server.ts' }));

    // bind locale and translation functions to current request
    event.locals.locale = locale;
    event.locals.LL = LL;

    return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) });
};

function getFromCookie(event: RequestEvent) {
    const langFromCookie = event.cookies.get(cookieName);
    return langFromCookie ? detectLocale(() => [langFromCookie]) : null;
}
function getBrowserLocale(event: RequestEvent) {
    const locale = getPreferredLocale(event.request);
    event.cookies.set(cookieName, locale, { path: '/' });
    return locale;
}
