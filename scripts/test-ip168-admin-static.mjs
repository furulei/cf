import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const adminPath = join(root, "admin", "index.html");
const rootPath = join(root, "index.html");

const html = readFileSync(adminPath, "utf8");
const rootHtml = readFileSync(rootPath, "utf8");
const compactQrCss = html.match(/\.compact-qr-panel\s*{([^}]*)}/)?.[1] || "";

assert.match(html, /<!--IP168_BOOTSTRAP-->/);
assert.match(html, /window\.IP168_BOOTSTRAP/);
assert.match(html, /bootstrap\.endpoints\.state/);
assert.match(html, /bootstrap\.endpoints\.save/);
assert.match(html, /bootstrap\.endpoints\.logout/);
assert.match(html, /bootstrap\.endpoints\.proxyTest/);
assert.match(html, /bootstrap\.endpoints\.proxyAuto/);
assert.match(html, /bootstrap\.endpoints\.proxyRun/);
assert.match(html, /bootstrap\.catalog\.summaryUrl/);
assert.match(html, /bootstrap\.catalog\.queryUrl/);
assert.match(html, /bootstrap\.subPath/);

assert.match(html, /function readConfigFromForm\(\)/);
assert.match(html, /proxy\.PROXYIP = fields\.proxyip\.value\.trim\(\);/);
assert.match(html, /sub\.TOKEN = fields\.token\.value\.trim\(\);/);
assert.match(html, /sub\.SUBNAME = fields\.subName\.value\.trim\(\) \|\| DEFAULT_SUB_NAME;/);
assert.match(html, /function makeSubLink\(flag\)/);
assert.match(html, /url\.searchParams\.set\("token", token\);/);
assert.doesNotMatch(html, /proxyip=/);
assert.doesNotMatch(html, /fields\.proxyip\.value.*makeSubLink/);

assert.match(html, /168\.txt/);
assert.doesNotMatch(html, /ADD\.txt/);
assert.match(html, /https:\/\/furulei\.github\.io\/cf\/vendor\/qrcode\.min\.js/);
assert.match(html, /DEFAULT_SUB_NAME\s*=\s*"\\u5f52\\u6765\\u662f\\u5c11\\u5e74"/);
assert.doesNotMatch(html, /edgetunnel/);

assert.match(html, /id="logoutButton"/);
assert.doesNotMatch(html, /id="copyQrText"/);
assert.doesNotMatch(html, /复制当前链接/);
assert.doesNotMatch(html, /复制给客户端后/);
assert.doesNotMatch(html, /当前二维码内容/);
assert.doesNotMatch(html, /id="qrText"/);
assert.doesNotMatch(html, /id="openSub"/);
assert.doesNotMatch(html, /window\.open\(state\.qrUrl/);

assert.match(html, /class="panel compact-qr-panel"/);
assert.match(html, /class="layout subscription-layout"/);
assert.match(html, /\.subscription-layout\s*{\s*align-items: stretch;\s*}/);
assert.doesNotMatch(html, /<h2>二维码<\/h2>/);
assert.match(html, /class="qr-controls"/);
assert.match(html, /class="qr-title"/);
assert.match(html, /\.qr-title\s*{[\s\S]*font-size: 18px;[\s\S]*color: var\(--text\)/);
assert.match(compactQrCss, /align-self: stretch;/);
assert.match(compactQrCss, /display: grid;/);
assert.match(compactQrCss, /place-items: center;/);
assert.match(compactQrCss, /position: relative;/);
assert.match(compactQrCss, /min-height: 286px;/);
assert.doesNotMatch(compactQrCss, /width: max-content;/);
assert.doesNotMatch(compactQrCss, /background: transparent;/);
assert.match(html, /\.qr-box\s*{[\s\S]*width: 204px;[\s\S]*height: 204px;/);
assert.match(html, /<canvas id="qrCanvas" width="196" height="196"><\/canvas>/);
assert.match(html, /window\.QRCode\.toCanvas\(canvas, state\.qrUrl, \{\s*width: 196,/);

assert.match(html, /color-scheme: dark/);
assert.match(html, /--panel: rgba\(255, 255, 255, 0\.035\)/);
assert.match(html, /--line: rgba\(255, 255, 255, 0\.78\)/);
assert.match(html, /body::before,\s*body::after/);
assert.match(html, /input,\s*select,\s*button\s*{[\s\S]*width: min\(360px, 100%\);[\s\S]*background: var\(--control-bg\)/);
assert.match(html, /button\.secondary,\s*button\.ghost,\s*button\.warn/);
assert.doesNotMatch(html, /button\.secondary\s*{\s*color: var\(--blue\);/);
assert.doesNotMatch(html, /button\.warn\s*{\s*color: var\(--amber\);/);

assert.match(html, /<h1>无法找到入口<\/h1>/);
assert.match(html, /document\.body\.classList\.add\("missing-entry"\)/);
assert.match(html, /app\.className = "direct-open direct-missing"/);
assert.doesNotMatch(html, /请通过你自己的 Worker 后台入口打开本页/);

assert.doesNotMatch(html, /a\.ip168\.dpdns\.org\/a/);
assert.doesNotMatch(html, /adminPassword/);
assert.doesNotMatch(html, /\/admin\/config\.json/);
assert.doesNotMatch(html, /\/a\/config\.json/);
assert.doesNotMatch(html, /login-preview/);
assert.doesNotMatch(html, /logged-in-preview/);
assert.doesNotMatch(html, /preview-bootstrap/);

assert.match(html, /https:\/\/furulei\.github\.io\/cf\/vendor\/qrcode\.min\.js/);

for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
  new Function(match[1]);
}

assert.doesNotMatch(rootHtml, /a\.ip168\.dpdns\.org\/a/);
assert.doesNotMatch(rootHtml, /adminPassword/);
assert.doesNotMatch(rootHtml, /\/config\.json/);
assert.match(rootHtml, /admin\/?/);

console.log("ip168 admin static source checks passed");
