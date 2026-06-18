# UUID168 Converter Interface

## Deployment

The `furulei/cf` repository deploys the converter Worker served by:

```text
https://sub.ip168.dpdns.org
```

UUID168 continues to generate Mixed and Base64 subscriptions itself. It sends only Clash and Sing-box conversions to this Worker, so the UUID168 Worker and frontend do not need source changes while this contract remains stable.

## Endpoints

### Clash

```text
GET /clash?config=<URL-encoded subscription URL>
```

The response is Clash YAML with `Content-Type: text/yaml; charset=utf-8`.

### Sing-box

```text
GET /singbox?config=<URL-encoded subscription URL>
```

The response is Sing-box JSON with `Content-Type: application/json; charset=utf-8`.

The converter supports both legacy Sing-box 1.11 configuration and the 1.12+ schema. The version can be selected through `singbox_version`, `sb_version`, or `sb_ver`; otherwise it is inferred from the client User-Agent.

## Forwarded Options

The current UUID168 caller may include these existing query parameters:

- `selectedRules`
- `group_by_country`
- `customRules`
- `include_auto_select`
- `enable_clash_ui`
- `external_controller`
- `external_ui_download_url`
- `singbox_version`, `sb_version`, or `sb_ver`
- `ua`
- `configId`

The converter also preserves the upstream `subscription-userinfo` response header.

## Compatibility Guard

`test/uuid168-interface.test.js` pins both endpoint contracts with a Base64 VLESS subscription shaped like the current UUID168 source response. `test/singbox-route-order.test.js` and `test/issue-297-vmess-network.test.js` guard Sing-box UDP and DNS behavior for current clients.

## Verification

```bash
npm test
npx wrangler deploy --dry-run
npm audit
```
