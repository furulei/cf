import { afterEach, describe, expect, it, vi } from 'vitest';
import { createApp } from '../src/app/createApp.jsx';
import { MemoryKVAdapter } from '../src/adapters/kv/memoryKv.js';

const sourceUrl = 'https://uuid168.example/sub?token=test-token&b64=&v=2026-06-13-v6';
const uuid = '11111111-2222-4333-8444-555555555555';
const proxyUri = `vless://${uuid}@1.1.1.1:443?security=tls&sni=fake.example.com&type=ws&host=fake.example.com&path=%2F%3Fed%3D2560&encryption=none#UUID168-Test`;

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

function mockUuid168Subscription() {
    vi.stubGlobal('fetch', vi.fn(async requestUrl => {
        expect(String(requestUrl)).toBe(sourceUrl);
        return new Response(Buffer.from(proxyUri).toString('base64'), {
            status: 200,
            headers: {
                'content-type': 'text/plain; charset=utf-8',
                'subscription-userinfo': 'upload=0; download=0; total=0; expire=0'
            }
        });
    }));
}

describe('UUID168 converter interface', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('converts the existing /clash?config= contract', async () => {
        mockUuid168Subscription();
        const app = createTestApp();
        const query = new URLSearchParams({
            config: sourceUrl,
            selectedRules: 'balanced',
            group_by_country: 'true'
        });

        const response = await app.request(`http://localhost/clash?${query}`);
        const body = await response.text();

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/yaml');
        expect(response.headers.get('subscription-userinfo')).toContain('upload=0');
        expect(body).toContain(uuid);
        expect(body).toContain('UUID168-Test');
    });

    it('converts the existing /singbox?config= contract', async () => {
        mockUuid168Subscription();
        const app = createTestApp();
        const query = new URLSearchParams({
            config: sourceUrl,
            selectedRules: 'balanced',
            group_by_country: 'true',
            singbox_version: '1.12'
        });

        const response = await app.request(`http://localhost/singbox?${query}`, {
            headers: { 'User-Agent': 'sing-box/1.13.0' }
        });
        const body = await response.json();
        const node = body.outbounds.find(outbound => outbound.tag === 'UUID168-Test');

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/json');
        expect(response.headers.get('subscription-userinfo')).toContain('upload=0');
        expect(node?.uuid).toBe(uuid);
        expect(node?.network).toBeUndefined();
    });
});
