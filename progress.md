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

## 2026-06-19 - Task: Deploy UUID168 converter and verify online output
### What was done
- Pushed local commit `74c747e fix: keep UUID168 converter compatible` to `furulei/cf` `main`.
- Deployed the `ip168-subconv` Cloudflare Worker for `sub.ip168.dpdns.org`.
- Verified that IP168 Clash and Sing-box subscription conversion now returns converted client config instead of the raw Base64 source subscription.

### Testing
- `git ls-remote origin refs/heads/main`: confirmed `origin/main` points to `74c747efba154ece0f7ee610e17d5ddd6635d91b`.
- `npx.cmd wrangler deploy`: passed; deployed `ip168-subconv` to custom domain `sub.ip168.dpdns.org`, current Worker version `321e45ec-10b0-416f-921a-a97478d8869f`.
- Online direct converter check: `/clash?config=<ip168 base64 source>` returned status 200, `text/yaml; charset=utf-8`, with Clash YAML sections and no leading Base64 `dmxlc3M` content.
- Online IP168 main check: `/sub?token=<redacted>&clash` returned status 200, `text/yaml; charset=utf-8`, with Clash YAML sections and no leading Base64 `dmxlc3M` content.
- Online IP168 Sing-box check: `/sub?token=<redacted>&sb` returned status 200, `application/json`, with Sing-box `outbounds`.

### Notes
- `progress.md`: appended the deployment and online verification record.
- Rollback: revert commit `74c747e` on `furulei/cf` or check out `a2a22f194401dbabba05b69070816a9f10d57ed0`, then redeploy `ip168-subconv` with `npx.cmd wrangler deploy`.

## 2026-06-19 - Task: Keep admin QR subscription names in sync
### What was done
- Updated the admin QR panel so the visible QR code is regenerated when the subscription name, token, or link format changes.
- Preserved the currently selected QR format while refreshing, so a Clash QR remains a Clash QR after the name changes.
- Documented that the subscription display name is carried in the URL fragment for scan clients.

### Testing
- `npm.cmd test`: 32 test files passed, 214 tests passed.
- `node -`: passed the admin QR name refresh check for default, renamed, and Clash-selected QR flows.
- `git diff --check`: passed with no whitespace errors.
