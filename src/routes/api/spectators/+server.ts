import { json } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export async function GET({ url, locals: { LL } }: RequestEvent) {
    // no real data, just a simulation ;)
    const oldSpectators = Number(url.searchParams.get('oldSpectators') ?? '0');
    let spectators = oldSpectators * 2 + 1;
    if (spectators > 100000) {
        spectators = 0;
    }

    console.info(LL.log({ fileName: 'api/+server.ts' }));

    return json({ spectators });
}
