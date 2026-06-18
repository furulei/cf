## 2026-06-19 - Task: Keep the remote converter compatible with UUID168
### What was done
- Preserved the existing `/clash?config=` and `/singbox?config=` contracts used by UUID168.
- Applied the upstream Sing-box UDP and DNS routing fix for current 1.13 clients without changing UUID168, its frontend, or its subscription URLs.
- Upgraded the conversion and Cloudflare toolchain dependencies with security advisories and corrected the KV binding placement in the deployment configuration.
- Added explicit UUID168 interface regression coverage and documented the stable remote contract.

### Testing
- `npm test`: 32 test files passed, 214 tests passed.
- `npx wrangler deploy --dry-run --outdir dist/cf`: passed; upload 537.24 KiB, gzip 107.08 KiB, and `SUBLINK_KV` was recognized.
- Targeted UUID168, subscription header, Sing-box UDP, and DNS order tests: 4 files passed, 13 tests passed.
- `npm audit --omit=dev --json`: 0 production vulnerabilities after dependency updates.
- `npm audit --json`: 0 vulnerabilities across production and development dependencies.

### Notes
- `README.md`: documented the UUID168-compatible remote converter endpoints.
- `docs/uuid168-interface.md`: recorded the endpoint, option, version, and verification contract.
- `package.json`: upgraded Hono, js-yaml, esbuild, Wrangler, and the Workers Vitest pool.
- `package-lock.json`: locked the verified dependency graph.
- `src/builders/SingboxConfigBuilder.js`: removed accidental TCP-only output and ordered DNS interception before global mode.
- `src/parsers/protocols/shadowsocksParser.js`: stopped forcing TCP-only Sing-box output.
- `src/parsers/protocols/trojanParser.js`: stopped forcing TCP-only Sing-box output.
- `src/parsers/protocols/vlessParser.js`: preserved Clash UDP flags without restricting Sing-box to TCP.
- `src/parsers/protocols/vmessParser.js`: stopped forcing TCP-only Sing-box output.
- `test/issue-297-vmess-network.test.js`: updated the network-field regression expectations.
- `test/singbox-route-order.test.js`: added DNS interception ordering coverage.
- `test/uuid168-interface.test.js`: added the exact Clash and Sing-box contracts used by UUID168.
- `wrangler.toml`: moved `SUBLINK_KV` to the valid top-level binding location.
- `progress.md`: appended this implementation and verification record.
- Rollback: run `git revert HEAD` after this task is committed.
