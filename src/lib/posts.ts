import fm from "front-matter";

export async function fetchPosts(): Promise<Post[]> {
  const modules = import.meta.glob("../posts/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  });

  const posts = Object.entries(modules).map(([path, content]) => {
    const parsed = fm<PostData>(content as string);
    return {
      attributes: parsed.attributes,
      body: parsed.body,
      path: path.replace("../posts/", "").replace(".md", ""),
    };
  });

  return posts.sort(
    (a, b) =>
      new Date(b.attributes.date).getTime() -
      new Date(a.attributes.date).getTime()
  );
}

// 🆕 Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const module = await import(`../posts/${slug}.md?raw`);
    const parsed = fm<PostData>(module.default as string);
    return {
      attributes: parsed.attributes,
      body: parsed.body,
      path: slug,
    };
  } catch (err) {
    console.error(`Failed to load post: ${slug}`, err);
    return null;
  }
}
