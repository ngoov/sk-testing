export type Awaitable<T> = T | PromiseLike<T>;

export interface DefaultJWT extends Record<string, unknown> {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
}

export interface JWT extends Record<string, unknown>, DefaultJWT {}
