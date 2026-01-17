// lib/process-file.ts
import { parseJavaScript, parseTypeScript } from "./parsers/javascript";
import { parseMarkdown } from "./parsers/markdown";
import { parsePython } from "./parsers/python";

export async function processFile(fileUrl: string, fileName: string) {
  if (!fileUrl) throw new Error("fileUrl is missing");
  if (!fileName) throw new Error("fileName is missing");

  // Fetch file content
  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch file. Status: ${response.status}`);
  }

  const content = await response.text();

  const extension = fileName.split(".").pop()?.toLowerCase();

  let parseResult: unknown;
  let language: string = "text";

  try {
    switch (extension) {
      case "js":
      case "jsx":
        parseResult = parseJavaScript(content, false);
        language = "javascript";
        break;

      case "ts":
      case "tsx":
        parseResult = parseTypeScript(content);
        language = "typescript";
        break;

      case "py":
        parseResult = parsePython(content);
        language = "python";
        break;

      case "md":
        parseResult = parseMarkdown(content);
        language = "markdown";
        break;

      default:
        parseResult = { raw: content };
        language = "text";
    }
  } catch (e) {
    // Se parser falhar, retornamos o raw
    parseResult = { raw: content, error: (e as Error).message };
  }

  return {
    fileName,
    fileUrl,
    language,
    content,
    parsed: parseResult,
  };
}
