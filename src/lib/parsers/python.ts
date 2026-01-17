// lib/parsers/python.ts
export interface PythonFunction {
  name: string;
  params: string[];
  docstring: string;
  decorators: string[];
  startLine: number;
  code: string;
}

export interface PythonClass {
  name: string;
  methods: PythonFunction[];
  docstring: string;
  startLine: number;
}

export interface PythonParseResult {
  functions: PythonFunction[];
  classes: PythonClass[];
  imports: string[];
}

export function parsePython(code: string): PythonParseResult {
  const result: PythonParseResult = {
    functions: [],
    classes: [],
    imports: [],
  };

  const lines = code.split("\n");

  // Parse imports
  const importRegex = /^(?:from\s+(\S+)\s+)?import\s+(.+)/;
  lines.forEach((line) => {
    const match = line.trim().match(importRegex);
    if (match) {
      result.imports.push(line.trim());
    }
  });

  // Parse functions
  const funcRegex = /^(?:@(\w+)\s+)?def\s+(\w+)\s*\(([^)]*)\)\s*(?:->\s*\w+)?:/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(funcRegex);

    if (match) {
      const decorator = match[1];
      const name = match[2];
      const params = match[3]
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      // Extract docstring
      let docstring = "";
      if (lines[i + 1]?.trim().startsWith('"""') || lines[i + 1]?.trim().startsWith("'''")) {
        const quoteType = lines[i + 1].trim().startsWith('"""') ? '"""' : "'''";
        docstring = lines[i + 1].trim().replace(quoteType, "");

        let j = i + 2;
        while (j < lines.length && !lines[j].includes(quoteType)) {
          docstring += "\n" + lines[j];
          j++;
        }
      }

      result.functions.push({
        name,
        params,
        docstring: docstring.trim(),
        decorators: decorator ? [decorator] : [],
        startLine: i + 1,
        code: line,
      });
    }
  }

  // Parse classes
  const classRegex = /^class\s+(\w+)(?:\(([^)]+)\))?:/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(classRegex);

    if (match) {
      const name = match[1];

      // Extract docstring
      let docstring = "";
      if (lines[i + 1]?.trim().startsWith('"""') || lines[i + 1]?.trim().startsWith("'''")) {
        const quoteType = lines[i + 1].trim().startsWith('"""') ? '"""' : "'''";
        docstring = lines[i + 1].trim().replace(quoteType, "");

        let j = i + 2;
        while (j < lines.length && !lines[j].includes(quoteType)) {
          docstring += "\n" + lines[j];
          j++;
        }
      }

      result.classes.push({
        name,
        methods: [],
        docstring: docstring.trim(),
        startLine: i + 1,
      });
    }
  }

  return result;
}
