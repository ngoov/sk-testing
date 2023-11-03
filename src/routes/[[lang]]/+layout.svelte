<script lang="ts">
    import { page } from '$app/stores';
    import LL, { setLocale } from '$lib/i18n/i18n-svelte';
    import Header from '$lib/components/lang/Header.svelte';
    import 'virtual:uno.css';
    import '@unocss/reset/tailwind.css';
    // import { signIn } from '@auth/sveltekit/client';

    import * as Menubar from '$lib/components/ui/menubar';

    let bookmarks = false;
    let fullUrls = true;
    const profileRadioValue = 'benoit';

    export let data;
    // at the very top, set the locale before you access the store and before the actual rendering takes place
    setLocale(data.locale);

    console.info($LL.log({ fileName: '+layout.svelte' }));
</script>

<svelte:head>
    <title>{$page.data.title || 'typesafe-i18n'}</title>
</svelte:head>

<div class="app">
    <Menubar.Root>
        <Menubar.Menu>
            <Menubar.Trigger>File</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.Item>
                    New Tab <Menubar.Shortcut>⌘T</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item>
                    New Window <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item>New Incognito Window</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Sub>
                    <Menubar.SubTrigger>Share</Menubar.SubTrigger>
                    <Menubar.SubContent>
                        <Menubar.Item>Email link</Menubar.Item>
                        <Menubar.Item>Messages</Menubar.Item>
                        <Menubar.Item>Notes</Menubar.Item>
                    </Menubar.SubContent>
                </Menubar.Sub>
                <Menubar.Separator />
                <Menubar.Item>
                    Print... <Menubar.Shortcut>⌘P</Menubar.Shortcut>
                </Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
            <Menubar.Trigger>Edit</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.Item>
                    Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item>
                    Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Sub>
                    <Menubar.SubTrigger>Find</Menubar.SubTrigger>
                    <Menubar.SubContent>
                        <Menubar.Item>Search the web</Menubar.Item>
                        <Menubar.Separator />
                        <Menubar.Item>Find...</Menubar.Item>
                        <Menubar.Item>Find Next</Menubar.Item>
                        <Menubar.Item>Find Previous</Menubar.Item>
                    </Menubar.SubContent>
                </Menubar.Sub>
                <Menubar.Separator />
                <Menubar.Item>Cut</Menubar.Item>
                <Menubar.Item>Copy</Menubar.Item>
                <Menubar.Item>Paste</Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
            <Menubar.Trigger>View</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.CheckboxItem bind:checked={bookmarks}
                    >Always Show Bookmarks Bar</Menubar.CheckboxItem
                >
                <Menubar.CheckboxItem bind:checked={fullUrls}
                    >Always Show Full URLs</Menubar.CheckboxItem
                >
                <Menubar.Separator />
                <Menubar.Item inset>
                    Reload <Menubar.Shortcut>⌘R</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Item inset>
                    Force Reload <Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
                </Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item inset>Toggle Fullscreen</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item inset>Hide Sidebar</Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
        <Menubar.Menu>
            <Menubar.Trigger>Profiles</Menubar.Trigger>
            <Menubar.Content>
                <Menubar.RadioGroup value={profileRadioValue}>
                    <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
                    <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
                    <Menubar.RadioItem value="Luis">Luis</Menubar.RadioItem>
                </Menubar.RadioGroup>
                <Menubar.Separator />
                <Menubar.Item inset>Edit...</Menubar.Item>
                <Menubar.Separator />
                <Menubar.Item inset>Add Profile...</Menubar.Item>
            </Menubar.Content>
        </Menubar.Menu>
    </Menubar.Root>

    <Header />
    <pre>{JSON.stringify(data, null, 2)}</pre>
    {#if $page.data.session}
        <div>Logged in</div>
        <span class="signedInText">
            <small>Signed in as</small><br />
            <strong>{$page.data.session.user?.email ?? $page.data.session.user?.name}</strong>
        </span>
        <a href="/auth/signout" class="button" data-sveltekit-preload-data="off">Sign out</a>
    {:else}
        <span class="notSignedInText">You are not signed in</span>
        <a href="/api/sign-in" class="buttonPrimary" data-sveltekit-preload-data="off">Sign in</a>
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
