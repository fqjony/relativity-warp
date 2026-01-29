import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const researchDir = path.join(rootDir, "research");
const outputPath = path.join(researchDir, "index.json");

const titleRe = /<title[^>]*>(.*?)<\/title>/is;
const h1Re = /<h1[^>]*>(.*?)<\/h1>/is;
const tagRe = /<[^>]+>/g;

const cleanText = (value) =>
  value
    .replace(tagRe, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const extractTitle = (contents, fallback) => {
  const titleMatch = contents.match(titleRe);
  if (titleMatch && titleMatch[1]) {
    const title = cleanText(titleMatch[1]);
    if (title) return title;
  }

  const h1Match = contents.match(h1Re);
  if (h1Match && h1Match[1]) {
    const title = cleanText(h1Match[1]);
    if (title) return title;
  }

  return fallback;
};

const listIndexPages = (dir) => {
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
      if (item.isFile() && item.name === "index.html") {
        entries.push(itemPath);
      }
    }
  }

  return entries;
};

if (!fs.existsSync(researchDir)) {
  console.error("research directory not found");
  process.exit(1);
}

const items = listIndexPages(researchDir)
  .filter(
    (filePath) =>
      path.relative(rootDir, filePath).replace(/\\/g, "/") !==
      "research/index.html"
  )
  .map((filePath) => {
    const relPath = path
      .relative(rootDir, filePath)
      .replace(/\\/g, "/");
    const raw = fs.readFileSync(filePath, "utf8");
    const fallback = path
      .basename(path.dirname(filePath))
      .replace(/-/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
    const title = extractTitle(raw, fallback);

    let url = `/${relPath}`;
    if (relPath.endsWith("/index.html")) {
      url = `/${relPath.slice(0, -"/index.html".length)}/`;
    }

    return {
      title,
      path: relPath,
      url,
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const payload = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  items,
};

fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`Wrote ${outputPath} with ${items.length} item(s).`);
