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

const DOC_KIND = "doc";
const markerStart = "<!-- RESEARCH:START -->";
const markerEnd = "<!-- RESEARCH:END -->";
const legacyTypeBuckets = ["article", "note", "research", "discovery"];
const legacyTypeFiles = ["types.json"];
const legacyDataFiles = ["engineering-tips.json"];

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

const extractStatus = (contents) => {
  const { meta } = parseFrontmatter(contents);
  const status = (meta.status || "").toLowerCase();

  if (status === "draft") {
    return "draft";
  }

  if (status === "published") {
    return "published";
  }

  if (meta.type) {
    return "published";
  }

  return "published";
};

const extractLabels = (contents) => {
  const { meta } = parseFrontmatter(contents);
  if (!meta.labels) return [];
  return meta.labels
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
};

const extractDate = (contents) => {
  const { meta } = parseFrontmatter(contents);
  return meta.datetime || meta.date || "";
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

const renderLabelChips = (labels = []) => {
  if (!labels.length) return "";
  return labels.map((label) => `<span class="label-chip">${label}</span>`).join("");
};

const renderArticleTemplate = ({ title, description, content, cssHref, homeHref, canonicalHref, labels, status, date }) => {
  const canonical = canonicalHref || "";
  const labelChips = renderLabelChips(labels);
  const statusLabel = status === "draft" ? "Draft" : "Published";
  const statusBadge = `<span class="status-badge status-${status}">${statusLabel}</span>`;
  const dateMeta = date ? `<span class="doc-date">${date}</span>` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Relativity Warp</title>
    <meta name="description" content="${description || `Document: ${title}`}" />
    <link rel="stylesheet" href="${cssHref}" />
    ${canonical ? `<link rel="canonical" href="${canonical}" />` : ""}
  </head>
  <body data-theme="dark" class="spectrum-page">
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="hero">
        <div class="hero-top">
          <h1 class="hero-title">${title}</h1>
          <div class="hero-links">
            <a href="${homeHref}" class="button button-compact button-ghost">Back to Home</a>
          </div>
        </div>
        <p class="hero-subtitle">${statusLabel} doc</p>
        <div class="hero-meta">
          ${statusBadge}
          ${dateMeta}
          <div class="label-list">
            ${labelChips}
          </div>
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
      <footer class="footer">
        <p class="motto">
          <a
            href="https://github.com/fqjony/relativity-warp"
            target="_blank"
            rel="noopener"
            >GitHub repo</a
          >
        </p>
        <p class="motto">© 2026 Dmytro Smirnov. All rights reserved.</p>
      </footer>
    </div>
  </body>
</html>
`;
};

const toItemPayload = ({
  title,
  slug,
  sourcePath,
  path: entryPath,
  url,
  status,
  date,
  labels,
}) => ({
  title,
  kind: DOC_KIND,
  slug,
  sourcePath,
  path: entryPath,
  url,
  status,
  date,
  labels,
});

const writeStatusIndexes = (generatedAt, items) => {
  const statuses = items.reduce(
    (acc, item) => {
      const key = item.status || "draft";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    { published: [], draft: [] }
  );

  fs.writeFileSync(
    path.join(publicSpectrumDir, "statuses.json"),
    JSON.stringify({ schemaVersion: 1, generatedAt, statuses }, null, 2) + "\n",
    "utf8"
  );

  Object.entries(statuses).forEach(([status, statusItems]) => {
    const statusDir = path.join(publicSpectrumDir, status);
    fs.mkdirSync(statusDir, { recursive: true });
    fs.writeFileSync(
      path.join(statusDir, "index.json"),
      JSON.stringify({ schemaVersion: 1, generatedAt, status, items: statusItems }, null, 2) + "\n",
      "utf8"
    );
  });
};

const writeTypeIndex = (generatedAt, items) => {
  const types = { [DOC_KIND]: items };
  fs.writeFileSync(
    path.join(publicSpectrumDir, "types.json"),
    JSON.stringify({ schemaVersion: 1, generatedAt, types }, null, 2) + "\n",
    "utf8"
  );

  const docTypeDir = path.join(publicSpectrumDir, DOC_KIND);
  fs.mkdirSync(docTypeDir, { recursive: true });
  fs.writeFileSync(
    path.join(docTypeDir, "index.json"),
    JSON.stringify({ schemaVersion: 1, generatedAt, type: DOC_KIND, items }, null, 2) + "\n",
    "utf8"
  );
};

const buildDataCatalog = (generatedAt) => {
  const datasets = [
    {
      name: "Spectrum Documents",
      title: "Spectrum Documents",
      description: "All spectrum docs with status metadata.",
      category: "Spectrum",
      format: "json",
      path: "spectrum/articles.json",
    },
    {
      name: "Spectrum Types",
      title: "Spectrum Types",
      description: "Single doc type index.",
      category: "Spectrum",
      format: "json",
      path: "spectrum/types.json",
    },
    {
      name: "Spectrum Statuses",
      title: "Spectrum Statuses",
      description: "Published and draft status indexes.",
      category: "Spectrum",
      format: "json",
      path: "spectrum/statuses.json",
    },
    {
      name: "Published Docs",
      title: "Published Docs",
      description: "Published documents only.",
      category: "Spectrum",
      format: "json",
      path: "spectrum/published/index.json",
    },
    {
      name: "Draft Docs",
      title: "Draft Docs",
      description: "Draft notes, visible in UI and JSON indexes.",
      category: "Spectrum",
      format: "json",
      path: "spectrum/draft/index.json",
    },
  ];

  const tipsPath = path.join(publishDir, "tips.json");
  if (fs.existsSync(tipsPath)) {
    datasets.push({
      name: "Engineering Tips",
      title: "Engineering Tips",
      description: "Curated engineering guidance grouped by domain.",
      category: "Common",
      format: "json",
      path: "tips.json",
    });
  }

  fs.writeFileSync(path.join(publicSpectrumDir, "index.json"), JSON.stringify(datasets, null, 2) + "\n", "utf8");

  const all = {
    generatedAt,
    items: datasets.map((entry) => {
      const absolutePath = path.join(publishDir, entry.path);
      let payload = null;
      if (fs.existsSync(absolutePath)) {
        try {
          payload = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
        } catch {
          payload = null;
        }
      }
      return {
        ...entry,
        payload,
      };
    }),
  };

  fs.writeFileSync(path.join(publicSpectrumDir, "all.json"), JSON.stringify(all, null, 2) + "\n", "utf8");
};

const cleanupLegacyOutputs = () => {
  legacyTypeBuckets.forEach((bucket) => {
    fs.rmSync(path.join(publicSpectrumDir, bucket), { recursive: true, force: true });
  });
  legacyTypeFiles.forEach((fileName) => {
    fs.rmSync(path.join(publicSpectrumDir, fileName), { force: true });
  });
  legacyDataFiles.forEach((fileName) => {
    fs.rmSync(path.join(publicSpectrumDir, fileName), { force: true });
  });
};

const cleanupStaleDocPages = (items) => {
  const expectedPageDirs = new Set(
    items
      .map((item) => (item.path || "").replace(/^spectrum\//, "").replace(/\/index\.html$/, ""))
      .filter(Boolean)
  );

  const previousIndexPath = path.join(publicSpectrumDir, "articles.json");
  if (!fs.existsSync(previousIndexPath)) {
    return;
  }

  let previousItems = [];
  try {
    const parsed = JSON.parse(fs.readFileSync(previousIndexPath, "utf8"));
    previousItems = Array.isArray(parsed.items) ? parsed.items : [];
  } catch {
    previousItems = [];
  }

  const previousPageDirs = new Set(
    previousItems
      .map((item) => {
        return (item?.path || "").replace(/^spectrum\//, "").replace(/\/index\.html$/, "");
      })
      .filter(Boolean)
  );

  previousPageDirs.forEach((pageDir) => {
    if (!expectedPageDirs.has(pageDir)) {
      fs.rmSync(path.join(publicSpectrumDir, pageDir), { recursive: true, force: true });
    }
  });
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
      const status = extractStatus(raw);
      const date = extractDate(raw);
      const labels = extractLabels(raw);
      return {
        title,
        description,
        slug: relativeSlug,
        sourcePath: relPath,
        path: htmlPath,
        outputPath,
        url,
        raw,
        status,
        date,
        labels,
        kind: DOC_KIND,
      };
    })
    .sort((a, b) => {
      const parsedA = a.date ? Date.parse(a.date) : Number.NaN;
      const parsedB = b.date ? Date.parse(b.date) : Number.NaN;
      const dateA = Number.isNaN(parsedA) ? 0 : parsedA;
      const dateB = Number.isNaN(parsedB) ? 0 : parsedB;
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      return a.title.localeCompare(b.title);
    });

  cleanupStaleDocPages(markdownItems);

  markdownItems.forEach((item) => {
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
      labels: item.labels,
      status: item.status,
      date: item.date,
    });
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, "utf8");
  });

  const generatedAt = new Date().toISOString();
  const payloadItems = markdownItems.map(toItemPayload);
  const payload = {
    schemaVersion: 1,
    generatedAt,
    docType: DOC_KIND,
    items: payloadItems,
  };

  fs.mkdirSync(path.dirname(indexOutputPath), { recursive: true });
  cleanupLegacyOutputs();
  fs.writeFileSync(indexOutputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  writeTypeIndex(generatedAt, payloadItems);
  writeStatusIndexes(generatedAt, payloadItems);
  buildDataCatalog(generatedAt);

  return {
    allItems: payloadItems,
    publishedItems: payloadItems.filter((item) => item.status === "published"),
    draftItems: payloadItems.filter((item) => item.status === "draft"),
  };
};

const renderResearchList = (items) => {
  if (!items.length) {
    return `  <li class="list-item">No docs yet.</li>`;
  }
  return items
    .map((item) => {
      const href = item.url || item.path || "#";
      const statusLabel = item.status === "draft" ? "Draft" : "Published";
      const statusBadge = `<span class="status-badge status-${item.status}">${statusLabel}</span>`;
      const labels = item.labels?.length
        ? `<div class="label-list">${item.labels
            .map((label) => `<span class="label-chip">${label}</span>`)
            .join("")}</div>`
        : "";
      const dateMeta = item.date ? `<span class="doc-date">${item.date}</span>` : "";
      return `  <li class="list-item"><a href="${href}">${item.title}</a>${statusBadge}${dateMeta}${labels}</li>`;
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

const { allItems, publishedItems, draftItems } = buildResearch();
updateHomepage(allItems);
fs.mkdirSync(publicSpectrumDir, { recursive: true });
const spectrumLandingPath = path.join(publicSpectrumDir, "index.html");
if (fs.existsSync(spectrumLandingPath)) {
  fs.rmSync(spectrumLandingPath);
}
copyDir(path.join(rootDir, "src", "assets"), path.join(publishDir, "assets"));
const dataViewerSource = path.join(rootDir, "src", "templates", "data-viewer.html");
if (fs.existsSync(dataViewerSource)) {
  fs.copyFileSync(dataViewerSource, path.join(publishDir, "data-viewer.html"));
}
if (fs.existsSync(path.join(rootDir, "CNAME"))) {
  fs.copyFileSync(path.join(rootDir, "CNAME"), path.join(publishDir, "CNAME"));
}
console.log(`Built ${allItems.length} doc(s): ${publishedItems.length} published, ${draftItems.length} draft.`);
