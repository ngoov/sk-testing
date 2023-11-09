export function load({ locals }) {
    console.info(locals.LL.log({ fileName: '+layout.server.ts' }));

    // pass locale information from "server-context" to "shared server + client context"
    const session = locals.session; //await locals.getSession();
    return {
        locale: locals.locale,
        session,
    };
}
