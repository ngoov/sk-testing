import type { LoadEvent } from "@sveltejs/kit";

export async function load({ fetch }: LoadEvent) {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');

    return {
        data: response.json(),
    };
}
