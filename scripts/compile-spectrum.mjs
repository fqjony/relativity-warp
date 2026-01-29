import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const spectrumDir = path.join(rootDir, "spectrum");
const sourceDir = path.join(spectrumDir, "src");
const schemaDir = path.join(spectrumDir, "schema");

const indexSourcePath = path.join(sourceDir, "index.yml");
const indexOutputPath = path.join(spectrumDir, "index.json");
const indexSchemaPath = path.join(schemaDir, "spectrum-index.schema.json");
const allOutputPath = path.join(spectrumDir, "all.json");

const readFile = (filePath) => fs.readFileSync(filePath, "utf8");

const readYamlOrJson = (filePath) => {
  const raw = readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".yml" || ext === ".yaml") {
    return yaml.load(raw);
  }
  return JSON.parse(raw);
};

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const schemaCache = new Map();

const loadSchema = (schemaPath) => {
  if (schemaCache.has(schemaPath)) {
    return schemaCache.get(schemaPath);
  }
  const schema = JSON.parse(readFile(schemaPath));
  const validate = ajv.compile(schema);
  schemaCache.set(schemaPath, validate);
  return validate;
};

const formatErrors = (errors = []) =>
  errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("\n");

if (!fs.existsSync(indexSourcePath)) {
  console.error(`Missing spectrum index source: ${indexSourcePath}`);
  process.exit(1);
}

const indexData = readYamlOrJson(indexSourcePath);
const validateIndex = loadSchema(indexSchemaPath);
if (!validateIndex(indexData)) {
  console.error("Spectrum index failed validation:");
  console.error(formatErrors(validateIndex.errors));
  process.exit(1);
}

fs.mkdirSync(spectrumDir, { recursive: true });
fs.writeFileSync(indexOutputPath, JSON.stringify(indexData, null, 2) + "\n", "utf8");

for (const entry of indexData) {
  if (!entry || !entry.path || !entry.source || !entry.schema) {
    console.warn("Skipping entry with missing path/source/schema.");
    continue;
  }

  const sourcePath = path.join(rootDir, entry.source);
  const outputPath = path.join(rootDir, entry.path);
  const schemaPath = path.join(rootDir, entry.schema);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Missing spectrum source: ${sourcePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(schemaPath)) {
    console.error(`Missing spectrum schema: ${schemaPath}`);
    process.exit(1);
  }

  const payload = readYamlOrJson(sourcePath);
  const validatePayload = loadSchema(schemaPath);
  if (!validatePayload(payload)) {
    console.error(`Spectrum payload failed validation: ${sourcePath}`);
    console.error(formatErrors(validatePayload.errors));
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
}

const allPayload = {
  generatedAt: new Date().toISOString(),
  items: [],
};

for (const entry of indexData) {
  if (!entry?.path) continue;
  if (entry.path === "spectrum/all.json") continue;
  const outputPath = path.join(rootDir, entry.path);
  let payload = null;
  try {
    payload = JSON.parse(readFile(outputPath));
  } catch (error) {
    payload = { error: "Unable to load compiled payload." };
  }

  allPayload.items.push({
    name: entry.name,
    title: entry.title,
    description: entry.description,
    category: entry.category,
    format: entry.format,
    path: entry.path,
    payload,
  });
}

fs.writeFileSync(allOutputPath, JSON.stringify(allPayload, null, 2) + "\n", "utf8");

console.log(`Compiled spectrum index and payloads to ${spectrumDir}.`);
