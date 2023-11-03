import type { LoadEvent } from '@sveltejs/kit';

import type { LayoutServerLoadEvent } from './$types';

export async function load({ locals }: LayoutServerLoadEvent) {
    console.info(locals.LL.log({ fileName: '+layout.server.ts' }));

    // pass locale information from "server-context" to "shared server + client context"
    const session = { name: 'tempsession' }; //await locals.getSession();
    return {
        locale: locals.locale,
        session,
    };
}
