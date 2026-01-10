/**
 * convert-embeds-to-decorators.js
 * 
 * Converts [Embed] comments to @Embed decorators in TypeScript files.
 * 
 * Run with: node scripts/tools/convert-embeds-to-decorators.js
 */

const fs = require('fs');
const path = require('path');

const SCRIPTS_DIR = path.join(__dirname, '..');

// Find all .ts files with [Embed] comments
function findFilesWithEmbed(dir) {
    const files = [];
    
    function walk(currentDir) {
        const entries = fs.readdirSync(currentDir);
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'core' && entry !== 'tools') {
                walk(fullPath);
            } else if (stat.isFile() && entry.endsWith('.ts')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('[Embed')) {
                    files.push(fullPath);
                }
            }
        }
    }
    
    walk(dir);
    return files;
}

// Extract embed info from a line like: // [Embed(source="/_assets/assets.swf", symbol="popup_siegebrag")]
function parseEmbedComment(line) {
    const match = line.match(/\[Embed\s*\(\s*source\s*=\s*"([^"]+)"\s*,\s*symbol\s*=\s*"([^"]+)"\s*\)/);
    if (match) {
        return { source: match[1], symbol: match[2] };
    }
    
    // Try image-only embed: [Embed(source="/_assets/2174_isograss1_isograss1.jpg")]
    const imageMatch = line.match(/\[Embed\s*\(\s*source\s*=\s*"([^"]+)"\s*\)/);
    if (imageMatch) {
        return { source: imageMatch[1], symbol: null };
    }
    
    return null;
}

// Calculate relative path from file to core/Embed.ts
function getRelativeImportPath(filePath) {
    const fileDir = path.dirname(filePath);
    const coreDir = path.join(SCRIPTS_DIR, 'core');
    let relativePath = path.relative(fileDir, coreDir);
    
    // Ensure forward slashes and proper format
    relativePath = relativePath.replace(/\\/g, '/');
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }
    
    return relativePath + '/Embed';
}

function convertFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    let embedInfo = null;
    let embedLineIndex = -1;
    
    // Find the embed comment
    for (let i = 0; i < lines.length; i++) {
        const info = parseEmbedComment(lines[i]);
        if (info) {
            embedInfo = info;
            embedLineIndex = i;
            break;
        }
    }
    
    if (!embedInfo) {
        console.log(`  No valid embed found: ${filePath}`);
        return false;
    }
    
    // Find the class declaration
    let classLineIndex = -1;
    for (let i = embedLineIndex; i < lines.length; i++) {
        if (lines[i].match(/^\s*export\s+class\s+/)) {
            classLineIndex = i;
            break;
        }
    }
    
    if (classLineIndex === -1) {
        console.log(`  No class found after embed: ${filePath}`);
        return false;
    }
    
    // Check if decorator is already present
    if (content.includes('@Embed(')) {
        console.log(`  Already has decorator: ${filePath}`);
        return false;
    }
    
    // Build the decorator
    let decorator;
    if (embedInfo.symbol) {
        decorator = `@Embed({ source: "${embedInfo.source}", symbol: "${embedInfo.symbol}" })`;
    } else {
        decorator = `@EmbedImage({ source: "${embedInfo.source}" })`;
    }
    
    // Insert decorator before the class
    lines.splice(classLineIndex, 0, decorator);
    
    // Add import if not present
    const importPath = getRelativeImportPath(filePath);
    const importStatement = `import { Embed } from "${importPath}";`;
    
    if (!content.includes('import { Embed }')) {
        // Find last import line
        let lastImportIndex = -1;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ')) {
                lastImportIndex = i;
            }
        }
        
        if (lastImportIndex >= 0) {
            lines.splice(lastImportIndex + 1, 0, importStatement);
        } else {
            lines.unshift(importStatement);
        }
    }
    
    // Write back
    fs.writeFileSync(filePath, lines.join('\n'));
    return true;
}

function main() {
    console.log('Finding files with [Embed] comments...');
    const files = findFilesWithEmbed(SCRIPTS_DIR);
    console.log(`Found ${files.length} files with [Embed] comments\n`);
    
    let converted = 0;
    let skipped = 0;
    
    for (const file of files) {
        const relativePath = path.relative(SCRIPTS_DIR, file);
        console.log(`Processing: ${relativePath}`);
        
        if (convertFile(file)) {
            converted++;
            console.log(`  ✓ Converted`);
        } else {
            skipped++;
        }
    }
    
    console.log(`\n=== Summary ===`);
    console.log(`Converted: ${converted}`);
    console.log(`Skipped: ${skipped}`);
    console.log(`Total: ${files.length}`);
}

main();
