import type { Handle } from '@sveltejs/kit';
// import { APPSUM_AUTH_CLIENT_ID, APPSUM_AUTH_CLIENT_SECRET } from '$env/static/private';

const APPSUM_AUTH_CLIENT_ID = 'clientid';
const APPSUM_AUTH_CLIENT_SECRET = 'secret';

export const appsumAuthHook: Handle = ({ resolve, event }) => {
    return resolve(event);
};
