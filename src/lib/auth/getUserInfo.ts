import type oidc from 'openid-client';

async function getUserInfo(client: oidc.Client, tokenSet: oidc.TokenSet) {
    const userInfoResponse = await client.userinfo(tokenSet);
}
