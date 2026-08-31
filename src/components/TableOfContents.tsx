import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  headings: TocItem[];
  showLabel?: boolean;
}

// Pixel line under the sticky navbar — a heading is "active" once it
// scrolls past this line. Matches `scroll-mt-24` on the headings.
const ACTIVE_OFFSET = 96;
// Absorbs sub-pixel rounding: scrollIntoView lands a clicked heading exactly
// on the line, but getBoundingClientRect().top is a float (96.0001...) which
// would otherwise fail the check and leave the *previous* item highlighted.
const ACTIVATION_TOLERANCE = 4;

export function TableOfContents({
  headings,
  showLabel = true,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const minDepth = headings.length
    ? Math.min(...headings.map((h) => h.depth))
    : 1;

  // Scroll-position spy: the active heading is the last one that has reached
  // the offset line. Deterministic even across long sections with no headings.
  useEffect(() => {
    if (headings.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const doc = document.documentElement;

      // Reached the bottom of the page -> last heading wins.
      if (window.scrollY + doc.clientHeight >= doc.scrollHeight - 4) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }

      let current: string | null = null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET + ACTIVATION_TOLERANCE)
          current = h.id;
        else break; // headings are in document (vertical) order
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  // NOTE: buttons + scrollIntoView, not <a href="#..."> — the app uses
  // HashRouter, so changing the URL hash would break client-side routing.
  const scrollTo = (id: string) => {
    setActiveId(id); // instant feedback; the spy takes over from here
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <nav aria-label="Table of contents">
      {showLabel && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          On this page
        </p>
      )}
      <ul className="space-y-0.5">
        {headings.map((h, i) => (
          <li key={`${h.id}-${i}`}>
            <button
              onClick={() => scrollTo(h.id)}
              style={{
                paddingLeft: `${0.75 + (h.depth - minDepth) * 0.875}rem`,
              }}
              className={cn(
                "block w-full truncate rounded-md py-1.5 pr-2 text-left text-sm transition-colors",
                activeId === h.id
                  ? "bg-accent font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
