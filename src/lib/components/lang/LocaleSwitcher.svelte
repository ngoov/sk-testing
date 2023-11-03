<script lang="ts">
    import { locale } from '$lib/i18n/i18n-svelte';
    import { locales } from '$lib/i18n/i18n-util';

    // TODO: use form instead of links, move the code from the hook to the layout component's server.ts
    // update `lang` attribute
    // $: browser && document.querySelector('html')!.setAttribute('lang', $locale);
</script>

<ul>
    {#each locales as l}
        <li>
            <a class:text-red={l === $locale} href="?lang={l}" data-sveltekit-reload>
                {l}
            </a>
        </li>
    {/each}
</ul>
