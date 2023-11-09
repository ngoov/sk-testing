import { loadLocaleAsync } from '$lib/i18n/i18n-util.async';
import { i18nObject } from '$lib/i18n/i18n-util.js';

export async function load({ data }) {
    const { locale } = data;
    // load dictionary into memory
    await loadLocaleAsync(locale);
    // if you need to output a localized string in a `load` function,
    // you always need to create a new `i18nObject` instance in each `load` function
    // to not run into shared server state issues
    const LL = i18nObject(locale);

    console.info(LL.log({ fileName: '+layout.ts' }));

    return { ...data };
}
