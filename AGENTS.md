# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

Bloggr is a personal blog built with **React 19 + TypeScript + Vite**. Blog posts are plain
Markdown files with YAML frontmatter, bundled into the app **at build time** — there is no
backend or CMS. It deploys to GitHub Pages (`blog.saptdev.me`) via the `gh-pages` package.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the Vite dev server
- `npm run build` — production build (runs `tsc -b` first; **type errors fail the build**)
- `npm run lint` — ESLint
- `npm run preview` — preview the production build locally
- `npm run deploy` — builds, then pushes `dist/` to GitHub Pages

Verify any code change with `npm run build && npm run lint` before considering it done.

## Structure

- `src/posts/*.md` — blog content. Each file needs YAML frontmatter:
  `title`, `date`, `author`, `tags` (array), `description`.
- `src/lib/posts.ts` — post loading. All posts are loaded through a single **eager**
  `import.meta.glob("../posts/*.md", { query: "?raw" })` shared by `fetchPosts()` and
  `getPostBySlug()`. **Do not** use dynamic `import()` with template variables for posts —
  Vite/Rollup cannot reliably analyze it with `?raw` query suffixes.
- `src/pages/` — route pages (`Home`, `Blog`).
- `src/components/` — React components; `components/ui/` holds shadcn-style primitives.
- `src/components/Markdown.tsx` — custom `react-markdown` renderer (Prism highlighting,
  copy button, styled tables/links).
- `src/types/index.d.ts` — **global ambient types** (`Post`, `PostData`).

## Conventions & Gotchas

- `Post` / `PostData` are global ambient types — reference them **without importing**.
- Path alias `@` maps to `./src` (see `vite.config.ts` / `tsconfig.app.json`).
- Styling is **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — there is no
  `tailwind.config.js`; theme tokens live in `src/index.css`.
- Routing uses `HashRouter` (`src/main.tsx`). This is **required** for GitHub Pages so
  deep links survive refreshes — do not switch to `BrowserRouter`.
- Default theme is dark (`ThemeProvider defaultTheme="dark"`).
- Adding a post = drop a `.md` file with valid frontmatter into `src/posts/`. No other
  registration is needed; the filename (minus `.md`) becomes the URL slug (`/blog/<slug>`).

## Deployment

`npm run deploy` runs the build and publishes `dist/` to the `gh-pages` branch. Never edit
`dist/` or the `gh-pages` branch directly.
