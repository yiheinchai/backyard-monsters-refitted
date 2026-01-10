/**
 * generate-asset-map.js
 * 
 * Scans the sprites/ and images/ directories to generate an asset map
 * that maps symbol names to file paths.
 * 
 * Run with: node scripts/tools/generate-asset-map.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SPRITES_DIR = path.join(ROOT_DIR, '..', 'sprites');
const IMAGES_DIR = path.join(ROOT_DIR, '..', 'images');
const OUTPUT_FILE = path.join(ROOT_DIR, 'core', 'asset-map.json');

/**
 * Extract symbol name from sprite directory name.
 * Format: DefineSprite_1630_popup_siegebrag_popup_siegebrag -> popup_siegebrag
 */
function extractSymbolFromSpriteDir(dirName) {
    // Pattern: DefineSprite_<id>_<symbolName>_<symbolName>
    const match = dirName.match(/^DefineSprite_\d+_(.+)$/);
    if (match) {
        const fullName = match[1];
        // Split by underscore and take the first half (symbol name appears twice)
        const parts = fullName.split('_');
        const halfLen = Math.floor(parts.length / 2);
        const symbolName = parts.slice(0, halfLen).join('_');
        
        return symbolName || fullName;
    }
    
    // Try simpler pattern: DefineSprite_<id>
    const simpleMatch = dirName.match(/^DefineSprite_(\d+)$/);
    if (simpleMatch) {
        return `sprite_${simpleMatch[1]}`;
    }
    
    return null;
}

/**
 * Extract symbol name from image file name.
 * Format: 2174_isograss1_isograss1.jpg -> isograss1
 */
function extractSymbolFromImage(fileName) {
    // Remove extension
    const baseName = fileName.replace(/\.(png|jpg|jpeg)$/i, '');
    
    // Pattern: <id>_<symbolName>_<symbolName>
    const match = baseName.match(/^\d+_(.+)$/);
    if (match) {
        const fullName = match[1];
        const parts = fullName.split('_');
        const halfLen = Math.floor(parts.length / 2);
        if (halfLen > 0 && parts.slice(0, halfLen).join('_') === parts.slice(halfLen).join('_')) {
            return parts.slice(0, halfLen).join('_');
        }
        return fullName;
    }
    
    return baseName;
}

function generateAssetMap() {
    const assetMap = {};
    
    // Scan sprites directory
    if (fs.existsSync(SPRITES_DIR)) {
        const spriteDirs = fs.readdirSync(SPRITES_DIR);
        for (const dir of spriteDirs) {
            const fullPath = path.join(SPRITES_DIR, dir);
            if (fs.statSync(fullPath).isDirectory()) {
                const symbol = extractSymbolFromSpriteDir(dir);
                if (symbol) {
                    // Store relative path from scripts/
                    assetMap[symbol] = `../sprites/${dir}`;
                }
            }
        }
        console.log(`Scanned ${spriteDirs.length} sprite directories`);
    } else {
        console.warn(`Sprites directory not found: ${SPRITES_DIR}`);
    }
    
    // Scan images directory
    if (fs.existsSync(IMAGES_DIR)) {
        const imageFiles = fs.readdirSync(IMAGES_DIR);
        for (const file of imageFiles) {
            const fullPath = path.join(IMAGES_DIR, file);
            if (fs.statSync(fullPath).isFile() && /\.(png|jpg|jpeg)$/i.test(file)) {
                const symbol = extractSymbolFromImage(file);
                if (symbol) {
                    assetMap[symbol] = `../images/${file}`;
                }
            }
        }
        console.log(`Scanned ${imageFiles.length} image files`);
    } else {
        console.warn(`Images directory not found: ${IMAGES_DIR}`);
    }
    
    return assetMap;
}

function main() {
    console.log('Generating asset map...');
    console.log(`Sprites dir: ${SPRITES_DIR}`);
    console.log(`Images dir: ${IMAGES_DIR}`);
    
    const assetMap = generateAssetMap();
    
    // Ensure core directory exists
    const coreDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(coreDir)) {
        fs.mkdirSync(coreDir, { recursive: true });
    }
    
    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(assetMap, null, 2));
    console.log(`\nGenerated asset map with ${Object.keys(assetMap).length} entries`);
    console.log(`Output: ${OUTPUT_FILE}`);
    
    // Also generate TypeScript version for static imports
    const tsOutput = `// Auto-generated asset map
// Run: node scripts/tools/generate-asset-map.js

export const ASSET_MAP: Record<string, string> = ${JSON.stringify(assetMap, null, 2)};

export default ASSET_MAP;
`;
    
    const tsOutputFile = OUTPUT_FILE.replace('.json', '.ts');
    fs.writeFileSync(tsOutputFile, tsOutput);
    console.log(`TypeScript output: ${tsOutputFile}`);
}

main();
