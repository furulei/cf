import { describe, it, expect } from 'vitest';
import { SingboxConfigBuilder } from '../src/builders/SingboxConfigBuilder.js';

describe('sing-box DNS routing order', () => {
    const vlessUrl = 'vless://12345678-1234-1234-1234-123456789abc@example.com:443?security=tls&sni=example.com#TestVless';

    it('keeps DNS hijacking before clash mode rules', async () => {
        const builder = new SingboxConfigBuilder(vlessUrl, [], [], null, 'zh-CN', null, false);
        const result = await builder.build();
        const rules = result.route.rules;

        const dnsHijackIndex = rules.findIndex(rule => rule.action === 'hijack-dns' && rule.protocol === 'dns');
        const clashModeIndex = rules.findIndex(rule => rule.clash_mode);

        expect(dnsHijackIndex).toBeGreaterThanOrEqual(0);
        expect(clashModeIndex).toBeGreaterThanOrEqual(0);
        expect(dnsHijackIndex).toBeLessThan(clashModeIndex);
    });

    it('keeps sniffing before DNS hijacking', async () => {
        const builder = new SingboxConfigBuilder(vlessUrl, [], [], null, 'zh-CN', null, false);
        const result = await builder.build();
        const rules = result.route.rules;

        const sniffIndex = rules.findIndex(rule => rule.action === 'sniff' && !rule.protocol);
        const dnsHijackIndex = rules.findIndex(rule => rule.action === 'hijack-dns');

        expect(sniffIndex).toBeGreaterThanOrEqual(0);
        expect(sniffIndex).toBeLessThan(dnsHijackIndex);
    });
});
