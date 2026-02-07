import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import BitmapDataChannel from 'openfl/display/BitmapDataChannel';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


/**
 * MAPBG - Map Background Generator
 * Creates procedurally generated terrain tiles for the game map
 * Uses original isograss embedded image assets for grass tiles
 */
export class MAPBG {
    constructor() {}

    public static MakeTile(texture: string = "grass"): BitmapData {
        let groundCompiled: BitmapData = new BitmapData(1000, 500, true, 0);
        try {
            const ti: number = Date.now();
            let tileCount: number = 0;
            let g: Record<string, BitmapData> = {};
            const t: Record<string, BitmapData> = {
                t1: new BitmapData(1000, 500, true, 0),
                t2: new BitmapData(1000, 500, true, 0),
                t3: new BitmapData(1000, 500, true, 0),
                t4: new BitmapData(1000, 500, true, 0),
                t5: new BitmapData(1000, 500, true, 0),
                t6: new BitmapData(1000, 500, true, 0),
                t7: new BitmapData(1000, 500, true, 0)
            };

            // Initialize tile textures based on terrain type
            // Uses original game asset classes (isograss1-7) for grass
            if (texture === "lava") {
                g = {
                    g1: new BitmapData(200, 100, true, 0xFF330000),
                    g2: new BitmapData(200, 100, true, 0xFF440000),
                    g3: new BitmapData(200, 100, true, 0xFF550000),
                    g4: new BitmapData(200, 100, true, 0xFF660000)
                };
                tileCount = 4;
            } else if (texture === "rock") {
                g = {
                    g1: new BitmapData(200, 100, true, 0xFF555555),
                    g2: new BitmapData(200, 100, true, 0xFF666666),
                    g3: new BitmapData(200, 100, true, 0xFF777777),
                    g4: new isograss1(0, 0),
                    g5: new isograss2(0, 0)
                };
                tileCount = 5;
            } else if (texture === "sand") {
                g = {
                    g1: new BitmapData(200, 100, true, 0xFFCCBB99),
                    g2: new BitmapData(200, 100, true, 0xFFDDCC99),
                    g3: new BitmapData(200, 100, true, 0xFFEEDDAA),
                    g4: new BitmapData(200, 100, true, 0xFFFFEEBB)
                };
                tileCount = 4;
            } else if (texture === "grass") {
                // Try to use pre-loaded isograss images
                const preloaded = (typeof window !== 'undefined') ? (window as any).__grassImages : null;
                if (preloaded && preloaded.length >= 7) {
                    for (let idx = 0; idx < 7; idx++) {
                        const img: HTMLImageElement = preloaded[idx];
                        if (img && img.naturalWidth > 0) {
                            const bmd = new BitmapData(img.naturalWidth, img.naturalHeight, true, 0);
                            // Draw the HTML image onto the BitmapData canvas
                            const canvas = document.createElement('canvas');
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.drawImage(img, 0, 0);
                                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                // Copy pixel data into BitmapData
                                for (let y = 0; y < canvas.height; y++) {
                                    for (let x = 0; x < canvas.width; x++) {
                                        const i = (y * canvas.width + x) * 4;
                                        const a = imgData.data[i + 3];
                                        const r = imgData.data[i];
                                        const gv = imgData.data[i + 1];
                                        const b = imgData.data[i + 2];
                                        const color = (a << 24) | (r << 16) | (gv << 8) | b;
                                        bmd.setPixel32(x, y, color);
                                    }
                                }
                            }
                            g["g" + (idx + 1)] = bmd;
                        } else {
                            // Fallback: solid green with variation
                            const greenBase = 0xFF228822 + (idx * 0x00111100);
                            g["g" + (idx + 1)] = new BitmapData(200, 100, true, greenBase);
                        }
                    }
                } else {
                    g = {
                        g1: new BitmapData(200, 100, true, 0xFF228822),
                        g2: new BitmapData(200, 100, true, 0xFF339933),
                        g3: new BitmapData(200, 100, true, 0xFF44AA44),
                        g4: new BitmapData(200, 100, true, 0xFF55BB55),
                        g5: new BitmapData(200, 100, true, 0xFF66CC66),
                        g6: new BitmapData(200, 100, true, 0xFF77DD77),
                        g7: new BitmapData(200, 100, true, 0xFF88EE88)
                    };
                }
                tileCount = 7;
            } else if (texture === "crater") {
                g = { g1: new BitmapData(200, 100, true, 0xFF443322) };
                tileCount = 1;
            }

            // Create tiled textures
            for (let h = 0; h < 5; h++) {
                for (let v = 0; v < 5; v++) {
                    for (let i = 1; i <= tileCount; i++) {
                        t["t" + i].copyPixels(g["g" + i], new Rectangle(0, 0, 200, 100), new Point(h * 200, v * 100), null, null, true);
                    }
                }
            }

            // Composite tiles with perlin noise masks
            groundCompiled.draw(t.t1);
            for (let tile = 2; tile <= tileCount; tile++) {
                const groundMask: BitmapData = new BitmapData(1000, 500, true, 0);
                groundMask.perlinNoise(50 * tile, 25 * tile, 2, getBASE()._baseSeed + 1 + tile, true, false, BitmapDataChannel.ALPHA, true, null);
                groundCompiled.copyPixels(t["t" + tile], new Rectangle(0, 0, 1000, 500), new Point(0, 0), groundMask, null, true);
            }

            // Cleanup
            for (let i = 1; i < tileCount; i++) {
                g["g" + i]?.dispose();
                t["t" + i]?.dispose();
            }
        } catch (e: any) {
            getLOGGER().Log("err", "MAPBG.MakeTile: " + e.message + " | " + (e.stack || ""));
        }
        return groundCompiled;
    }
}
