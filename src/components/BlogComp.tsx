import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router";
import { ArrowLeft, Calendar, ChevronDown, List, User } from "lucide-react";
import { Markdown } from "./Markdown";
import TagList from "./TagList";
import { TableOfContents } from "./TableOfContents";
import { extractHeadings } from "@/lib/toc";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post }: PostDetailProps) {
  const headings = useMemo(() => extractHeadings(post.body), [post.body]);
  const progressRef = useRef<HTMLDivElement>(null);

  // Slim reading-progress bar pinned to the very top of the viewport.
  // Driven by rAF + ref (no React re-renders) and a GPU-composited
  // scaleX transform so it stays perfectly smooth while scrolling.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const p = total > 0 ? Math.min(1, window.scrollY / total) : 0;
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${p})`
      );
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-6xl">
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-0.5">
        <div
          ref={progressRef}
          style={{ transform: "scaleX(0)" }}
          className="h-full w-full origin-left bg-primary will-change-transform"
        />
      </div>

      <div className="mt-8 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            {/* 5.5rem = navbar (h-14) + grid gap (mt-8): matches the rail's natural
                position exactly, so it is pinned from the first pixel of scrolling
                and its border runs flush from navbar to viewport bottom. */}
            <div className="sticky top-[6rem] h-[calc(100vh-6rem)] overflow-y-auto border-r border-border pr-6 pb-8">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}

        <article className="mx-auto w-full max-w-2xl min-w-0 lg:mx-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>

          <header className="mt-4 border-b border-border pb-6">
            <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {post.attributes.title}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {post.attributes.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {post.attributes.author}
              </span>
            </p>
            <TagList tags={post.attributes.tags} />

            {headings.length > 0 && (
              <details className="group mt-2 rounded-lg border border-border bg-card/40 px-4 py-3 lg:hidden">
                <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                  <List className="h-4 w-4" />
                  On this page
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="mt-3">
                  <TableOfContents headings={headings} showLabel={false} />
                </div>
              </details>
            )}
          </header>

          <Markdown content={post.body} />
        </article>
      </div>
    </div>
  );
}
