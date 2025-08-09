/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "isomorphic-dompurify";

// Define types for clarity
interface StyleConfig {
  table: string;
  tableHeader: string;
  tableCell: string;
  link: string;
  list: string;
  listItem: string;
  code: string;
}

// Centralized style configuration
const styles: StyleConfig = {
  table: "w-full overflow-x-auto rounded-lg ",
  tableHeader: "border border-gray-300 p-2 text-left font-semibold bg-muted",
  tableCell: "border border-gray-300 p-2 text-sm ",
  link: "text-blue-600 underline",
  list: "list-disc list-inside",
  listItem: "  rounded",
  code: "bg-gray-100 rounded px-2 py-1 font-mono text-sm",
};

const wrapBoldText = (text: string): string => {
  const regex = /\[(.*?)\]/g;
  return text.replace(
    regex,
    (_, boldText) =>
      `<span class="font-bold transition-colors">${boldText}</span>`
  );
};

const preprocessLinks = (text: string): string => {
  // Convert (domain.com(https://...)) format to [domain.com](https://...)
  const linkRegex = /\(([^)]+)\((https?:\/\/[^)]+)\)\)/g;
  return text.replace(linkRegex, "[$1]($2)");
};

const sanitizeContent = (content: string): string => {
  // Remove custom span tags with font-bold classes
  const cleanedContent = content.replace(
    /<span class="font-bold transition-colors">(.*?)<\/span>/g,
    "$1"
  );

  // Use DOMPurify to sanitize the content
  return DOMPurify.sanitize(cleanedContent, {
    ALLOWED_TAGS: [
      "p",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "code",
      "pre",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
    KEEP_CONTENT: true,
  });
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const preprocessedContent = preprocessLinks(children);
  const sanitizedContent = sanitizeContent(wrapBoldText(preprocessedContent));

  const components = {
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} mt-2 w-[80dvw] overflow-x-scroll rounded-lg bg-zinc-100 p-3 text-sm dark:bg-zinc-800 md:max-w-[500px]`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`}
          {...props}
        >
          {children}
        </code>
      );
    },
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="ml-4 list-outside list-decimal space-y-1" {...props}>
          {children}
        </ol>
      );
    },
    li: ({ node, children, ...props }: any) => {
      return (
        <li className={`${styles.listItem} leading-relaxed`} {...props}>
          {Array.isArray(children)
            ? children.map((child, i) =>
                typeof child === "string"
                  ? React.createElement(
                      "span",
                      { key: i },
                      child.replace(/\n/g, "")
                    )
                  : child
              )
            : children}
        </li>
      );
    },
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className={`${styles.list} ml-4 list-outside space-y-1`} {...props}>
          {children}
        </ul>
      );
    },
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    a: ({ node, children, ...props }: any) => {
      return (
        <a
          className="cursor-pointer text-blue-600 hover:cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          ({children})
        </a>
      );
    },
    table: ({ children }: any) => (
      <div className="overflow-x-auto">
        <table className={styles.table}>{children}</table>
      </div>
    ),
    thead: ({ children }: any) => <thead>{children}</thead>,
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr className="cursor-pointer transition-colors hover:bg-muted">
        {children}
      </tr>
    ),
    th: ({ children }: any) => (
      <th className={styles.tableHeader}>{children}</th>
    ),
    td: ({ children }: any) => <td className={styles.tableCell}>{children}</td>,
    p: ({ node, children, ...props }: any) => {
      return (
        <p className="leading-relaxed" {...props}>
          {children}
        </p>
      );
    },
  };

  return (
    <div className="leading-relaxed space-y-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
);
