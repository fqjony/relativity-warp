import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const docsDir = path.join(rootDir, "src", "docs");
const modelsDir = path.join(rootDir, "src", "models");
const researchDir = path.join(rootDir, "src", "research");
const homepagePath = path.join(rootDir, "src", "templates", "index.html");
const publishDir = path.join(rootDir, "docs");
const publicSpectrumDir = path.join(publishDir, "spectrum");
const publicModelsDir = path.join(publishDir, "models");
const publicResearchDir = path.join(publishDir, "research");

const siteUrl = "https://fqjony.com";
const siteName = "Relativity Warp";
const googleAnalyticsId = "G-G2LLCNLPPD";

const markerStart = "<!-- RESEARCH:START -->";
const markerEnd = "<!-- RESEARCH:END -->";
const navMarker = "<!-- SITE_NAV -->";
const footerMarker = "<!-- SITE_FOOTER -->";

const cleanText = (value) =>
  value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeXml = escapeHtml;

const absoluteUrl = (pathname) => new URL(pathname, siteUrl).href;

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

const getSeoTitle = (meta, title) => meta.seo_title || meta.seoTitle || title;

const getDescription = (body, meta) => {
  if (meta.description) return meta.description;
  const paragraph = body.split("\n").find((line) => line.trim().length > 0);
  return paragraph ? cleanText(paragraph) : "";
};

const renderSiteNav = (homeHref = "/", modelsHref = "/models/", researchHref = "/research/") => `<nav class="site-nav" aria-label="Main navigation">
          <span class="ua-flag" role="img" aria-label="Ukrainian flag"></span>
          <a href="${homeHref}">Home</a>
          <a href="${researchHref}">Research</a>
          <a href="${modelsHref}">Models</a>
          <a href="https://github.com/fqjony" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com/in/fqjony" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://udx.io" target="_blank" rel="noopener">UDX</a>
        </nav>`;

const renderFooter = () => `<footer class="footer">
        <p>© 2026 Dmytro Smirnov · ${siteName}</p>
      </footer>`;

const getSeoDescription = (meta, description) =>
  meta.seo_description || meta.seoDescription || description;

const getStatus = (meta) => {
  const status = (meta.status || "").toLowerCase();
  return status === "draft" ? "draft" : "published";
};

const getResearchStatus = (meta) => (meta.status || "developing").trim().toLowerCase();

const getLabels = (meta) =>
  (meta.labels || "")
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);

