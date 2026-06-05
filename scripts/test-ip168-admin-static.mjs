import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const adminPath = join(root, "admin", "index.html");
const rootPath = join(root, "index.html");

assert.ok(existsSync(adminPath), "admin/index.html should exist");

const html = readFileSync(adminPath, "utf8");

assert.match(html, /<!--IP168_BOOTSTRAP-->/);
assert.match(html, /window\.IP168_BOOTSTRAP/);
assert.match(html, /bootstrap\.endpoints\.state/);
assert.match(html, /bootstrap\.endpoints\.save/);
assert.match(html, /bootstrap\.endpoints\.entries/);
assert.match(html, /bootstrap\.endpoints\.proxyTest/);
assert.match(html, /bootstrap\.endpoints\.proxyAuto/);
assert.match(html, /bootstrap\.endpoints\.proxyRun/);
assert.match(html, /bootstrap\.catalog\.summaryUrl/);
assert.match(html, /bootstrap\.catalog\.queryUrl/);
assert.match(html, /bootstrap\.subPath/);
assert.match(html, /168\.txt/);
assert.doesNotMatch(html, /ADD\.txt/);
assert.match(html, /https:\/\/furulei\.github\.io\/cf\/vendor\/qrcode\.min\.js/);
assert.match(html, /DEFAULT_SUB_NAME\s*=\s*"\\u5f52\\u6765\\u662f\\u5c11\\u5e74"/);
assert.doesNotMatch(html, /edgetunnel/);
assert.doesNotMatch(html, /a\.ip168\.dpdns\.org\/a/);
assert.doesNotMatch(html, /adminPassword/);
assert.doesNotMatch(html, /\/admin\/config\.json/);
assert.doesNotMatch(html, /\/a\/config\.json/);

for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
  new Function(match[1]);
}

const rootHtml = readFileSync(rootPath, "utf8");
assert.doesNotMatch(rootHtml, /a\.ip168\.dpdns\.org\/a/);
assert.doesNotMatch(rootHtml, /adminPassword/);
assert.doesNotMatch(rootHtml, /\/config\.json/);
assert.match(rootHtml, /admin\/?/);

console.log("ip168 admin static source checks passed");
