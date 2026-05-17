import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "src", "docs");
const templatePath = path.join(rootDir, "src", "templates", "post.md");

const title = process.argv.slice(2).join(" ").trim();

if (!title) {
  console.error('Usage: npm run post:new -- "Post title"');
  process.exit(1);
}

const pad2 = (value) => String(value).padStart(2, "0");
const now = new Date();
const date = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
const datetime = `${date} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 80);

if (!slug) {
  console.error("Could not create a slug from that title.");
  process.exit(1);
}

if (!fs.existsSync(templatePath)) {
  console.error(`Missing template: ${templatePath}`);
  process.exit(1);
}

fs.mkdirSync(docsDir, { recursive: true });

const outputPath = path.join(docsDir, `${date}-${slug}.md`);
if (fs.existsSync(outputPath)) {
  console.error(`Post already exists: ${path.relative(rootDir, outputPath)}`);
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf8");
const contents = template
  .replaceAll("{{title}}", title)
  .replaceAll("{{description}}", "")
  .replaceAll("{{date}}", date)
  .replaceAll("{{datetime}}", datetime);

fs.writeFileSync(outputPath, contents, "utf8");

console.log(`Created ${path.relative(rootDir, outputPath)}`);
console.log("Next: edit the Markdown, then run npm run build");
