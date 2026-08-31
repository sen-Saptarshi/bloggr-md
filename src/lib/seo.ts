import { useEffect } from "react";

export const SITE_NAME = "Sapt Blogs";
export const BASE_URL = "https://blog.saptdev.me";
export const DEFAULT_TITLE = `${SITE_NAME} - Tech notes on web, cloud & crypto`;
export const DEFAULT_DESCRIPTION =
  "Essays and hands-on notes by Saptarshi Sen on React, Next.js, AWS, Docker, modern CSS, cryptography and web3.";

export interface SeoOptions {
  /** Raw page/post title — the site name suffix is added automatically. */
  title?: string;
  description?: string;
  /** Hash-router path, e.g. "/" or "/#/blog/my-post". */
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
  tags?: string[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

const JSON_LD_ID = "seo-jsonld";

/**
 * Keeps <title>, meta description, Open Graph/Twitter tags, canonical URL and
 * (for articles) JSON-LD structured data in sync with the current page.
 * Googlebot renders JS, so runtime meta still counts; static meta in
 * index.html covers crawlers that don't.
 */
export function useSeo({
  title,
  description,
  path = "/",
  type = "website",
  publishedTime,
  author,
  tags,
}: SeoOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} - ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const url = BASE_URL + path;

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    if (author) upsertMeta("name", "author", author);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertCanonical(url);

    // Article-only tags: rebuild on every run so stale ones never linger.
    document.head
      .querySelectorAll('meta[property^="article:"]')
      .forEach((el) => el.remove());
    document.getElementById(JSON_LD_ID)?.remove();

    if (type === "article") {
      if (publishedTime)
        upsertMeta("property", "article:published_time", publishedTime);
      for (const tag of tags ?? []) {
        const el = document.createElement("meta");
        el.setAttribute("property", "article:tag");
        el.content = tag;
        document.head.appendChild(el);
      }

      const script = document.createElement("script");
      script.id = JSON_LD_ID;
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: desc,
        datePublished: publishedTime,
        author: { "@type": "Person", name: author },
        keywords: (tags ?? []).join(", "),
        mainEntityOfPage: url,
      });
      document.head.appendChild(script);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      document.getElementById(JSON_LD_ID)?.remove();
    };
  }, [title, description, path, type, publishedTime, author, tags]);
}
