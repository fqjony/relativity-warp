import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createHash } from "node:crypto";
import { marked } from "marked";

const root = fileURLToPath(new URL("../", import.meta.url));
const publishDir = path.join(root, "docs");
const source = fs.readFileSync(path.join(root, "src/pages/about.md"), "utf8");
const html = fs.readFileSync(path.join(publishDir, "about/index.html"), "utf8");
const canonical = "https://fqjony.com/about/";

test("About section titles inherit the shared notes styling", () => {
  const css = fs.readFileSync(path.join(root, "src/assets/index.css"), "utf8");
  assert.match(html, /class="article-content"/);
  assert.doesNotMatch(css, /\.about-page\s+\.article-content\s+h[23]\b/);
});

test("About renders its maintained Markdown source without article metadata", () => {
  const body = source.slice(source.indexOf("\n---", 3) + 4).trimStart();
  assert.ok(html.includes(marked.parse(body)), "Markdown body must reach the public page");
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /<h1 class="article-title">Dmytro Smirnov \(fqjony\)<\/h1>/);
  assert.match(html, /<main id="content"/);
  assert.match(html, /href="#content">Skip to content/);
  assert.match(html, /class="about-intro">[^<]+<\/p>/);
  assert.doesNotMatch(html, /article:published_time|status-draft|classification-badge|noindex/);
});

test("About has canonical, social, and person discovery metadata", () => {
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
  assert.ok(html.includes(`<meta property="og:url" content="${canonical}"`));
  assert.match(html, /<title>About Dmytro Smirnov \(fqjony\) \| Relativity Warp<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+"/);
  assert.match(html, /<meta name="twitter:card" content="summary"/);
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(json, "ProfilePage structured data must be present");
  const profile = JSON.parse(json);
  assert.equal(profile["@type"], "ProfilePage");
  assert.equal(profile.url, canonical);
  assert.equal(profile.mainEntity["@type"], "Person");
  assert.equal(profile.mainEntity["@id"], "https://fqjony.com/#person");
  assert.equal(profile.mainEntity.name, "Dmytro Smirnov");
  assert.equal(profile.mainEntity.alternateName, "fqjony");
  assert.equal(profile.mainEntity.url, canonical);
  assert.ok(fs.readFileSync(path.join(publishDir, "sitemap.xml"), "utf8").includes(`<loc>${canonical}</loc>`));
});

const htmlFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const fullPath = path.join(dir, entry.name);
  if (entry.isDirectory()) return htmlFiles(fullPath);
  return entry.name.endsWith(".html") ? [fullPath] : [];
});

test("Rendered pages use the stylesheet content version to avoid stale styles", () => {
  const version = createHash("sha256")
    .update(fs.readFileSync(path.join(root, "src/assets/index.css")))
    .digest("hex")
    .slice(0, 12);
  let checked = 0;
  for (const file of htmlFiles(publishDir)) {
    const page = fs.readFileSync(file, "utf8");
    for (const [, href] of page.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
      assert.equal(new URL(href, canonical).searchParams.get("v"), version, path.relative(root, file));
      checked += 1;
    }
  }
  assert.ok(checked > 2);
});

test("All shared navigation and footer instances expose About", () => {
  let checked = 0;
  for (const file of htmlFiles(publishDir)) {
    const page = fs.readFileSync(file, "utf8");
    for (const className of ["site-nav", "footer-links"]) {
      const navs = [...page.matchAll(new RegExp(`<nav class="${className}"[^>]*>([\\s\\S]*?)<\\/nav>`, "g"))];
      for (const [, nav] of navs) {
        assert.match(nav, /<a href="\/about\/"[^>]*>About me<\/a>/, path.relative(root, file));
        checked += 1;
      }
    }
  }
  assert.ok(checked > 2, "Check more than just the new page");
  assert.match(html, /href="\/about\/" aria-current="page"/);
});

test("About local links and its stylesheet resolve in the publishing tree", () => {
  const baseUrl = new URL(canonical);
  const links = [...html.matchAll(/\bhref="([^"]+)"/g)].map((match) => match[1]);
  for (const href of links) {
    const url = new URL(href, baseUrl);
    if (url.origin !== baseUrl.origin) continue;
    const target = path.join(publishDir, decodeURIComponent(url.pathname));
    const output = url.pathname.endsWith("/") ? path.join(target, "index.html") : target;
    assert.ok(fs.existsSync(output), `Missing About link target: ${href}`);
  }
});
