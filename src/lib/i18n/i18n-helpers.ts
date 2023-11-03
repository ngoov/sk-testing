import { detectLocale } from './i18n-util';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';

export const getPreferredLocale = (request: Request) => {
    // detect the preferred language the user has configured in his browser
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
    const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);

    return detectLocale(acceptLanguageDetector);
};
