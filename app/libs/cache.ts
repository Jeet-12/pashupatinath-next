// libs/cache.ts
const cache = new Map();

export const cacheData = (key: string, data: any, ttl = 300000) => { // 5 minutes
    cache.set(key, {
        data,
        expiry: Date.now() + ttl
    });
};

export const getCachedData = (key: string) => {
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
        return cached.data;
    }
    cache.delete(key);
    return null;
};