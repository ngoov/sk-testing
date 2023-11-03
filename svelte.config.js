import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: ['.md'],
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    extensions: ['.svelte', '.md'],
    preprocess: vitePreprocess(),
    kit: {
        adapter: adapter(),
        alias: {
            utils: '$lib/utils',
            components: '$lib/components',
        },
    },
};

export default config;