const getListField = (meta, key) =>
  (meta[key] || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const uniqueValues = (values) => Array.from(new Set(values));

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

const renderPostNavItem = (label, item) => {
  if (!item) return "";
  return `<a class="article-nav-link" href="${escapeHtml(item.url)}">
          <span>${escapeHtml(label)}</span>
          <strong>${escapeHtml(item.title)}</strong>
        </a>`;
};

const renderPostNav = (newerPost, olderPost) => {
  const links = [renderPostNavItem("Newer", newerPost), renderPostNavItem("Older", olderPost)].filter(Boolean);
  if (!links.length) return "";

  return `<nav class="article-nav" aria-label="Article navigation">
        ${links.join("\n        ")}
      </nav>`;
};

const getRelatedPostReason = (post, sourcePost) => {
  if (!sourcePost) return "";
  const broadLabels = new Set(["engineering", "research", "operations", "repositories", "agents", "workflow"]);
  const shared = post.labels.filter((label) => sourcePost.labels.includes(label));
  const specificShared = shared.filter((label) => !broadLabels.has(label));
  const reasonLabels = specificShared.length ? specificShared : shared;
  if (reasonLabels.length) return `Shared thread: ${reasonLabels.slice(0, 2).join(", ")}`;
  return post.classification || "Related note";
};

const renderRelatedPosts = (relatedPosts, sourcePost = null) => {
  if (!relatedPosts.length) return "";

  return `<section class="related-posts" aria-labelledby="related-posts-title">
        <h2 id="related-posts-title" class="section-title">Related Notes</h2>
        <ul class="related-list" role="list">
${relatedPosts
  .map(
    (post) => `          <li>
            <div>
              <a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a>
              ${sourcePost ? `<p>${escapeHtml(getRelatedPostReason(post, sourcePost))}</p>` : ""}
            </div>
            <span>${escapeHtml(post.date)}</span>
          </li>`
  )
  .join("\n")}
        </ul>
      </section>`;
};

const renderRelatedModels = (models) => {
  if (!models.length) return "";

  return `<section class="related-models" aria-labelledby="related-models-title">
        <h2 id="related-models-title" class="section-title">Related Models</h2>
        <ul class="model-link-list" role="list">
${models
  .map(
    (model) => `          <li>
            <a href="${escapeHtml(model.url)}">${escapeHtml(model.title)}</a>
            <span>${escapeHtml(model.version || model.status)}</span>
          </li>`
  )
  .join("\n")}
        </ul>
      </section>`;
};

const renderRelatedResearchObjects = (items) => {
  if (!items.length) return "";

  return `<section class="related-research" aria-labelledby="related-research-title">
        <h2 id="related-research-title" class="section-title">Related Research</h2>
        <ul class="model-link-list" role="list">
${items
  .map(
    (item) => `          <li>
            <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
            <span>${escapeHtml(getResearchObjectTypeLabel(item.type) || item.status)}</span>
          </li>`
  )
  .join("\n")}
        </ul>
      </section>`;
};

const renderEvidenceTrailGroup = (label, items, itemRenderer) =>
  items.length
    ? `<div class="evidence-trail-group">
          <h3>${escapeHtml(label)}</h3>
          <ul class="model-link-list" role="list">
${items.map(itemRenderer).join("\n")}
          </ul>
        </div>`
    : "";

const renderEvidenceTrail = ({ relatedResearchObjects, relatedModels, relatedPosts, sourcePost }) => {
  const supportedConcepts = relatedResearchObjects.filter((item) => item.type === "concept");
  const otherResearch = relatedResearchObjects.filter((item) => item.type !== "concept");
  const relationRows = relatedResearchObjects.flatMap((item) => {
    const rows = [];
    if (item.dependsOn.length) rows.push([`${item.title} depends on`, item.dependsOn.join(", ")]);
    if (item.supports.length) rows.push([`${item.title} supports`, item.supports.join(", ")]);
    return rows;
  });

  if (!supportedConcepts.length && !relatedModels.length && !otherResearch.length && !relatedPosts.length && !relationRows.length) {
    return "";
  }

  return `<section class="evidence-trail" aria-labelledby="evidence-trail-title">
        <h2 id="evidence-trail-title" class="section-title">Evidence Trail</h2>
        <p>How this dated note connects back into the durable research system.</p>
        ${renderEvidenceTrailGroup(
          "Concept Supported",
          supportedConcepts,
          (item) => `            <li>
              <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
              <span>${escapeHtml(item.maturity || item.status)}</span>
            </li>`
        )}
        ${renderEvidenceTrailGroup(
          "Related Model",
          relatedModels,
          (model) => `            <li>
              <a href="${escapeHtml(model.url)}">${escapeHtml(model.title)}</a>
              <span>${escapeHtml(model.version || model.status)}</span>
            </li>`
        )}
        ${renderEvidenceTrailGroup(
          "Related Research Object",
          otherResearch,
          (item) => `            <li>
              <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
              <span>${escapeHtml(getResearchObjectTypeLabel(item.type) || item.status)}</span>
            </li>`
        )}
        ${renderEvidenceTrailGroup(
          "Related Notes",
          relatedPosts,
          (post) => `            <li>
              <div>
                <a href="${escapeHtml(post.url)}">${escapeHtml(post.title)}</a>
                ${sourcePost ? `<p>${escapeHtml(getRelatedPostReason(post, sourcePost))}</p>` : ""}
              </div>
              <span>${escapeHtml(post.date)}</span>
            </li>`
        )}
        ${renderEvidenceTrailGroup(
          "Depends On / Supports",
          relationRows,
          ([label, value]) => `            <li>
              <span>${escapeHtml(label)}</span>
              <span>${escapeHtml(value)}</span>
            </li>`
        )}
      </section>`;
};

const getResearchObjectTypeLabel = (type) =>
  String(type || "note")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const renderResearchObjectMeta = (item) => {
  const rows = [
    ["Type", getResearchObjectTypeLabel(item.type)],
    ["Status", item.status],
    ["Area", item.researchArea],
    ["Confidence", item.confidence],
    ["Maturity", item.maturity],
    ["Concepts", item.concepts.join(", ")],
    ["References", item.references.join(", ")],
    ["Updated", item.updated || item.date],
  ].filter(([, value]) => value);

  if (!rows.length) return "";

  return `<dl class="research-object-meta">
${rows
  .map(
    ([label, value]) => `          <div>
            <dt>${escapeHtml(label)}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>`
  )
  .join("\n")}
        </dl>`;
};

const getResearchFieldId = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const getReferenceTypeLabel = (item) => {
  if (!item) return "";
  if (item.kind === "post") return item.classification || "Research Note";
  if (item.kind === "model") return item.version || "Model";
  return getResearchObjectTypeLabel(item.type) || item.status;
};

const renderResearchReferenceItem = (value, referenceBySlug) => {
  const item = referenceBySlug.get(value);
  if (!item) {
    return `<li>
            <span>${escapeHtml(value)}</span>
          </li>`;
  }

  return `<li>
            <a href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
            <span>${escapeHtml(getReferenceTypeLabel(item))}</span>
          </li>`;
};

const renderResearchLinks = (title, values, referenceBySlug) => {
  if (!values.length) return "";

  const id = getResearchFieldId(title);

  return `<section class="research-links" aria-labelledby="${escapeHtml(id)}">
        <h2 id="${escapeHtml(id)}" class="section-title">${escapeHtml(title)}</h2>
        <ul class="model-link-list" role="list">
${values.map((value) => `          ${renderResearchReferenceItem(value, referenceBySlug)}`).join("\n")}
        </ul>
      </section>`;
};

const filterReferencesByKind = (values, referenceBySlug, kind) =>
  values.filter((value) => referenceBySlug.get(value)?.kind === kind);

const renderResearchOverview = (item, referenceBySlug) => {
  const sourceRefs = uniqueValues([...item.evidence, ...item.references]);
  const supportingNotes = filterReferencesByKind(sourceRefs, referenceBySlug, "post");
  const relatedModels = filterReferencesByKind(sourceRefs, referenceBySlug, "model");
  const openQuestions =
    item.type === "question"
      ? [item.slug]
      : uniqueValues(item.related.filter((value) => referenceBySlug.get(value)?.type === "question"));
  const sections = [
    item.summary
      ? `<section class="research-overview-section">
          <h2 class="section-title">Why This Matters</h2>
          <p>${escapeHtml(item.summary)}</p>
        </section>`
      : "",
    item.status || item.maturity || item.confidence
      ? `<section class="research-overview-section">
          <h2 class="section-title">Current Maturity</h2>
          <p>${escapeHtml(
            [
              item.status ? `status: ${item.status}` : "",
              item.maturity ? `maturity: ${item.maturity}` : "",
              item.confidence ? `confidence: ${item.confidence}` : "",
            ]
              .filter(Boolean)
              .join("; ")
          )}.</p>
        </section>`
      : "",
    renderResearchLinks("Supporting Notes", supportingNotes, referenceBySlug),
    renderResearchLinks("Related Models", relatedModels, referenceBySlug),
    renderResearchLinks("Open Questions", openQuestions, referenceBySlug),
  ]
    .filter(Boolean)
    .join("\n");

  if (!sections) return "";

  return `<section class="research-overview" aria-label="Research object overview">
        ${sections}
      </section>`;
};

const renderQuestions = (questions) => {
  if (!questions.length) return "";

  return `<section class="article-questions" aria-labelledby="article-questions-title">
        <h2 id="article-questions-title" class="section-title">Questions</h2>
        <ul class="model-link-list" role="list">
${questions.map((question) => `          <li><span>${escapeHtml(question)}</span></li>`).join("\n")}
        </ul>
      </section>`;
};

const renderPostPage = ({
  title,
  seoTitle,
  description,
  seoDescription,
  content,
  cssHref,
  homeHref,
  modelsHref,
  researchHref,
  labels,
  classification,
  status,
  datetime,
  date,
  url,
  newerPost,
  olderPost,
  relatedPosts,
  relatedModels,
  relatedResearchObjects,
  questions,
}) => {
  const safeTitle = escapeHtml(title);
  const safeSeoTitle = escapeHtml(seoTitle);
  const safeDescription = escapeHtml(seoDescription || description || `Post: ${title}`);
  const safeDatetime = datetime ? escapeHtml(datetime) : "";
  const canonicalUrl = absoluteUrl(url);
  const safeCanonicalUrl = escapeHtml(canonicalUrl);
  const visibleMeta = [
    status === "draft" ? `<span class="status-draft">Draft</span>` : "",
    classification ? `<span class="classification-badge">${escapeHtml(classification)}</span>` : "",
    safeDatetime ? `<span>${safeDatetime}</span>` : "",
  ]
    .filter(Boolean)
    .join("\n          ");
  const publishedTime = datetime
    ? escapeHtml(`${datetime.replace(" ", "T")}:00+03:00`)
    : escapeHtml(`${date}T00:00:00+03:00`);
  const draftRobotsMeta =
    status === "draft" ? '    <meta name="robots" content="noindex, nofollow" />\n' : "";
  const articleTags = labels
    .map((label) => `    <meta property="article:tag" content="${escapeHtml(label)}" />`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeSeoTitle} | ${siteName}</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0b1220" />
${draftRobotsMeta}    <link rel="canonical" href="${safeCanonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${safeSeoTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
    <meta property="article:published_time" content="${publishedTime}" />
${articleTags}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${safeSeoTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "${googleAnalyticsId}");
    </script>
    <link rel="stylesheet" href="${cssHref}" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="site-header article-header">
        ${renderSiteNav(homeHref, modelsHref, researchHref)}
        <h1 class="article-title">${safeTitle}</h1>
        <div class="post-meta">
          ${visibleMeta}
        </div>
      </header>
      <main id="content" class="article">
        <div class="article-content">
          ${content}
        </div>
      </main>
      ${renderRelatedModels(relatedModels)}
      ${renderEvidenceTrail({ relatedResearchObjects, relatedModels, relatedPosts, sourcePost: { labels } })}
      ${renderRelatedResearchObjects(relatedResearchObjects)}
      ${renderQuestions(questions)}
      ${renderPostNav(newerPost, olderPost)}
      ${renderFooter()}
    </div>
  </body>
</html>
`;
};

const renderPostList = (items) => {
  if (!items.length) {
    return `  <li class="list-item">No research notes yet.</li>`;
  }

  return items
    .map((item) => {
      const visibleMeta = [
        item.status === "draft" ? `<span class="status-draft">Draft</span>` : "",
        item.datetime ? `<span>${escapeHtml(item.datetime)}</span>` : "",
      ]
        .filter(Boolean)
        .join("\n      ");
      return `  <li class="post-item" data-post-item>
    <a class="post-title" href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
    <div class="post-meta">
      ${visibleMeta}
    </div>
  </li>`;
    })
    .join("\n");
};

const renderModelIndexList = (items) => {
  if (!items.length) {
    return `          <li class="model-index-item">No research models yet.</li>`;
  }

  return items
    .map((item) => {
      const visibleMeta = [
        item.status === "draft" ? `<span class="status-draft">Draft</span>` : "",
        item.version ? `<span>${escapeHtml(item.version)}</span>` : "",
        item.date ? `<span>${escapeHtml(item.date)}</span>` : "",
      ]
        .filter(Boolean)
        .join("\n              ");

      return `          <li class="model-index-item">
            <a class="post-title" href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
            <div class="model-meta">
              ${visibleMeta}
            </div>
            <p>${escapeHtml(item.summary || item.description)}</p>
          </li>`;
    })
    .join("\n");
};

const renderModelIndexPage = (items) => {
  const hasPublishedModels = items.some((item) => item.status === "published");
  const robotsMeta = hasPublishedModels ? "" : '    <meta name="robots" content="noindex, nofollow" />\n';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Models | ${siteName}</title>
    <meta name="description" content="Working research models behind Relativity Warp." />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0b1220" />
${robotsMeta}    <link rel="canonical" href="${absoluteUrl("/models/")}" />
    <link rel="stylesheet" href="../assets/index.css" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="site-header article-header">
        ${renderSiteNav("../index.html", "index.html", "../research/")}
        <h1 class="article-title">Models</h1>
        <div class="post-meta">
          <span>Working research structures</span>
        </div>
      </header>
      <main id="content" class="model-index">
        <ul class="model-index-list" role="list">
${renderModelIndexList(items)}
        </ul>
      </main>
      ${renderFooter()}
    </div>
  </body>
</html>
`;
};

const renderModelPage = ({ title, version, summary, content, cssHref, homeHref, modelsHref, researchHref, labels, questions, status, date, url, relatedPosts }) => {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(summary || `Research model: ${title}`);
  const safeCanonicalUrl = escapeHtml(absoluteUrl(url));
  const visibleMeta = [
    status === "draft" ? `<span class="status-draft">Draft</span>` : "",
    version ? `<span>${escapeHtml(version)}</span>` : "",
    date ? `<span>${escapeHtml(date)}</span>` : "",
  ]
    .filter(Boolean)
    .join("\n          ");
  const draftRobotsMeta =
    status === "draft" ? '    <meta name="robots" content="noindex, nofollow" />\n' : "";
  const modelTags = labels
    .map((label) => `    <meta property="article:tag" content="${escapeHtml(label)}" />`)
    .join("\n");
  const questionList = questions.length
    ? `<div class="model-questions">
          <h2 class="section-title">Questions</h2>
          <ul class="model-link-list" role="list">
${questions.map((question) => `            <li><span>${escapeHtml(question)}</span></li>`).join("\n")}
          </ul>
        </div>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle} | ${siteName}</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0b1220" />
${draftRobotsMeta}    <link rel="canonical" href="${safeCanonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
${modelTags}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "${googleAnalyticsId}");
    </script>
    <link rel="stylesheet" href="${cssHref}" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="site-header article-header">
        ${renderSiteNav(homeHref, modelsHref, researchHref)}
        <h1 class="article-title">${safeTitle}</h1>
        <div class="model-meta">
          ${visibleMeta}
        </div>
        ${summary ? `<p class="model-summary">${escapeHtml(summary)}</p>` : ""}
      </header>
      <main id="content" class="article model-page">
        <div class="article-content">
          ${content}
        </div>
        ${questionList}
      </main>
      ${renderRelatedPosts(relatedPosts)}
      ${renderFooter()}
    </div>
  </body>
</html>
`;
};

const getResearchObjectMeta = (item) =>
  [
    item.status ? `<span>${escapeHtml(item.status)}</span>` : "",
    item.maturity ? `<span>${escapeHtml(item.maturity)}</span>` : "",
    item.confidence ? `<span>${escapeHtml(item.confidence)}</span>` : "",
  ]
    .filter(Boolean)
    .join("\n              ");

const renderResearchIndexList = (items) => {
  if (!items.length) {
    return `          <li class="research-index-item">No research objects yet.</li>`;
  }

  return items
    .map(
      (item) => `          <li class="research-index-item">
            <a class="post-title" href="${escapeHtml(item.url)}">${escapeHtml(item.title)}</a>
            <div class="model-meta">
              ${getResearchObjectMeta(item)}
            </div>
            <p>${escapeHtml(item.summary || item.description)}</p>
          </li>`
    )
    .join("\n");
};

const renderResearchIndexGroups = (items) => {
  if (!items.length) {
    return `<ul class="research-index-list" role="list">
${renderResearchIndexList(items)}
          </ul>`;
  }

  const groups = new Map();
  items.forEach((item) => {
    const type = item.type || "note";
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(item);
  });

  return Array.from(groups.entries())
    .map(
      ([type, groupItems]) => `          <section class="research-type-group" aria-labelledby="research-type-${escapeHtml(type)}">
            <h3 id="research-type-${escapeHtml(type)}" class="research-type-title">${escapeHtml(getResearchObjectTypeLabel(type))}</h3>
            <ul class="research-index-list" role="list">
${renderResearchIndexList(groupItems)}
            </ul>
          </section>`
    )
    .join("\n");
};

const renderResearchIndexPage = (items) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Research | ${siteName}</title>
    <meta name="description" content="An evolving research corpus of concepts, hypotheses, questions, evidence, and frameworks for software engineering." />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0b1220" />
    <link rel="canonical" href="${absoluteUrl("/research/")}" />
    <link rel="stylesheet" href="../assets/index.css" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="site-header article-header">
        ${renderSiteNav("../index.html", "../models/", "index.html")}
        <h1 class="article-title">Research</h1>
        <p class="model-summary">An evolving research corpus for turning software engineering experience into reusable understanding. These objects are working material, not a finished publication archive.</p>
      </header>
      <main id="content" class="research-index">
        <section class="research-thesis" aria-labelledby="research-thesis-title">
          <h2 id="research-thesis-title" class="section-title">Thesis</h2>
          <p>Software engineering organizations preserve artifacts better than they preserve reusable understanding.</p>
        </section>
        <section aria-labelledby="research-objects-title">
          <h2 id="research-objects-title" class="section-title">Objects</h2>
${renderResearchIndexGroups(items)}
        </section>
      </main>
      ${renderFooter()}
    </div>
  </body>
</html>
`;

const renderResearchObjectPage = ({ item, content, cssHref, homeHref, modelsHref, researchHref, referenceBySlug }) => {
  const safeTitle = escapeHtml(item.title);
  const safeDescription = escapeHtml(item.summary || `Research object: ${item.title}`);
  const safeCanonicalUrl = escapeHtml(absoluteUrl(item.url));
  const relatedSections = [
    renderResearchLinks("Related Research", item.related, referenceBySlug),
    renderResearchLinks("Depends On", item.dependsOn, referenceBySlug),
    renderResearchLinks("Supports", item.supports, referenceBySlug),
    renderResearchLinks("Contradicts", item.contradicts, referenceBySlug),
    renderResearchLinks("Evidence", item.evidence, referenceBySlug),
  ]
    .filter(Boolean)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle} | ${siteName}</title>
    <meta name="description" content="${safeDescription}" />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0b1220" />
    <link rel="canonical" href="${safeCanonicalUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeCanonicalUrl}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag("js", new Date());
      gtag("config", "${googleAnalyticsId}");
    </script>
    <link rel="stylesheet" href="${cssHref}" />
  </head>
  <body>
    <a class="skip-link" href="#content">Skip to content</a>
    <div class="container">
      <header class="site-header article-header">
        ${renderSiteNav(homeHref, modelsHref, researchHref)}
        <h1 class="article-title">${safeTitle}</h1>
        ${item.summary ? `<p class="model-summary">${escapeHtml(item.summary)}</p>` : ""}
        ${renderResearchObjectMeta(item)}
      </header>
      <main id="content" class="article research-object-page">
        ${renderResearchOverview(item, referenceBySlug)}
        <div class="article-content">
          ${content}
        </div>
      </main>
      ${relatedSections}
      ${renderFooter()}
    </div>
  </body>
</html>
`;
};

