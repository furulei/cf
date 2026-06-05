import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app/createApp.jsx';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';

const proxyUri = 'vless://add66666-8888-4888-8888-888888888888@example.com:443?encryption=none&security=tls&type=ws#Guard';

function createTestApp() {
    return createApp({
        kv: new MemoryKVAdapter(),
        assetFetcher: null,
        logger: console,
        config: {
            configTtlSeconds: 60,
            shortLinkTtlSeconds: null
        }
    });
}

function mockFetch() {
    vi.stubGlobal('fetch', vi.fn(async () => ({
        ok: true,
        status: 200,
        text: async () => proxyUri,
        headers: {
            get: () => null
        }
    })));
}

describe('ip168 remote source guard', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('allows HTTPS /sub subscription sources with a token', async () => {
        mockFetch();
        const app = createTestApp();
        const source = 'https://a.ip168.dpdns.org/sub?token=abc&b64';

        const res = await app.request(`http://localhost/clash?config=${encodeURIComponent(source)}`);

        expect(res.status).toBe(200);
        expect(await res.text()).toContain('Guard');
        expect(fetch).toHaveBeenCalledWith(source, expect.any(Object));
    });

    it('rejects non-HTTPS remote subscription sources before fetching them', async () => {
        mockFetch();
        const app = createTestApp();
        const source = 'http://a.ip168.dpdns.org/sub?token=abc&b64';

        const res = await app.request(`http://localhost/clash?config=${encodeURIComponent(source)}`);

        expect(res.status).toBe(400);
        expect(await res.text()).toContain('Remote subscription source must use HTTPS');
        expect(fetch).not.toHaveBeenCalled();
    });

    it('rejects localhost and IP literal subscription sources', async () => {
        mockFetch();
        const app = createTestApp();

        for (const source of [
            'https://localhost/sub?token=abc',
            'https://127.0.0.1/sub?token=abc',
            'https://[::1]/sub?token=abc'
        ]) {
            const res = await app.request(`http://localhost/singbox?config=${encodeURIComponent(source)}`);
            expect(res.status).toBe(400);
            expect(await res.text()).toContain('Remote subscription source host is not allowed');
        }
        expect(fetch).not.toHaveBeenCalled();
    });

    it('rejects non-subscription paths and sources without a token', async () => {
        mockFetch();
        const app = createTestApp();

        for (const source of [
            'https://a.ip168.dpdns.org/admin/config.json?token=abc',
            'https://a.ip168.dpdns.org/sub'
        ]) {
            const res = await app.request(`http://localhost/xray?config=${encodeURIComponent(source)}`);
            expect(res.status).toBe(400);
        }
        expect(fetch).not.toHaveBeenCalled();
    });
});
