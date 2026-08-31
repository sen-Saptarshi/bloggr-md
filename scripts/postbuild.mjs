// Post-build step (runs after `vite build`, needs dist/ to exist):
//   1. Per-post route shells: dist/<slug>/index.html with the post's
//      title/meta/OG/JSON-LD baked in — social scrapers and crawlers get
//      per-post tags without executing any JS.
//   2. dist/404.html: SPA fallback so unknown paths still boot the app.
//   3. dist/sitemap.xml: clean URLs from the posts' frontmatter.
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import fm from "front-matter";

const BASE = "https://blog.saptdev.me";
const SITE = "Sapt Blogs";

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Swap a <meta name|property="key" content="..."> value (single-line tags!).
const setMeta = (html, key, value) =>
  html.replace(
    new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*(")`),
    `$1${esc(value)}$2`
  );

const posts = readdirSync("src/posts")
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({
    slug: f.replace(/\.md$/, ""),
    ...fm(readFileSync(`src/posts/${f}`, "utf8")).attributes,
  }))
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const template = readFileSync("dist/index.html", "utf8");

// 1. Per-post route shells.
for (const p of posts) {
  const url = `${BASE}/${p.slug}`;
  const title = `${p.title} — ${SITE}`;

  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`);
  html = setMeta(html, "description", p.description);
  html = setMeta(html, "og:title", title);
  html = setMeta(html, "og:description", p.description);
  html = setMeta(html, "og:type", "article");
  html = setMeta(html, "og:url", url);
  html = setMeta(html, "twitter:title", title);
  html = setMeta(html, "twitter:description", p.description);

  const extras = [
    `<meta property="article:published_time" content="${esc(p.date)}" />`,
    ...(p.tags ?? []).map(
      (t) => `<meta property="article:tag" content="${esc(t)}" />`
    ),
    `<script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      author: { "@type": "Person", name: p.author },
      keywords: (p.tags ?? []).join(", "),
      mainEntityOfPage: url,
    })}</script>`,
  ].join("\n    ");
  html = html.replace("</head>", `    ${extras}\n  </head>`);

  mkdirSync(`dist/${p.slug}`, { recursive: true });
  writeFileSync(`dist/${p.slug}/index.html`, html);
}

// 2. SPA fallback for any path without a generated shell.
copyFileSync("dist/index.html", "dist/404.html");

// 3. sitemap.xml (clean BrowserRouter URLs).
const entry = ({ loc, lastmod }, changefreq) =>
  `  <url><loc>${loc}</loc>${
    lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
  }<changefreq>${changefreq}</changefreq></url>`;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entry({ loc: `${BASE}/`, lastmod: posts[0]?.date }, "weekly")}
${posts
  .map((p) => entry({ loc: `${BASE}/${p.slug}`, lastmod: p.date }, "monthly"))
  .join("\n")}
</urlset>
`;
writeFileSync("dist/sitemap.xml", sitemap);

console.log(
  `postbuild: ${posts.length} route shells + 404.html + sitemap.xml`
);