const updateHomepage = (items) => {
  const raw = fs.readFileSync(homepagePath, "utf8");
  const start = raw.indexOf(markerStart);
  const end = raw.indexOf(markerEnd);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Homepage post markers not found.");
  }
  if (!raw.includes(navMarker)) {
    throw new Error("Homepage nav marker not found.");
  }
  if (!raw.includes(footerMarker)) {
    throw new Error("Homepage footer marker not found.");
  }

  const withPosts = `${raw.slice(0, start + markerStart.length)}
${renderPostList(items)}
${raw.slice(end)}`;
  const updated = withPosts.replace(navMarker, renderSiteNav()).replace(footerMarker, renderFooter());

  fs.mkdirSync(publishDir, { recursive: true });
  fs.writeFileSync(path.join(publishDir, "index.html"), updated, "utf8");
};

const writeRobotsTxt = () => {
  fs.writeFileSync(
    path.join(publishDir, "robots.txt"),
    `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`,
    "utf8"
  );
};

const writeSitemap = (items, models, researchObjects) => {
  const publishedItems = items.filter((item) => item.status === "published");
  const publishedModels = models.filter((item) => item.status === "published");
  const publishedResearchObjects = researchObjects.filter((item) => item.status !== "draft");
  const urls = [
    {
      loc: absoluteUrl("/"),
      lastmod: publishedItems[0]?.date || formatLocalDate(new Date()),
      priority: "1.0",
    },
    ...(publishedModels.length
      ? [
          {
            loc: absoluteUrl("/models/"),
            lastmod: publishedModels[0].date,
            priority: "0.6",
          },
        ]
      : []),
    ...(publishedResearchObjects.length
      ? [
          {
            loc: absoluteUrl("/research/"),
            lastmod: publishedResearchObjects[0].updated || publishedResearchObjects[0].date,
            priority: "0.7",
          },
        ]
      : []),
    ...publishedItems.map((item) => ({
      loc: absoluteUrl(item.url),
      lastmod: item.date,
      priority: "0.8",
    })),
    ...publishedModels.map((item) => ({
      loc: absoluteUrl(item.url),
      lastmod: item.date,
      priority: "0.7",
    })),
    ...publishedResearchObjects.map((item) => ({
      loc: absoluteUrl(item.url),
      lastmod: item.updated || item.date,
      priority: "0.6",
    })),
  ];

  const body = urls
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${escapeXml(item.lastmod)}</lastmod>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join("\n");

  fs.writeFileSync(
    path.join(publishDir, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`,
    "utf8"
  );
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

      const title = getTitle(body, meta, fallback);
      const description = getDescription(body, meta);

      return {
        raw,
        body,
        title,
        seoTitle: getSeoTitle(meta, title),
        description,
        seoDescription: getSeoDescription(meta, description),
        status: getStatus(meta),
        labels: getLabels(meta),
        classification: (meta.classification || "").trim(),
        modelSlugs: getListField(meta, "models"),
        questions: getListField(meta, "questions"),
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

  return items;
};

const buildModels = (posts) => {
  fs.rmSync(publicModelsDir, { recursive: true, force: true });
  fs.mkdirSync(publicModelsDir, { recursive: true });

  const items = fs.existsSync(modelsDir)
    ? listMarkdownFiles(modelsDir)
        .map((filePath) => {
          const raw = fs.readFileSync(filePath, "utf8");
          const { body, meta } = parseFrontmatter(raw);
          const fallback = path
            .basename(filePath, ".md")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (match) => match.toUpperCase());
          const slug = normalizeSlug(
            path.relative(modelsDir, filePath).replace(/\\/g, "/").replace(/\.md$/, "")
          );
          const temporal = getTemporalMeta(meta, filePath);
          const title = getTitle(body, meta, fallback);
          const summary = (meta.summary || "").trim() || getDescription(body, meta);

          return {
            kind: "model",
            raw,
            body,
            title,
            summary,
            description: summary,
            status: getStatus(meta),
            labels: getLabels(meta),
            questions: getListField(meta, "questions"),
            version: (meta.version || "").trim(),
            slug,
            url: `/models/${slug}/`,
            outputPath: path.join(publicModelsDir, slug, "index.html"),
            ...temporal,
          };
        })
        .sort((a, b) => {
          if (a.sortValue !== b.sortValue) return b.sortValue - a.sortValue;
          return a.title.localeCompare(b.title);
        })
    : [];

  items.forEach((item) => {
    const strippedBody = item.body.replace(/^# .+?\n+/, "");
    const content = marked.parse(strippedBody);
    const relatedPosts = posts
      .filter((post) => post.modelSlugs.includes(item.slug))
      .sort((a, b) => b.sortValue - a.sortValue)
      .slice(0, 5);
    const cssHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "assets", "index.css"))
      .replace(/\\/g, "/");
    const homeHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "index.html"))
      .replace(/\\/g, "/");
    const modelsHref = path
      .relative(path.dirname(item.outputPath), path.join(publicModelsDir, "index.html"))
      .replace(/\\/g, "/");
    const researchHref = path
      .relative(path.dirname(item.outputPath), path.join(publicResearchDir, "index.html"))
      .replace(/\\/g, "/");

    fs.mkdirSync(path.dirname(item.outputPath), { recursive: true });
    fs.writeFileSync(
      item.outputPath,
      renderModelPage({
        ...item,
        content,
        cssHref,
        homeHref,
        modelsHref,
        researchHref,
        relatedPosts,
      }),
      "utf8"
    );
  });

  fs.writeFileSync(path.join(publicModelsDir, "index.html"), renderModelIndexPage(items), "utf8");

  return items;
};

const buildResearchObjects = (posts, models) => {
  fs.rmSync(publicResearchDir, { recursive: true, force: true });
  fs.mkdirSync(publicResearchDir, { recursive: true });

  const items = fs.existsSync(researchDir)
    ? listMarkdownFiles(researchDir)
        .map((filePath) => {
          const raw = fs.readFileSync(filePath, "utf8");
          const { body, meta } = parseFrontmatter(raw);
          const fallback = path
            .basename(filePath, ".md")
            .replace(/-/g, " ")
            .replace(/\b\w/g, (match) => match.toUpperCase());
          const slug = normalizeSlug(
            path.relative(researchDir, filePath).replace(/\\/g, "/").replace(/\.md$/, "")
          );
          const temporal = getTemporalMeta({ date: meta.updated || meta.created || meta.date }, filePath);
          const title = getTitle(body, meta, fallback);
          const summary = (meta.summary || "").trim() || getDescription(body, meta);

          return {
            kind: "research",
            raw,
            body,
            title,
            summary,
            description: summary,
            type: (meta.type || "note").trim(),
            status: getResearchStatus(meta),
            created: (meta.created || meta.date || "").trim(),
            updated: (meta.updated || meta.date || "").trim(),
            researchArea: (meta.research_area || "").trim(),
            concepts: getListField(meta, "concepts"),
            related: getListField(meta, "related"),
            dependsOn: getListField(meta, "depends_on"),
            supports: getListField(meta, "supports"),
            contradicts: getListField(meta, "contradicts"),
            evidence: getListField(meta, "evidence"),
            references: getListField(meta, "references"),
            confidence: (meta.confidence || "").trim(),
            maturity: (meta.maturity || "").trim(),
            slug,
            url: `/research/${slug}/`,
            outputPath: path.join(publicResearchDir, slug, "index.html"),
            ...temporal,
          };
        })
        .sort((a, b) => {
          const typeCompare = a.type.localeCompare(b.type);
          if (typeCompare !== 0) return typeCompare;
          return a.title.localeCompare(b.title);
        })
    : [];

  const referenceBySlug = new Map([
    ...posts.map((item) => [item.slug, { ...item, kind: "post" }]),
    ...models.map((item) => [item.slug, { ...item, kind: "model" }]),
    ...items.map((item) => [item.slug, item]),
  ]);

  items.forEach((item) => {
    const strippedBody = item.body.replace(/^# .+?\n+/, "");
    const content = marked.parse(strippedBody);
    const cssHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "assets", "index.css"))
      .replace(/\\/g, "/");
    const homeHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "index.html"))
      .replace(/\\/g, "/");
    const modelsHref = path
      .relative(path.dirname(item.outputPath), path.join(publicModelsDir, "index.html"))
      .replace(/\\/g, "/");
    const researchHref = path
      .relative(path.dirname(item.outputPath), path.join(publicResearchDir, "index.html"))
      .replace(/\\/g, "/");

    fs.mkdirSync(path.dirname(item.outputPath), { recursive: true });
    fs.writeFileSync(
      item.outputPath,
      renderResearchObjectPage({
        item,
        content,
        cssHref,
        homeHref,
        modelsHref,
        researchHref,
        referenceBySlug,
      }),
      "utf8"
    );
  });

  fs.writeFileSync(path.join(publicResearchDir, "index.html"), renderResearchIndexPage(items), "utf8");

  return items;
};

const writePostPages = (items, models, researchObjects) => {
  const modelBySlug = new Map(models.map((model) => [model.slug, model]));
  const publicResearchObjects = researchObjects.filter((item) => item.status !== "draft");

  items.forEach((item, index) => {
    const strippedBody = item.body.replace(/^# .+?\n+/, "");
    const content = marked.parse(strippedBody);
    const itemLabels = new Set(item.labels);
    const itemModelSlugs = new Set(item.modelSlugs);
    const relatedPosts = items
      .filter((candidate) => candidate !== item)
      .map((candidate) => ({
        ...candidate,
        sharedLabelCount: candidate.labels.filter((label) => itemLabels.has(label)).length,
      }))
      .filter((candidate) => candidate.sharedLabelCount > 0)
      .sort((a, b) => {
        if (a.sharedLabelCount !== b.sharedLabelCount) return b.sharedLabelCount - a.sharedLabelCount;
        return b.sortValue - a.sortValue;
      })
      .slice(0, 3);
    const relatedModels = item.modelSlugs.map((slug) => modelBySlug.get(slug)).filter(Boolean);
    const relatedResearchObjects = publicResearchObjects
      .map((candidate) => {
        let relationScore = 0;
        if (candidate.evidence.includes(item.slug)) relationScore += 4;
        if (candidate.references.includes(item.slug)) relationScore += 3;
        if (itemLabels.has(candidate.slug)) relationScore += 3;
        relationScore += candidate.concepts.filter((concept) => itemLabels.has(concept)).length;
        relationScore += candidate.references.filter((reference) => itemModelSlugs.has(reference)).length;
        relationScore += candidate.evidence.filter((reference) => itemModelSlugs.has(reference)).length;
        relationScore += candidate.related.filter((reference) => item.questions.includes(reference)).length;

        return {
          ...candidate,
          relationScore,
        };
      })
      .filter((candidate) => candidate.relationScore > 0)
      .sort((a, b) => {
        if (a.relationScore !== b.relationScore) return b.relationScore - a.relationScore;
        return a.title.localeCompare(b.title);
      })
      .slice(0, 4);
    const cssHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "assets", "index.css"))
      .replace(/\\/g, "/");
    const homeHref = path
      .relative(path.dirname(item.outputPath), path.join(publishDir, "index.html"))
      .replace(/\\/g, "/");
    const modelsHref = path
      .relative(path.dirname(item.outputPath), path.join(publicModelsDir, "index.html"))
      .replace(/\\/g, "/");
    const researchHref = path
      .relative(path.dirname(item.outputPath), path.join(publicResearchDir, "index.html"))
      .replace(/\\/g, "/");

    fs.mkdirSync(path.dirname(item.outputPath), { recursive: true });
    fs.writeFileSync(
      item.outputPath,
      renderPostPage({
        ...item,
        content,
        cssHref,
        homeHref,
        modelsHref,
        researchHref,
        newerPost: index > 0 ? items[index - 1] : null,
        olderPost: index < items.length - 1 ? items[index + 1] : null,
        relatedPosts,
        relatedModels,
        relatedResearchObjects,
      }),
      "utf8"
    );
  });
};

const buildSite = () => {
  if (!fs.existsSync(docsDir)) {
    throw new Error(`Missing docs directory: ${docsDir}`);
  }

  fs.rmSync(publicSpectrumDir, { recursive: true, force: true });
  fs.mkdirSync(publicSpectrumDir, { recursive: true });

  const items = buildPosts();
  const models = buildModels(items);
  const researchObjects = buildResearchObjects(items, models);

  writePostPages(items, models, researchObjects);

  updateHomepage(items);
  writeSitemap(items, models, researchObjects);
  writeRobotsTxt();
  fs.rmSync(path.join(publishDir, "assets"), { recursive: true, force: true });
  copyDir(path.join(rootDir, "src", "assets"), path.join(publishDir, "assets"));

  if (fs.existsSync(path.join(rootDir, "CNAME"))) {
    fs.copyFileSync(path.join(rootDir, "CNAME"), path.join(publishDir, "CNAME"));
  }

  fs.rmSync(path.join(publishDir, "tips.json"), { force: true });

  return { items, models, researchObjects };
};

const { items, models, researchObjects } = buildSite();
const publishedCount = items.filter((item) => item.status === "published").length;
const draftCount = items.filter((item) => item.status === "draft").length;
const publishedModelCount = models.filter((item) => item.status === "published").length;
const draftModelCount = models.filter((item) => item.status === "draft").length;
const publicResearchCount = researchObjects.filter((item) => item.status !== "draft").length;
const draftResearchCount = researchObjects.filter((item) => item.status === "draft").length;
console.log(
  `Built ${items.length} post(s): ${publishedCount} published, ${draftCount} draft. Built ${models.length} model(s): ${publishedModelCount} published, ${draftModelCount} draft. Built ${researchObjects.length} research object(s): ${publicResearchCount} public, ${draftResearchCount} draft.`
);
