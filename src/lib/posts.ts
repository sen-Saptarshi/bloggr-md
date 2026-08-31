import fm from "front-matter";

// Single eager glob: every post is bundled as a raw string at build time.
// Both fetchPosts() and getPostBySlug() read from this one source of truth.
const modules = import.meta.glob("../posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const WORDS_PER_MINUTE = 140;

function toPost(path: string, content: string): Post {
  const parsed = fm<PostData>(content);
  const words = parsed.body.trim().split(/\s+/).length;
  return {
    attributes: parsed.attributes,
    body: parsed.body,
    path: path.replace("../posts/", "").replace(".md", ""),
    readingTime: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
  };
}

export async function fetchPosts(): Promise<Post[]> {
  return Object.entries(modules)
    .map(([path, content]) => toPost(path, content))
    .sort(
      (a, b) =>
        new Date(b.attributes.date).getTime() -
        new Date(a.attributes.date).getTime()
    );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const path = `../posts/${slug}.md`;
  const content = modules[path];
  if (!content) return null;
  return toPost(path, content);
}
