import { BitmapData } from "openfl/display/BitmapData";

import { ImageCache } from "../../display/ImageCache";
import { MapRoom3Cell } from "../MapRoom3Cell";
import { MapRoom3TileSet } from "./MapRoom3TileSet";

/**
 * Map room 3 tile set manager - manages tile sets for the world map.
 */
export class MapRoom3TileSetManager {
    private static s_Instance: MapRoom3TileSetManager | null = null;
    
    public static readonly BLOCKED_CELL_STARTING_HEIGHT: number = 51;
    public static readonly BORDER_CELL_HEIGHT: number = 100;
    public static readonly DEFAULT_BACKGROUND: string = "worldmap/background.jpg";
    
    public static DEFAULT_TILE_SET: Array<Record<string, any>> = [
        { "src": "worldmap/tiles/clover01.png", "x": 0, "y": 0, "min_alt": 32, "max_alt": 35 },
        { "src": "worldmap/tiles/clover02.png", "x": 0, "y": 0, "min_alt": 35, "max_alt": 38 },
        { "src": "worldmap/tiles/clover03.png", "x": 0, "y": 0, "min_alt": 38, "max_alt": 41 },
        { "src": "worldmap/tiles/clover04.png", "x": 0, "y": 0, "min_alt": 41, "max_alt": 44 },
        { "src": "worldmap/tiles/clover05.png", "x": 0, "y": 0, "min_alt": 44, "max_alt": 47 },
        { "src": "worldmap/tiles/clover06.png", "x": 0, "y": 0, "min_alt": 47, "max_alt": 50 },
        { "src": "worldmap/tiles/brownplant01.png", "x": 0, "y": 0, "min_alt": 50, "max_alt": 52 },
        { "src": "worldmap/tiles/brownplant02.png", "x": 0, "y": 0, "min_alt": 52, "max_alt": 54 },
        { "src": "worldmap/tiles/brownplant03.png", "x": 0, "y": 0, "min_alt": 54, "max_alt": 56 },
        { "src": "worldmap/tiles/brownplant04.png", "x": 0, "y": 0, "min_alt": 56, "max_alt": 58 },
        { "src": "worldmap/tiles/brownplant05.png", "x": 0, "y": 0, "min_alt": 58, "max_alt": 60 },
        { "src": "worldmap/tiles/greenplant01.png", "x": 0, "y": 0, "min_alt": 60, "max_alt": 62 },
        { "src": "worldmap/tiles/greenplant02.png", "x": 0, "y": 0, "min_alt": 62, "max_alt": 64 },
        { "src": "worldmap/tiles/greenplant03.png", "x": 0, "y": 0, "min_alt": 64, "max_alt": 66 },
        { "src": "worldmap/tiles/greenplant04.png", "x": 0, "y": 0, "min_alt": 66, "max_alt": 68 },
        { "src": "worldmap/tiles/greenplant05.png", "x": 0, "y": 0, "min_alt": 68, "max_alt": 70 },
        { "src": "worldmap/tiles/spiky01.png", "x": 0, "y": 0, "min_alt": 70, "max_alt": 71 },
        { "src": "worldmap/tiles/spiky02.png", "x": 0, "y": 0, "min_alt": 71, "max_alt": 72 },
        { "src": "worldmap/tiles/spiky03.png", "x": 0, "y": 0, "min_alt": 72, "max_alt": 73 },
        { "src": "worldmap/tiles/spiky04.png", "x": 0, "y": 0, "min_alt": 73, "max_alt": 75 },
        { "src": "worldmap/tiles/spiky05.png", "x": 0, "y": 0, "min_alt": 75, "max_alt": 77 },
        { "src": "worldmap/tiles/spiky06.png", "x": 0, "y": 0, "min_alt": 77, "max_alt": 79 },
        { "src": "worldmap/tiles/spiky07.png", "x": 0, "y": 0, "min_alt": 78, "max_alt": 80 },
        { "src": "worldmap/tiles/borderplant01.png", "x": 0, "y": 0, "min_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT - 1, "max_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT },
        { "src": "worldmap/tiles/borderplant02.png", "x": 0, "y": 0, "min_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT - 1, "max_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT },
        { "src": "worldmap/tiles/borderplant03.png", "x": 0, "y": 0, "min_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT - 1, "max_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT },
        { "src": "worldmap/tiles/borderplant04.png", "x": 0, "y": 0, "min_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT - 1, "max_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT },
        { "src": "worldmap/tiles/borderplant05.png", "x": 0, "y": 0, "min_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT - 1, "max_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT }
    ];

    public static INFERNO_TILE_SET: Array<Record<string, any>> = [
        { "src": "worldmap/tiles/tests/lava.png", "x": 0, "y": 0, "min_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT - 1, "max_alt": MapRoom3TileSetManager.BORDER_CELL_HEIGHT }
    ];

    private m_TileSetsInUse: Map<Array<Record<string, any>>, MapRoom3TileSet> = new Map();
    private m_CurrentTileSet: MapRoom3TileSet | null = null;
    private m_CurrentBackground: BitmapData | null = null;

    constructor() {
    }

    public static get instance(): MapRoom3TileSetManager {
        return MapRoom3TileSetManager.s_Instance = MapRoom3TileSetManager.s_Instance || new MapRoom3TileSetManager();
    }

    public get currentBackground(): BitmapData | null {
        return this.m_CurrentBackground;
    }

    public get isCurrentTileSetAndBackgroundLoaded(): boolean {
        return Boolean(this.m_CurrentTileSet) && Boolean(this.m_CurrentBackground);
    }

    public SetCurrentTileSet(tileSet: Array<Record<string, any>>, background: string = "worldmap/background.jpg"): void {
        if (tileSet !== MapRoom3TileSetManager.DEFAULT_TILE_SET && tileSet !== MapRoom3TileSetManager.INFERNO_TILE_SET) {
            return;
        }
        if (!this.m_TileSetsInUse.has(tileSet)) {
            this.m_CurrentTileSet = new MapRoom3TileSet(tileSet);
            this.m_TileSetsInUse.set(tileSet, this.m_CurrentTileSet);
        } else {
            this.m_CurrentTileSet = this.m_TileSetsInUse.get(tileSet)!;
        }
        ImageCache.GetImageWithCallBack(background, this.OnBackgroundImageLoaded.bind(this), true, 1);
    }

    private OnBackgroundImageLoaded(key: string, bmd: BitmapData): void {
        this.m_CurrentBackground = bmd;
    }

    public GetTileToDrawForCell(cell: MapRoom3Cell, height: number): Record<string, any> | null {
        return this.m_CurrentTileSet ? this.m_CurrentTileSet.GetTileToDrawForCell(cell, height) : null;
    }
}
