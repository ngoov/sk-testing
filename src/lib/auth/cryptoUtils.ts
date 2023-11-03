import { EncryptJWT, jwtDecrypt, type JWTPayload } from 'jose';
import { hkdf } from '@panva/hkdf';
import dayjs from 'dayjs';
import type { Awaitable, JWT } from './types';


const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

async function getDerivedEncryptionKey(key: string, bitLength = 32) {
    return await hkdf('sha256', key, '', 'Appsum Key Encryption', bitLength);
}

/**
 * Encrypt a JWT payload
 * @param params 
 * @returns 
 */
async function encryptToken<Payload = JWT>(params: JWTEncodeParams<Payload>) {
    const { token = {}, secret, maxAge = DEFAULT_MAX_AGE } = params;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    
    console.log(`About to encrypt token`)

    return await new EncryptJWT(token as unknown as JWTPayload)
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .setIssuedAt()
        .setExpirationTime(dayjs().add(maxAge).valueOf())
        .setJti(crypto.randomUUID())
        .encrypt(encryptionSecret);
}

/**
 * Decode a JWT/JWE Compact payload
 * @param params 
 * @returns 
 */
export async function decryptToken<Payload = JWT>(
    params: JWTDecodeParams,
): Promise<Payload | null> {
    const { token, secret } = params;
    if (!token) return null;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    const { payload } = await jwtDecrypt(token, encryptionSecret, {
        clockTolerance: 15,
    });
    return payload as Payload;
}


export interface JWTEncodeParams<Payload = JWT> {
    /** The JWT payload. */
    token?: Payload;
    /** The secret used to encode the Auth.js issued JWT. */
    secret: string;
    /**
     * The maximum age of the Auth.js issued JWT in seconds.
     *
     * @default 30 * 24 * 60 * 60 // 30 days
     */
    maxAge?: number;
}

export interface JWTDecodeParams {
    /** The Auth.js issued JWT to be decoded */
    token?: string;
    /** The secret used to decode the Auth.js issued JWT. */
    secret: string;
}

export interface JWTOptions {
    /**
     * The secret used to encode/decode the Auth.js issued JWT.
     *
     * @deprecated  Set the `AUTH_SECRET` environment variable or
     * use the top-level `secret` option instead
     */
    secret: string;
    /**
     * The maximum age of the Auth.js issued JWT in seconds.
     *
     * @default 30 * 24 * 60 * 60 // 30 days
     */
    maxAge: number;
    /** Override this method to control the Auth.js issued JWT encoding. */
    encode: (params: JWTEncodeParams) => Awaitable<string>;
    /** Override this method to control the Auth.js issued JWT decoding. */
    decode: (params: JWTDecodeParams) => Awaitable<JWT | null>;
}
