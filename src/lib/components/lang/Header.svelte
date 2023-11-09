<script lang="ts">
    import { base } from '$app/paths';
    import { locale } from '$lib/i18n/i18n-svelte';
    import LocaleSwitcher from './LocaleSwitcher.svelte';
</script>

<header>
    <div>
        <a href="{base}/{$locale}">
            <h1>typesafe-i18n</h1>
        </a>
    </div>
    <nav>
        <ul>
            {#each [...Array(5).keys()] as pageId}
                <li><a href="/page{pageId}">Page {pageId}</a></li>
            {/each}
        </ul>
    </nav>

    <LocaleSwitcher />
</header>
