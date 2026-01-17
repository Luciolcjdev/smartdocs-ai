import * as parser from "@babel/parser";
import type { NodePath } from "@babel/traverse";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

export interface ParsedFunction {
  name: string;
  params: string[];
  returnType?: string;
  description: string;
  startLine: number;
  endLine: number;
  code: string;
}

export interface ParsedClass {
  name: string;
  methods: ParsedFunction[];
  properties: string[];
  startLine: number;
  endLine: number;
}

export interface ParsedImport {
  source: string;
  imports: string[];
}

export interface ParseResult {
  functions: ParsedFunction[];
  classes: ParsedClass[];
  imports: ParsedImport[];
  exports: string[];
}

export function parseJavaScript(code: string, isTypeScript = false): ParseResult {
  const result: ParseResult = {
    functions: [],
    classes: [],
    imports: [],
    exports: [],
  };

  try {
    const ast = parser.parse(code, {
      sourceType: "module",
      plugins: isTypeScript ? ["typescript", "jsx"] : ["jsx"],
    });

    traverse(ast, {
      // Parse imports
      ImportDeclaration(path) {
        const source = path.node.source.value;
        const imports = path.node.specifiers
          .map((spec) => {
            if (t.isImportDefaultSpecifier(spec)) {
              return spec.local.name;
            } else if (t.isImportSpecifier(spec)) {
              if (t.isIdentifier(spec.imported)) {
                return spec.imported.name;
              }
              if (t.isStringLiteral(spec.imported)) {
                return spec.imported.value;
              }
            }

            return "";
          })
          .filter(Boolean);

        result.imports.push({ source, imports });
      },

      // Parse function declarations
      FunctionDeclaration(path) {
        const node = path.node;
        const name = node.id?.name || "anonymous";

        result.functions.push({
          name,
          params: node.params.map((param) => {
            if (t.isIdentifier(param)) return param.name;
            if (t.isRestElement(param) && t.isIdentifier(param.argument)) {
              return `...${param.argument.name}`;
            }
            return "param";
          }),
          description: extractJSDoc(path),
          startLine: node.loc?.start.line || 0,
          endLine: node.loc?.end.line || 0,
          code: code.substring(node.start || 0, node.end || 0),
        });
      },

      // Parse arrow functions assigned to variables
      VariableDeclarator(path) {
        const node = path.node;
        if (
          t.isIdentifier(node.id) &&
          (t.isArrowFunctionExpression(node.init) || t.isFunctionExpression(node.init))
        ) {
          const name = node.id.name;
          const func = node.init;

          result.functions.push({
            name,
            params: func.params.map((param) => {
              if (t.isIdentifier(param)) return param.name;
              return "param";
            }),
            description: extractJSDoc(path.parentPath),
            startLine: func.loc?.start.line || 0,
            endLine: func.loc?.end.line || 0,
            code: code.substring(func.start || 0, func.end || 0),
          });
        }
      },

      // Parse classes
      ClassDeclaration(path) {
        const node = path.node;
        const className = node.id?.name || "AnonymousClass";

        const methods: ParsedFunction[] = [];
        const properties: string[] = [];

        node.body.body.forEach((member) => {
          if (t.isClassMethod(member) && t.isIdentifier(member.key)) {
            methods.push({
              name: member.key.name,
              params: member.params.map((param) => {
                if (t.isIdentifier(param)) return param.name;
                return "param";
              }),
              description: "",
              startLine: member.loc?.start.line || 0,
              endLine: member.loc?.end.line || 0,
              code: code.substring(member.start || 0, member.end || 0),
            });
          } else if (t.isClassProperty(member) && t.isIdentifier(member.key)) {
            properties.push(member.key.name);
          }
        });

        result.classes.push({
          name: className,
          methods,
          properties,
          startLine: node.loc?.start.line || 0,
          endLine: node.loc?.end.line || 0,
        });
      },

      // Parse exports
      ExportNamedDeclaration(path) {
        if (path.node.declaration) {
          if (t.isFunctionDeclaration(path.node.declaration)) {
            result.exports.push(path.node.declaration.id?.name || "");
          } else if (t.isVariableDeclaration(path.node.declaration)) {
            path.node.declaration.declarations.forEach((decl) => {
              if (t.isIdentifier(decl.id)) {
                result.exports.push(decl.id.name);
              }
            });
          }
        }
      },

      ExportDefaultDeclaration(_path) {
        result.exports.push("default");
      },
    });
  } catch (error) {
    console.error("Parse error:", error);
  }

  return result;
}

function extractJSDoc(path: NodePath<t.Node>): string {
  const comments = path.node.leadingComments;
  if (!comments || comments.length === 0) return "";

  const jsdocComments = comments.filter(
    (c): c is t.CommentBlock => c.type === "CommentBlock" && c.value.trim().startsWith("*"),
  );

  if (jsdocComments.length === 0) return "";

  return jsdocComments
    .map((c) =>
      c.value
        .split("\n")
        .map((line) => line.trim().replace(/^\*\s?/, ""))
        .join("\n")
        .trim(),
    )
    .join("\n\n");
}

export function parseTypeScript(code: string): ParseResult {
  return parseJavaScript(code, true);
}
