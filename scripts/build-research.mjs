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

const markerStart = "<!-- RESEARCH:START -->";
const markerEnd = "<!-- RESEARCH:END -->";

const cleanText = (value) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const pad2 = (value) => String(value).padStart(2, "0");

const formatLocalDate = (dateObj) =>
  `${dateObj.getFullYear()}-${pad2(dateObj.getMonth() + 1)}-${pad2(dateObj.getDate())}`;

const formatLocalDateTime = (dateObj) =>
  `${formatLocalDate(dateObj)} ${pad2(dateObj.getHours())}:${pad2(dateObj.getMinutes())}`;

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

const parseTemporalValue = (value) => {
  if (!value) return Number.NaN;
  const trimmed = value.trim();
  if (!trimmed) return Number.NaN;
  const normalized = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(trimmed)
    ? trimmed.replace(" ", "T")
    : trimmed;
  const parsed = Date.parse(normalized);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
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
      } else if (item.isFile() && item.name.endsWith(".md")) {
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
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const normalizeSlug = (value) =>
  value
    .split("/")
    .map((segment) => segment.replace(/^\d+_/, ""))
    .join("/");

const getTitle = (body, meta, fallback) => {
  if (meta.title) return meta.title;
  const match = body.match(/^#\s+(.+)$/m);
  return match ? cleanText(match[1]) : fallback;
};

const getDescription = (body, meta) => {
  if (meta.description) return meta.description;
  const paragraph = body.split("\n").find((line) => line.trim().length > 0);
  return paragraph ? cleanText(paragraph) : "";
};

const getStatus = (meta) => {
  const status = (meta.status || "").toLowerCase();
  return status === "draft" ? "draft" : "published";
};

const getLabels = (meta) =>
  (meta.labels || "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);

const getTemporalMeta = (meta, filePath) => {
  const stats = fs.statSync(filePath);
  const fallbackDatetime = formatLocalDateTime(stats.mtime);
  const datetime = (meta.datetime || "").trim() || fallbackDatetime;
  const date = (meta.date || "").trim() || datetime.slice(0, 10) || formatLocalDate(stats.mtime);
  const parsedDateTime = parseTemporalValue(datetime);
  const parsedDate = parseTemporalValue(date);

  return {
    datetime,
    date,
    sortValue: Number.isNaN(parsedDateTime)
      ? Number.isNaN(parsedDate)
        ? stats.mtimeMs
        : parsedDate
      : parsedDateTime,
  };
};

const renderPostPage = ({ title, description, content, cssHref, homeHref, labels, status, datetime }) => {
  const statusLabel = status === "draft" ? "Draft" : "Published";
  const labelsText = labels.length ? ` on ${labels.join(", ")}` : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Relativity Warp</title>
    <meta name="description" content="${description || `Post: ${title}`}" />
    <link rel="stylesheet" href="${cssHref}" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="site-header article-header">
        <nav class="site-nav" aria-label="Main navigation">
          <a href="${homeHref}">Home</a>
          <a href="https://github.com/fqjony" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com/in/fqjony" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://udx.io" target="_blank" rel="noopener">UDX</a>
        </nav>
        <h1 class="article-title">${title}</h1>
        <div class="post-meta">
          <span class="status-${status}">${statusLabel}</span>
          ${datetime ? `<span>${datetime}</span>` : ""}
          ${labelsText ? `<span>${labelsText}</span>` : ""}
        </div>
      </header>
      <main id="content" class="article">
        <div class="article-content">
          ${content}
        </div>
      </main>
      <footer class="footer">
        <p>© 2026 Dmytro Smirnov. <a href="https://github.com/fqjony/relativity-warp" target="_blank" rel="noopener">GitHub repo</a>.</p>
      </footer>
    </div>
  </body>
</html>
`;
};

const renderPostList = (items) => {
  if (!items.length) {
    return `  <li class="list-item">No posts yet.</li>`;
  }

  return items
    .map((item) => {
      const statusLabel = item.status === "draft" ? "Draft" : "Published";
      const labels = item.labels.length ? ` on ${item.labels.join(", ")}` : "";
      const description = item.description ? `<p class="post-description">${item.description}</p>` : "";
      return `  <li class="post-item">
    <a class="post-title" href="${item.url}">${item.title}</a>
    <div class="post-meta">
      <span class="status-${item.status}">${statusLabel}</span>
      ${item.datetime ? `<span>${item.datetime}</span>` : ""}
      ${labels ? `<span>${labels}</span>` : ""}
    </div>
    ${description}
  </li>`;
    })
    .join("\n");
};

const updateHomepage = (items) => {
  const raw = fs.readFileSync(homepagePath, "utf8");
  const start = raw.indexOf(markerStart);
  const end = raw.indexOf(markerEnd);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Homepage post markers not found.");
  }

  const updated = `${raw.slice(0, start + markerStart.length)}
${renderPostList(items)}
${raw.slice(end)}`;

  fs.mkdirSync(publishDir, { recursive: true });
  fs.writeFileSync(path.join(publishDir, "index.html"), updated, "utf8");
};

const buildPosts = () => {
  if (!fs.existsSync(docsDir)) {
    throw new Error(`Missing docs directory: ${docsDir}`);
  }

  fs.rmSync(publicSpectrumDir, { recursive: true, force: true });
  fs.mkdirSync(publicSpectrumDir, { recursive: true });

  const items = listMarkdownFiles(docsDir)
    .map((filePath) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const { body, meta } = parseFrontmatter(raw);
      const fallback = path
        .basename(filePath, ".md")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
      const slug = normalizeSlug(
        path.relative(docsDir, filePath).replace(/\\/g, "/").replace(/\.md$/, "")
      );
      const temporal = getTemporalMeta(meta, filePath);

      return {
        raw,
        body,
        title: getTitle(body, meta, fallback),
        description: getDescription(body, meta),
        status: getStatus(meta),
        labels: getLabels(meta),
        slug,
        url: `/spectrum/${slug}/`,
        outputPath: path.join(publicSpectrumDir, slug, "index.html"),
        ...temporal,
      };
    })
    .sort((a, b) => {
      if (a.sortValue !== b.sortValue) return b.sortValue - a.sortValue;
      return a.title.localeCompare(b.title);
    });

  items.forEach((item) => {
    const strippedBody = item.body.replace(/^# .+?\n+/, "");
    const content = marked.parse(strippedBody);
    const cssHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "assets", "index.css"))
      .replace(/\\/g, "/");
    const homeHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "index.html"))
      .replace(/\\/g, "/");

    fs.mkdirSync(path.dirname(item.outputPath), { recursive: true });
    fs.writeFileSync(
      item.outputPath,
      renderPostPage({
        ...item,
        content,
        cssHref,
        homeHref,
      }),
      "utf8"
    );
  });

  updateHomepage(items);
  fs.rmSync(path.join(publishDir, "assets"), { recursive: true, force: true });
  copyDir(path.join(rootDir, "src", "assets"), path.join(publishDir, "assets"));

  if (fs.existsSync(path.join(rootDir, "CNAME"))) {
    fs.copyFileSync(path.join(rootDir, "CNAME"), path.join(publishDir, "CNAME"));
  }

  fs.rmSync(path.join(publishDir, "tips.json"), { force: true });

  return items;
};

const items = buildPosts();
const publishedCount = items.filter((item) => item.status === "published").length;
const draftCount = items.filter((item) => item.status === "draft").length;
console.log(`Built ${items.length} post(s): ${publishedCount} published, ${draftCount} draft.`);
