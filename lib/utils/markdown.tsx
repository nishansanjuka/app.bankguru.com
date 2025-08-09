import DOMPurify from "dompurify";
import { marked } from "marked";
import { JSX } from "react";

export const stripMarkdown = (markdown: string) => {
  return (
    markdown
      // Remove HTML tags
      .replace(/<\/?[^>]+(>|$)/g, "")
      // Remove Markdown headers
      .replace(/(#+\s*)/g, "")
      // Remove emphasis (bold/italic)
      .replace(/(\*{1,2}|_{1,2})/g, "")
      // Remove links and images
      .replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, "")
      // Remove code blocks and inline code
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      // Remove blockquotes
      .replace(/^\s*>/gm, "")
      // Remove horizontal rules
      .replace(/-{3,}/g, "")
      // Remove list markers (bullet points, numbers)
      .replace(/^\s*[-+*]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      // Normalize spaces and line breaks
      .replace(/\n{2,}/g, "\n")
      // Remove the opening and closing brackets
      .replace(/\[|\]/g, "")
      // Normalize spaces and line breaks
      .replace(/\n{2,}/g, "\n")
      .trim()
  );
};

const wrapBoldText = (text: string): string => {
  // Regular expression to match text within square brackets
  const regex = /\[(.*?)\]/g;

  // Replace the text inside brackets with <b> tags
  return text.replace(regex, (_, boldText) => `<b>${boldText}</b>`);
};
export const renderContent = (text: string): JSX.Element => {
  // Step 1: Parse and sanitize the markdown content
  const markdownHTML = DOMPurify.sanitize(marked(text) as string | Node);

  // Step 2: Apply the custom bold logic for text inside square brackets
  const customFormattedHTML = wrapBoldText(markdownHTML);

  // Step 3: Render the final HTML safely in React with regular line height and reduced margins
  return (
    <div
      style={{
        lineHeight: "normal",
      }}
      className="[&>*]:my-1 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
      dangerouslySetInnerHTML={{ __html: customFormattedHTML }}
    />
  );
};
