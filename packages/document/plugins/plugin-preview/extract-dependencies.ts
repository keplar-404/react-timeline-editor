// Use @babel/parser for AST parsing
import * as parser from '@babel/parser';
import type Traverse from '@babel/traverse';
import type { File } from '@babel/types';
import * as fs from 'fs-extra';
import * as path from 'node:path';

// Check if it is a local path (relative path or path within the project)
function isLocalPath(path: string): boolean {
  return path.startsWith('./') || path.startsWith('../') || (!path.startsWith('http') && !path.startsWith('@') && !path.includes('/node_modules/'));
}

// Try to add common extensions
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.css', '.json'];
// Resolve import path, handle cases without extensions
export function resolveImportPath(baseDir: string, importPath: string): string | null {
  // Check if it already has an extension
  const hasExtension = extensions.some((ext) => importPath.endsWith(ext));

  if (hasExtension) {
    const fullPath = path.resolve(baseDir, importPath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
    return null;
  }

  // Try adding different extensions
  for (const ext of extensions) {
    const fullPath = path.resolve(baseDir, `${importPath}${ext}`);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  // Try resolving as a directory, looking for index files
  for (const ext of extensions) {
    const fullPath = path.resolve(baseDir, importPath, `index${ext}`);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

export function getFileType(filePath: string) {
  const ext = path.extname(filePath);
  const extension = extensions.find((item) => item === ext);
  if (!extension) return;
  return extension.replace('.', '');
}

// Resolve path alias
export function resolveAlias(filePath: string, alias?: Record<string, string>): string | null {
  if (!alias || typeof alias !== 'object') {
    return filePath;
  }

  // Check if the path is already an absolute path
  if (path.isAbsolute(filePath)) {
    const baseDir = path.dirname(filePath);
    return resolveImportPath(baseDir, filePath);
  }

  // Check if the path contains an alias
  for (const [aliasKey, aliasPath] of Object.entries(alias)) {
    // If the path starts with an alias
    if (filePath.startsWith(aliasKey + '/') || filePath === aliasKey) {
      // Replace the alias part
      const replacedPath = filePath.replace(aliasKey, aliasPath);
      const baseDir = path.dirname(replacedPath);
      return resolveImportPath(baseDir, replacedPath);
    }
  }

  return filePath;
}

/**
 * remark plugin to transform code to demo
 */
// Extract dependencies from file content
export function extractDependencies(fileContent: string, baseDir: string): string[] {
  const dependencies: string[] = [];

  try {
    // Parse JS/TS/JSX/TSX files
    const ast = parser.parse(fileContent, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'decorators-legacy'],
    });

    const traverse: { default: typeof Traverse } = require('@babel/traverse');
    // Traverse AST to extract import statements and require calls
    traverse.default(ast as File, {
      ImportDeclaration(path) {
        const importPath = path.node.source.value;
        // Ignore dependencies in node_modules, only process relative paths and project paths
        if (isLocalPath(importPath)) {
          const fullPath = resolveImportPath(baseDir, importPath);
          if (fullPath && fs.existsSync(fullPath)) {
            dependencies.push(fullPath);
          }
        }
      },

      CallExpression(path) {
        // Handle require calls
        if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'require') {
          const arg = path.node.arguments[0];
          if (arg && arg.type === 'StringLiteral') {
            const requirePath = arg.value;
            if (isLocalPath(requirePath)) {
              const fullPath = resolveImportPath(baseDir, requirePath);
              if (fullPath && fs.existsSync(fullPath)) {
                dependencies.push(fullPath);
              }
            }
          }
        }
      },
    });
  } catch (error) {
    console.warn(`Failed to parse file content: ${error}`);
  }

  return dependencies;
}
