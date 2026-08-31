# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

Bloggr is a personal blog built with **React 19 + TypeScript + Vite**. Blog posts are plain
Markdown files with YAML frontmatter, bundled into the app **at build time** — there is no
backend or CMS. It deploys to GitHub Pages (`blog.saptdev.me`) via the `gh-pages` package.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server
- `npm run build` — production build (runs `tsc -b` first; **type errors fail the build**),
  then `scripts/postbuild.mjs` generates per-post route shells (`dist/<slug>/index.html`
  with meta baked in), `dist/404.html` (SPA fallback) and `dist/sitemap.xml`
- `npm run lint` — ESLint
- `npm run preview` — preview the production build locally
- `npm run deploy` — builds, then pushes `dist/` to GitHub Pages

Verify any code change with `npm run build && npm run lint` before considering it done.

## Structure

- `src/posts/*.md` — blog content. Each file needs YAML frontmatter:
  `title`, `date`, `author`, `tags` (array), `description`.
- `src/lib/posts.ts` — post loading. All posts are loaded through a single **eager**
  `import.meta.glob("../posts/*.md", { query: "?raw" })` shared by `fetchPosts()` and
  `getPostBySlug()`. `readingTime` (min, from body word count) is computed here too.
  **Do not** use dynamic `import()` with template variables for posts —
  Vite/Rollup cannot reliably analyze it with `?raw` query suffixes.
- `src/lib/toc.ts` — `extractHeadings()` + `slugify()` powering the blog table of
  contents. Heading `id`s in `Markdown.tsx` are slugified with the **same** function —
  keep them in sync or TOC anchor scrolling breaks.
- `src/lib/seo.ts` — `useSeo()` hook (page `<title>`, meta/OG/Twitter tags, canonical,
  article JSON-LD). Every page should call it. Site constants (`SITE_NAME`, `BASE_URL`)
  live here — keep `BASE_URL` in sync with `public/CNAME`.
- `scripts/postbuild.mjs` — zero-dep post-build script (route shells + 404.html + sitemap),
  runs at the end of `npm run build`. It regex-swaps meta values in `dist/index.html`, so
  **keep every meta tag in `index.html` on a single line**.
- `public/robots.txt` — allows all crawlers, points at the sitemap.
- `src/pages/` — route pages (`Home`, `Blog`).
- `src/components/` — React components; `components/ui/` holds shadcn-style primitives.
- `src/components/TableOfContents.tsx` — scroll-spy TOC for the blog page. TOC items use
  `<button>` + `scrollIntoView` (smooth scroll), not `href="#..."` anchors.
- `src/components/Markdown.tsx` — custom `react-markdown` renderer (Prism highlighting,
  copy button, styled tables/links).
- `src/types/index.d.ts` — **global ambient types** (`Post`, `PostData`).

## Conventions & Gotchas

- `Post` / `PostData` are global ambient types — reference them **without importing**.
- Path alias `@` maps to `./src` (see `vite.config.ts` / `tsconfig.app.json`).
- Styling is **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — there is no
  `tailwind.config.js`; theme tokens live in `src/index.css`.
- Routing uses `BrowserRouter` (`src/main.tsx`). Deep links survive GitHub Pages refreshes
  because the build emits a static shell per post route (`dist/blog/<slug>/index.html`)
  plus a `404.html` fallback — do **not** remove `scripts/postbuild.mjs` from the build.
  A shim in `main.tsx` redirects legacy `/#/...` links. Do not switch back to `HashRouter`
  (it breaks per-post SEO/social cards).
- Default theme is dark (`ThemeProvider defaultTheme="dark"`).
- Adding a post = drop a `.md` file with valid frontmatter into `src/posts/`. No other
  registration is needed; the filename (minus `.md`) becomes the URL slug (`/<slug>`).

## Deployment

`npm run deploy` runs the build and publishes `dist/` to the `gh-pages` branch. Never edit
`dist/` or the `gh-pages` branch directly.
