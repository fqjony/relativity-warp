import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "src", "docs");
const homepagePath = path.join(rootDir, "src", "templates", "index.html");
const publishDir = path.join(rootDir, "docs");
const publicSpectrumDir = path.join(publishDir, "spectrum");
const indexOutputPath = path.join(publicSpectrumDir, "articles.json");

const markerStart = "<!-- RESEARCH:START -->";
const markerEnd = "<!-- RESEARCH:END -->";

const cleanText = (value) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const parseFrontmatter = (contents) => {
  if (!contents.startsWith("---")) return { body: contents, meta: {} };
  const end = contents.indexOf("\n---", 3);
  if (end === -1) return { body: contents, meta: {} };
  const raw = contents.slice(3, end).trim();
  const body = contents.slice(end + 4).trimStart();
  const meta = {};
  raw.split("\n").forEach((line) => {
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.+)$/);
    if (match) {
      meta[match[1]] = match[2].replace(/^["']|["']$/g, "").trim();
    }
  });
  return { body, meta };
};

const normalizeSlug = (value) =>
  value
    .split("/")
    .map((segment) => segment.replace(/^\d+_/, ""))
    .join("/");

const extractTitle = (contents, fallback) => {
  const { body, meta } = parseFrontmatter(contents);
  if (meta.title) return meta.title;
  const match = body.match(/^#\s+(.+)$/m);
  if (match) return cleanText(match[1]);
  return fallback;
};

const extractDescription = (contents) => {
  const { body, meta } = parseFrontmatter(contents);
  if (meta.description) return meta.description;
  const paragraph = body.split("\n").find((line) => line.trim().length > 0);
  return paragraph ? cleanText(paragraph) : "";
};

const extractType = (contents) => {
  const { meta } = parseFrontmatter(contents);
  return meta.type ? meta.type.toLowerCase() : "note";
};

const extractDate = (contents) => {
  const { meta } = parseFrontmatter(contents);
  return meta.date || "";
};

const listMarkdownFiles = (dir) => {
  const entries = [];
  const stack = [dir];

  while (stack.length) {
    const current = stack.pop();
    const items = fs.readdirSync(current, { withFileTypes: true });
    for (const item of items) {
      const itemPath = path.join(current, item.name);
      if (item.isDirectory()) {
        stack.push(itemPath);
        continue;
      }
      if (item.isFile() && item.name.endsWith(".md")) {
        entries.push(itemPath);
      }
    }
  }

  return entries;
};

const copyDir = (source, target) => {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
      continue;
    }
    if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const renderArticleTemplate = ({ title, description, content, cssHref, homeHref, canonicalHref, type }) => {
  const canonical = canonicalHref || "";
  const typeBadge = type ? `<span class="type-badge type-${type}">${type}</span>` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Relativity Warp</title>
    <meta name="description" content="${description || `Research note: ${title}`}" />
    <link rel="stylesheet" href="${cssHref}" />
    ${canonical ? `<link rel="canonical" href="${canonical}" />` : ""}
  </head>
  <body data-theme="dark">
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="hero">
        <h1 class="hero-title">${title}</h1>
        <p class="hero-subtitle">Research note</p>
        <div class="hero-meta">
          ${typeBadge}
        </div>
        <div class="hero-links">
          <a href="${homeHref}" class="button button-compact button-ghost">Back to Home</a>
        </div>
      </header>
      <main id="content">
        <section class="section card">
          <div class="section-body">
            <div class="article-content">
              ${content}
            </div>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>
`;
};

const buildResearch = () => {
  if (!fs.existsSync(docsDir)) {
    console.error("docs directory not found");
    process.exit(1);
  }

  const markdownItems = listMarkdownFiles(docsDir)
    .map((filePath) => {
      const relPath = path.relative(rootDir, filePath).replace(/\\/g, "/");
      const raw = fs.readFileSync(filePath, "utf8");
      const fallback = path
        .basename(filePath, ".md")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
      const title = extractTitle(raw, fallback);
      const description = extractDescription(raw);
      const relativeSlug = normalizeSlug(
        relPath.replace(/^src\/docs\//, "").replace(/\.md$/, "")
      );
      const htmlPath = path.join("spectrum", relativeSlug, "index.html").replace(/\\/g, "/");
      const outputPath = path.join(publishDir, htmlPath);
      const url = `/spectrum/${relativeSlug}/`;
      const type = extractType(raw);
      const date = extractDate(raw);
      return {
        title,
        description,
        path: htmlPath,
        url,
        sourcePath: filePath,
        outputPath,
        raw,
        type,
        date,
        kind: "markdown",
      };
    })
    .sort((a, b) => {
      const dateA = a.date ? Date.parse(a.date) : 0;
      const dateB = b.date ? Date.parse(b.date) : 0;
      if (!Number.isNaN(dateA) || !Number.isNaN(dateB)) {
        if (dateA !== dateB) return dateB - dateA;
      }
      return a.title.localeCompare(b.title);
    });

  const items = markdownItems;

  items.forEach((item) => {
    if (item.kind !== "markdown") return;
    const { body } = parseFrontmatter(item.raw);
    const strippedBody = body.replace(/^# .+?\n+/, "");
    const content = marked.parse(strippedBody);
    const outputPath = item.outputPath;
    const cssHref = path
      .relative(path.dirname(outputPath), path.join(publishDir, "assets", "index.css"))
      .replace(/\\/g, "/");
    const homeHref = path
      .relative(path.dirname(outputPath), path.join(publishDir, "index.html"))
      .replace(/\\/g, "/");
    const canonical = item.url;
    const html = renderArticleTemplate({
      title: item.title,
      description: item.description,
      content,
      cssHref: cssHref || "assets/index.css",
      homeHref: homeHref || "index.html",
      canonicalHref: canonical,
      type: item.type,
    });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, "utf8");
  });

  const payload = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    items: items.map(({ title, path: entryPath, url, type, date }) => ({
      title,
      path: entryPath,
      url,
      type,
      date,
    })),
  };

  fs.mkdirSync(path.dirname(indexOutputPath), { recursive: true });
  fs.writeFileSync(indexOutputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  const types = payload.items.reduce((acc, item) => {
    const key = item.type || "note";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  fs.writeFileSync(
    path.join(publicSpectrumDir, "types.json"),
    JSON.stringify({ schemaVersion: 1, generatedAt: payload.generatedAt, types }, null, 2) + "\n",
    "utf8"
  );
  Object.entries(types).forEach(([type, typeItems]) => {
    const typeDir = path.join(publicSpectrumDir, type);
    fs.mkdirSync(typeDir, { recursive: true });
    fs.writeFileSync(
      path.join(typeDir, "index.json"),
      JSON.stringify({ schemaVersion: 1, generatedAt: payload.generatedAt, items: typeItems }, null, 2) + "\n",
      "utf8"
    );
  });
  return payload.items;
};

const renderResearchList = (items) => {
  if (!items.length) {
    return `  <li class="list-item">No research published yet.</li>`;
  }
  return items
    .map((item) => {
      const href = item.url || item.path || "#";
      const badge = item.type ? `<span class="type-badge type-${item.type}">${item.type}</span>` : "";
      return `  <li class="list-item"><a href="${href}">${item.title}</a>${badge}</li>`;
    })
    .join("\n");
};

const updateHomepage = (items) => {
  const homepageOutputPath = path.join(publishDir, "index.html");
  if (!fs.existsSync(homepagePath)) {
    console.warn("index.html not found; skipping homepage update.");
    return;
  }
  const raw = fs.readFileSync(homepagePath, "utf8");
  const start = raw.indexOf(markerStart);
  const end = raw.indexOf(markerEnd);
  if (start === -1 || end === -1 || end <= start) {
    console.warn("Research markers not found in index.html; skipping update.");
    return;
  }

  const before = raw.slice(0, start + markerStart.length);
  const after = raw.slice(end);
  const list = `\n${renderResearchList(items)}\n`;
  const updated = `${before}${list}${after}`;
  fs.mkdirSync(path.dirname(homepageOutputPath), { recursive: true });
  fs.writeFileSync(homepageOutputPath, updated, "utf8");
};

const renderSpectrumIndex = (items) => {
  const list = renderResearchList(items);
  const types = items.reduce((acc, item) => {
    const key = item.type || "note";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
  const typeSections = Object.entries(types)
    .map(([type, entries]) => {
      return `            <div class="subsection">\n` +
        `              <div class="subsection-title">${type}</div>\n` +
        `              <ul class="link-list" role="list">\n${renderResearchList(entries)}\n              </ul>\n` +
        `            </div>`;
    })
    .join("\n");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Spectrum - Relativity Warp</title>
    <meta name="description" content="Spectrum articles and notes." />
    <link rel="stylesheet" href="/assets/index.css" />
  </head>
  <body data-theme="dark">
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="hero">
        <h1 class="hero-title">Spectrum</h1>
        <p class="hero-subtitle">Articles, research, and discovery notes.</p>
        <div class="hero-links">
          <a href="/index.html" class="button button-compact button-ghost">Back to Home</a>
        </div>
      </header>
      <main id="content">
        <section class="section card">
          <div class="section-body">
            <ul class="link-list" role="list">
${list}
            </ul>
${typeSections}
            <div class="subsection">
              <div class="subsection-title">Data</div>
              <ul class="link-list" role="list">
                <li class="list-item">
                  <a href="/tips.json">Engineering Tips (JSON)</a>
                </li>
                <li class="list-item">
                  <a href="/spectrum/articles.json">Spectrum Index (JSON)</a>
                </li>
                <li class="list-item">
                  <a href="/spectrum/types.json">Spectrum Types (JSON)</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  </body>
</html>
`;
};

const items = buildResearch();
updateHomepage(items);
fs.mkdirSync(publicSpectrumDir, { recursive: true });
fs.writeFileSync(
  path.join(publicSpectrumDir, "index.html"),
  renderSpectrumIndex(items),
  "utf8"
);
copyDir(path.join(rootDir, "src", "assets"), path.join(publishDir, "assets"));
const dataViewerSource = path.join(rootDir, "src", "templates", "data-viewer.html");
if (fs.existsSync(dataViewerSource)) {
  fs.copyFileSync(dataViewerSource, path.join(publishDir, "data-viewer.html"));
}
if (fs.existsSync(path.join(rootDir, "CNAME"))) {
  fs.copyFileSync(path.join(rootDir, "CNAME"), path.join(publishDir, "CNAME"));
}
console.log(`Built ${items.length} research item(s).`);
