import { ExternalLink } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div className={`prose prose-neutral dark:prose-invert  ${className}`}>
      <ReactMarkdown
        components={{
          h1: ({ ...props }) => (
            <h1
              className="text-3xl font-bold mt-6 mb-4 text-primary"
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              className="text-2xl font-semibold mt-5 mb-3 text-primary"
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              className="text-xl font-semibold mt-4 mb-2 text-primary"
              {...props}
            />
          ),
          p: ({ ...props }) => (
            <p className="leading-relaxed mb-4 text-foreground/80" {...props} />
          ),
          code({ node, className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            return match ? (
              <div className="relative group my-4">
                <CopyButton text={codeString} />
                <Prism
                  PreTag="div"
                  language={match[1]}
                  style={atomDark}
                  customStyle={{
                    borderRadius: "0.7rem",
                    padding: "1rem",
                    fontSize: "0.9rem",
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
      className="absolute cursor-pointer top-0 right-0 text-xs px-2 py-0 w-15 bg-black/50 text-white rounded rounded-tr-lg"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
};
