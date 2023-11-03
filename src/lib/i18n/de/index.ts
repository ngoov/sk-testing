import type { Translation } from '../i18n-types';

const de = {
    title: 'typesafe-i18n - Svelte Herbst Summit {year}',
    welcome: 'Willkommen zum Svelte Herbst Summit {year}',
    spectators: '{0} Zuschauer live',
    summit: {
        schedule: '{0|simpleDate}',
    },
    log: `Dieses Logging wurde von '{fileName}' aufgerufen`,
} satisfies Translation;

export default de;
