#!/usr/bin/env node
/**
 * Script to fix OpenFL imports - converts module-level imports to specific class imports
 * Example: `import { MovieClip, Sprite } from "openfl/display";`
 * Becomes: `import MovieClip from "openfl/display/MovieClip";`
 *          `import Sprite from "openfl/display/Sprite";`
 */

const fs = require('fs');
const path = require('path');

// Find all .ts files in scripts directory
function findTsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findTsFiles(filePath, fileList);
        } else if (file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

// Pattern to match module-level OpenFL imports with named exports
// Matches: import { Class1, Class2 } from "openfl/modulename";
const namedImportPattern = /^import\s*\{\s*([^}]+)\s*\}\s*from\s*["']openfl\/([^/"']+)["'];?$/;

// Pattern for default imports from module (not a specific class path)
// Matches: import ClassName from "openfl/modulename";
const defaultModuleImportPattern = /^import\s+(\w+)\s+from\s*["']openfl\/([^/"']+)["'];?$/;

function fixImports(content) {
    const lines = content.split('\n');
    const newLines = [];
    let modified = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check for named import pattern: import { A, B } from "openfl/module";
        const namedMatch = trimmedLine.match(namedImportPattern);
        if (namedMatch) {
            const classNames = namedMatch[1].split(',').map(s => s.trim()).filter(s => s);
            const moduleName = namedMatch[2];
            
            // Generate individual imports for each class
            for (const className of classNames) {
                newLines.push(`import ${className} from "openfl/${moduleName}/${className}";`);
            }
            modified = true;
            continue;
        }
        
        // Check for default import from module level: import MouseEvent from "openfl/events";
        const defaultMatch = trimmedLine.match(defaultModuleImportPattern);
        if (defaultMatch) {
            const className = defaultMatch[1];
            const moduleName = defaultMatch[2];
            
            // Convert to specific path
            newLines.push(`import ${className} from "openfl/${moduleName}/${className}";`);
            modified = true;
            continue;
        }
        
        // Keep line as-is
        newLines.push(line);
    }

    return { content: newLines.join('\n'), modified };
}

// Main execution
const scriptsDir = path.join(__dirname);
const tsFiles = findTsFiles(scriptsDir);

let filesModified = 0;
for (const filePath of tsFiles) {
    // Skip this script itself
    if (filePath.endsWith('fix-openfl-imports.js')) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    const result = fixImports(content);
    
    if (result.modified) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        console.log(`Fixed: ${filePath}`);
        filesModified++;
    }
}

console.log(`\nDone! Modified ${filesModified} files.`);
