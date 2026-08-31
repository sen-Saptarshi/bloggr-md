import { Check, Copy, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/toc";

interface MarkdownProps {
  content: string;
  className?: string;
}

// Recursively extracts plain text from react-markdown children so heading
// ids can be slugified the same way the TOC extractor does.
function getNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");
  if (React.isValidElement(node)) {
    return getNodeText((node.props as { children?: React.ReactNode }).children);
  }
  return "";
}

// scroll-mt keeps anchored headings clear of the sticky navbar.
const headingClass = "scroll-mt-24 text-primary";

export const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={`prose prose-neutral dark:prose-invert  ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              id={slugify(getNodeText(children))}
              className={`${headingClass} text-3xl font-bold mt-6 mb-4`}
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              id={slugify(getNodeText(children))}
              className={`${headingClass} text-2xl font-semibold mt-5 mb-3`}
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              id={slugify(getNodeText(children))}
              className={`${headingClass} text-xl font-semibold mt-4 mb-2`}
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              id={slugify(getNodeText(children))}
              className={`${headingClass} text-lg font-semibold mt-4 mb-2`}
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ ...props }) => (
            <p className="leading-relaxed mb-4 text-foreground/80" {...props} />
          ),
          code({ className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            return match ? (
              <div className="relative group my-4">
                <CopyButton text={codeString} />
                <span className="absolute top-0 left-0 px-4 py-2 text-xs text-white/40 select-none">
                  {match[1]}
                </span>
                <Prism
                  PreTag="div"
                  language={match[1]}
                  style={atomDark}
                  customStyle={{
                    borderRadius: "0.7rem",
                    padding: "1rem",
                    paddingTop: "2rem",
                    fontSize: "0.85rem",
                    margin: 0,
                  }}
                >
                  {codeString}
                </Prism>
              </div>
            ) : (
              <code
                className="bg-primary/10 text-primary px-1 rounded"
                {...rest}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 pl-4 italic text-muted-foreground"
              {...props}
            />
          ),
          ul: ({ ...props }) => (
            <ul className="list-disc ml-4 mb-4" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal ml-4 mb-4" {...props} />
          ),
          li: ({ children, ...props }) => (
            <li className="mb-2" {...props}>
              {children}
            </li>
          ),
          img: ({ ...props }) => (
            <img className="max-w-full h-auto rounded-md" {...props} />
          ),
          a: ({ children, ...props }) => (
            <a
              className="text-blue-400 inline-flex items-center gap-1 hover:underline"
              {...props}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
              <ExternalLink className="w-4 h-4 inline" />
            </a>
          ),
          table: ({ ...props }) => (
            <div className="max-w-full overflow-x-auto p-1">
              <table
                className="w-fit border-collapse my-4 text-sm rounded-md overflow-hidden shadow-sm ring-1 ring-border"
                {...props}
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead className="bg-muted/50 text-foreground/80">
              {props.children}
            </thead>
          ),
          tbody: ({ ...props }) => (
            <tbody className="bg-background">{props.children}</tbody>
          ),
          tr: ({ ...props }) => (
            <tr
              className="border-b border-border last:border-none hover:bg-muted/70 transition-colors"
              {...props}
            />
          ),
          th: ({ ...props }) => (
            <th
              className="text-left px-4 py-3 font-semibold text-foreground bg-accent border-b border-border"
              {...props}
            />
          ),
          td: ({ ...props }) => (
            <td className="px-4 py-3 text-foreground/80 align-top" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute cursor-pointer top-0 right-0 text-xs p-3 text-white/50 hover:text-white/80"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400/80" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
};
