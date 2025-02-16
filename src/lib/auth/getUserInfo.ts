import * as client from 'openid-client';

async function getUserInfo(config: client.Configuration, accessToken: string, sub: string) {
    const userInfoResponse = await client.fetchUserInfo(config, accessToken, sub);
	return userInfoResponse;
}
