import { EncryptJWT, jwtDecrypt, type JWTPayload } from 'jose';
import { hkdf } from '@panva/hkdf';
import type { JWT } from './types';
import type dayjs from 'dayjs';

/**
 * Stretch or shrink the given key to the given length
 */
async function getDerivedEncryptionKey(key: string, bitLength = 32) {
    return await hkdf('sha256', key, '', 'Appsum Key Encryption', bitLength);
}

export async function encryptToken<Payload = JWT>(params: {
    token: Payload;
    secret: string;
    expirationDate: dayjs.Dayjs;
}) {
    const { token = {}, secret, expirationDate } = params;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    return await new EncryptJWT(token as unknown as JWTPayload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuedAt()
        .setExpirationTime(expirationDate.valueOf())
        .encrypt(encryptionSecret);
}

export async function decryptToken<Payload = JWT>(params: { token?: string; secret: string }): Promise<Payload | null> {
    const { token, secret } = params;
    if (!token) return null;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
    });
    return payload as Payload;
}
