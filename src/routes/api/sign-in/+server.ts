import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';

export const GET = async ({ fetch, url }: RequestEvent) => {
    const csrfTokenResponse = await fetch('/auth/csrf');
    const { csrfToken } = await csrfTokenResponse.json();

    const callbackUrl = url.searchParams.get('callbackUrl') ?? 'http://localhost:5173';

    const signInRequest = await fetch('/auth/signin/duende-identity-server6', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Auth-Return-Redirect': '1',
        },
        body: new URLSearchParams({
            csrfToken,
            callbackUrl,
        }),
    });

    const data = await signInRequest.clone().json();
    throw redirect(302, callbackUrl);
};
