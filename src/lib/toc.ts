export interface TocItem {
  id: string;
  text: string;
  depth: number; // heading level 1-6
}

/**
 * Turns heading text into a URL-safe anchor id.
 * Shared by the TOC extractor and the Markdown heading renderer — keep in sync!
 * Note: duplicate heading texts produce duplicate ids (first match wins).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/[*_~`]+/g, "") // emphasis / inline code markers
    .trim();
}

/**
 * Extracts ATX headings (# .. ######) from raw markdown, skipping fenced
 * code blocks so `# comments` inside code samples are ignored.
 */
export function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  let fenceChar: string | null = null;

  for (const line of markdown.split("\n")) {
    const fence = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      const char = fence[1][0];
      if (fenceChar === null) fenceChar = char;
      else if (char === fenceChar) fenceChar = null;
      continue;
    }
    if (fenceChar) continue;

    const match = line.match(/^(#{1,6})\s+(.*)$/);
    if (!match) continue;

    const text = stripInlineMarkdown(
      match[2].replace(/\s+#+\s*$/, "") // optional closing hashes
    );
    if (!text) continue;

    headings.push({ id: slugify(text), text, depth: match[1].length });
  }

  return headings;
}
