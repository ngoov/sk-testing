<script lang="ts">
    import LL from '$lib/i18n/i18n-svelte';
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
    <h1 class="font-bold text-red-500">{$LL.welcome({ year: 2013 })} Test</h1>
    <button>123</button>
    <h2>Test</h2>
</section>
