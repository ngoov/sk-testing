<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import LL from '$lib/i18n/i18n-svelte';
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1 class="text-red font-bold">{$LL.welcome({ year: 2013 })}Test</h1>
    <Button>123</Button>
    <h2>Test</h2>
</section>
