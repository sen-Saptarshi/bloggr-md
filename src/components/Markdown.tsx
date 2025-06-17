import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown: React.FC<MarkdownProps> = ({ content, className }) => {
  return (
    <div
      className={`prose prose-neutral dark:prose-invert  ${className}`}
    >
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
            <p
              className="leading-relaxed mb-4 text-foreground/80"
              {...props}
            />
          ),
          code({ children, className, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <Prism
                PreTag="div"
                language={match[1]}
                style={atomDark}
                customStyle={{
                  borderRadius: "0.7rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </Prism>
            ) : (
              // Handle inline code (e.g. `this is a tag`)
              <code
                className="bg-primary/10 text-primary px-1  rounded"
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
