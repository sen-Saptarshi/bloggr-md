---
title: "Rendering Custom Markdown in React with Syntax Highlighting"
date: "2024-10-15"
author: "Saptarshi Sen"
tags: ["React", "Markdown", "Syntax Highlighting", "Frontend", "Tutorial"]
description: "Learn how to build a custom React component to render Markdown with beautiful syntax highlighting using React Markdown and React Syntax Highlighter."
---

### ✨ Introduction

Markdown is a popular choice for writing blog posts, documentation, and developer notes. When working with React, rendering Markdown content dynamically can unlock powerful use cases like blog engines, CMSs, or knowledge bases.

In this tutorial, we'll build a **fully customized Markdown renderer** in React using [`react-markdown`](https://github.com/remarkjs/react-markdown) and [`react-syntax-highlighter`](https://github.com/react-syntax-highlighter/react-syntax-highlighter) to support:

- Headings and paragraphs with custom styles
- Syntax-highlighted code blocks
- Inline code styling
- Blockquotes, lists, and images
- TailwindCSS styling (including dark mode)

---

### 🔧 Setting Up the Component

Here's the complete `Markdown.tsx` component with syntax highlighting using `Prism`.
You can also create your own `jsx` version of this component. Just remove the `interfaces` and `types`.

```js
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
    <div className={`prose prose-neutral dark:prose-invert ${className || ""}`}>
      <ReactMarkdown
        components={{
          h1: (props) => (
            <h1
              className="text-3xl font-bold mt-6 mb-4 text-primary"
              {...props}
            />
          ),
          h2: (props) => (
            <h2
              className="text-2xl font-semibold mt-5 mb-3 text-primary"
              {...props}
            />
          ),
          h3: (props) => (
            <h3
              className="text-xl font-semibold mt-4 mb-2 text-primary"
              {...props}
            />
          ),
          p: (props) => (
            <p className="leading-relaxed mb-4 text-foreground/80" {...props} />
          ),
          code({ node, inline, className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <Prism
                PreTag="div"
                language={match[1]}
                style={atomDark}
                customStyle={{
                  borderRadius: "0.7rem",
                  padding: "1rem",
                  fontSize: "0.9rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </Prism>
            ) : (
              <code
                className="bg-primary/10 text-primary px-1 rounded"
                {...rest}
              >
                {children}
              </code>
            );
          },
          blockquote: (props) => (
            <blockquote
              className="border-l-4 pl-4 italic text-muted-foreground"
              {...props}
            />
          ),
          ul: (props) => <ul className="list-disc ml-5 mb-4" {...props} />,
          ol: (props) => <ol className="list-decimal ml-5 mb-4" {...props} />,
          li: ({ children, ...props }) => (
            <li className="mb-1" {...props}>
              {children}
            </li>
          ),
          img: (props) => (
            <img
              className="max-w-full h-auto rounded-md shadow-md"
              loading="lazy"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
```

---

### 🌈 Features & Notes

- **Dark Mode Support:** Tailwind’s `dark:prose-invert` keeps the Markdown readable in dark themes.
- **Code Highlighting:** Using Prism themes like `atomDark`, you can easily swap styles to match your brand.
- **Accessibility:** The component respects semantic tags, alt text, and progressive image loading.
- **Performance Tip:** Lazy load this component using `React.lazy` or a dynamic import in Next.js.

---

### 🧪 Usage Example

```tsx
<Markdown
  content={`# Hello World\nThis is a **Markdown** post.\n\n\`\`\`js\nconsole.log("Hello!");\n\`\`\``}
/>
```

---

### 📦 Dependencies

Make sure you have these installed:

```bash
npm install react-markdown react-syntax-highlighter
```

Or with PNPM:

```bash
pnpm add react-markdown react-syntax-highlighter
```
