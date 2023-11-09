<script lang="ts">
    import { page } from '$app/stores';
    import LL, { setLocale } from '$lib/i18n/i18n-svelte';
    import Header from '$lib/components/lang/Header.svelte';
    import 'virtual:uno.css';
    import '@unocss/reset/tailwind.css';

    export let data;
    // at the very top, set the locale before you access the store and before the actual rendering takes place
    setLocale(data.locale);

    console.info($LL.log({ fileName: '+layout.svelte' }));
</script>

<svelte:head>
    <title>{$page.data.title || 'typesafe-i18n'}</title>
</svelte:head>

<div class="app">
    <Header />
    <div class="overflow-y-auto h-lg w-md overscroll-contain border border-gray">
        <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
    {#if $page.data.session}
        <div>Logged in</div>
        <span class="signedInText">
            <small>Signed in as</small><br />
            <strong>{$page.data.session.user?.email ?? $page.data.session.user?.name}</strong>
        </span>
        <a href="/api/auth/logout" class="button" data-sveltekit-preload-data="off">Sign out</a>
    {:else}
        <span class="notSignedInText">You are not signed in</span>
        <a href="/api/auth/login" class="buttonPrimary" data-sveltekit-preload-data="off">Sign in</a>
        <!-- <button on:click={() => signIn('duende-identity-server6')}>Sign in client side</button> -->
    {/if}

    <main>
        <slot />
    </main>

    <footer>Footer</footer>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
    }

    @media (min-width: 480px) {
        footer {
            padding: 12px 0;
        }
    }
</style>
