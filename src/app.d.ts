import type { AuthState } from '$lib/auth/types';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type Locales = import('$i18n/i18n-types').Locales;
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
type TranslationFunctions = import('$i18n/i18n-types').TranslationFun;

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            locale: Locales;
            LL: TranslationFunctions;
            session?: AuthState;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export {};
