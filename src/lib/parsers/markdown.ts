// lib/parsers/markdown.ts
import matter from "gray-matter";

export interface MarkdownParseResult {
  frontmatter: Record<string, unknown>;
  content: string;
  headings: { level: number; text: string }[];
  codeBlocks: { language: string; code: string }[];
}

export function parseMarkdown(content: string): MarkdownParseResult {
  const { data, content: markdown } = matter(content);

  // Extract headings
  const headings: { level: number; text: string }[] = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
    });
  }

  // Extract code blocks
  const codeBlocks: { language: string; code: string }[] = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    codeBlocks.push({
      language: match[1] || "text",
      code: match[2].trim(),
    });
  }

  return {
    frontmatter: data,
    content: markdown,
    headings,
    codeBlocks,
  };
}
