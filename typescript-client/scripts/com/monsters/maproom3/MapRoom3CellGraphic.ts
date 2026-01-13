import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Graphics from "openfl/display/Graphics";
import Shape from "openfl/display/Shape";
import Sprite from "openfl/display/Sprite";
import BitmapFilterQuality from "openfl/filters/BitmapFilterQuality";
import GlowFilter from "openfl/filters/GlowFilter";
import Point from "openfl/geom/Point";
import TextField from "openfl/text/TextField";
import TextFormat from "openfl/text/TextFormat";
import TextFormatAlign from "openfl/text/TextFormatAlign";

import { SpriteData } from "../display/SpriteData";
import { SpriteSheetAnimation } from "../display/SpriteSheetAnimation";
import { EnumBaseRelationship } from "../../enums/EnumBaseRelationship";
import { EnumYardType } from "../../enums/EnumYardType";
import { MapRoom3TileSetManager } from "./tiles/MapRoom3TileSetManager";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { MapRoom3 } from "./MapRoom3";
import { MapRoom3AssetCache } from "./MapRoom3AssetCache";
import { MapRoom3Cell } from "./MapRoom3Cell";

/**
 * MapRoom3CellGraphic - Graphical representation of a map room 3 cell.
 */
export class MapRoom3CellGraphic extends Sprite {
    public static readonly HEX_WIDTH: number = 104;
    public static readonly HEX_HEIGHT: number = 68;
    public static readonly HEX_HEIGHT_OVERLAP: number = 50;
    public static readonly HEX_EDGE_LENGTH: number = 36;
    private static readonly CONNECTING_LINE_THICKNESS: number = 2.5;
    private static readonly CONNECTING_LINE_ALPHA: number = 0.5;
    private static readonly CONNECTING_LINE_BLUE: number = 0x00A5FF;
    private static readonly CONNECTING_LINE_RED: number = 0xFF0000;
    private static readonly CONNECTING_LINE_NEUTRAL: number = 0xFFFFFF;
    public static DEBUG_DISPLAY: boolean = false;
    public static DRAW_CONNECTING_LINES_ON_MOUSEOVER: boolean = false;

    private m_Cell: MapRoom3Cell | null = null;
    private m_TileBitmap: Bitmap | null = null;
    private m_BackgroundLayer: Sprite | null = null;
    private m_CellOverlayLayer: Sprite | null = null;
    private m_RangeLayer: Sprite | null = null;
    private m_RangeGlowLayer: Sprite | null = null;
    private m_HighlightLayer: Sprite | null = null;
    private m_IconLayer: Sprite | null = null;
    private m_LineLayer: Sprite | null = null;
    private m_InfoLayer: Sprite | null = null;
    private m_Hitbox: Sprite | null = null;
    private m_BuffEffect: SpriteSheetAnimation | null = null;
    private m_CellIndex: number = 0;
    private m_Selected: boolean = false;
    private m_Mousedover: boolean = false;

    constructor() {
        super();
        this.m_BackgroundLayer = new Sprite();
        this.m_BackgroundLayer.mouseEnabled = false;
        this.m_BackgroundLayer.mouseChildren = false;
        this.addChild(this.m_BackgroundLayer);
        this.m_CellOverlayLayer = new Sprite();
        this.m_RangeLayer = new Sprite();
        this.m_RangeLayer.mouseEnabled = false;
        this.m_RangeLayer.mouseChildren = false;
        this.m_RangeGlowLayer = new Sprite();
        this.m_RangeGlowLayer.mouseEnabled = false;
        this.m_RangeGlowLayer.mouseChildren = false;
        this.m_HighlightLayer = new Sprite();
        this.m_HighlightLayer.mouseEnabled = false;
        this.m_HighlightLayer.mouseChildren = false;
        this.addChild(this.m_HighlightLayer);
        this.m_IconLayer = new Sprite();
        this.m_IconLayer.mouseEnabled = false;
        this.m_IconLayer.mouseChildren = false;
        this.addChild(this.m_IconLayer);
        this.m_LineLayer = new Sprite();
        this.m_LineLayer.mouseEnabled = false;
        this.m_LineLayer.mouseChildren = false;
        this.m_Hitbox = new Sprite();
        MapRoom3CellGraphic.DrawProceduralHexagon(this.m_Hitbox.graphics, 0xFF0000, 0);
        this.hitArea = this.m_Hitbox;
        this.m_Hitbox.mouseEnabled = false;
        this.addChild(this.m_Hitbox);
        this.m_InfoLayer = new Sprite();
        this.m_InfoLayer.mouseEnabled = false;
        this.m_InfoLayer.mouseChildren = false;
    }

    private static DrawProceduralRangeHexagon(g: Graphics, color: number, alpha: number, halfWidth: number, halfHeight: number, cornerRadius: number): void {
        g.lineStyle(0, 0, 0);
        g.beginFill(color, alpha);
        g.moveTo(-(halfWidth * 2) + cornerRadius, -cornerRadius);
        g.lineTo(-halfWidth - cornerRadius, -halfHeight + cornerRadius);
        g.curveTo(-halfWidth, -halfHeight, -halfWidth + 2 * cornerRadius, -halfHeight);
        g.lineTo(halfWidth - 2 * cornerRadius, -halfHeight);
        g.curveTo(halfWidth, -halfHeight, halfWidth + cornerRadius, -halfHeight + cornerRadius);
        g.lineTo(halfWidth * 2 - cornerRadius, -cornerRadius);
        g.curveTo(halfWidth * 2, 0, halfWidth * 2 - cornerRadius, cornerRadius);
        g.lineTo(halfWidth + cornerRadius, halfHeight - cornerRadius);
        g.curveTo(halfWidth, halfHeight, halfWidth - 2 * cornerRadius, halfHeight);
        g.lineTo(-halfWidth + 2 * cornerRadius, halfHeight);
        g.curveTo(-halfWidth, halfHeight, -halfWidth - cornerRadius, halfHeight - cornerRadius);
        g.lineTo(-(halfWidth * 2) + cornerRadius, cornerRadius);
        g.curveTo(-(halfWidth * 2), 0, -(halfWidth * 2) + cornerRadius, -cornerRadius);
        g.endFill();
    }

    private static DrawProceduralHexagon(g: Graphics, color: number, alpha: number = 0.5, offset: Point | null = null): void {
        const xOff = offset ? Math.floor(offset.x) : 0;
        const yOff = offset ? Math.floor(offset.y) : 0;
        g.lineStyle(0, 0, 0);
        g.beginFill(color, alpha);
        g.moveTo(xOff + 52, yOff + 0);
        g.lineTo(xOff + 104, yOff + 17);
        g.lineTo(xOff + 104, yOff + 50);
        g.lineTo(xOff + 52, yOff + 68);
        g.lineTo(xOff + 0, yOff + 50);
        g.lineTo(xOff + 0, yOff + 17);
        g.lineTo(xOff + 52, yOff + 0);
        g.endFill();
    }

    private static DrawProceduralEllipse(g: Graphics, color: number, alpha: number = 0.5, size: Point | null = null): void {
        const w = size ? Math.floor(size.x) : Math.floor(MapRoom3CellGraphic.HEX_WIDTH);
        const h = size ? Math.floor(size.y) : Math.floor(MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP);
        g.lineStyle(0, 0, 0);
        g.beginFill(color, alpha);
        g.drawEllipse(0, 0, w, h);
        g.endFill();
    }

    public get cell(): MapRoom3Cell | null {
        return this.m_Cell;
    }

    public get cellIndex(): number {
        return this.m_CellIndex;
    }

    public set cellIndex(value: number) {
        this.m_CellIndex = value;
    }

    public Clear(): void {
        this.setMapCell(null);
        this.ResetChildren();
        if (this.m_BackgroundLayer) {
            this.removeChild(this.m_BackgroundLayer);
            this.m_BackgroundLayer = null;
        }
        if (this.m_HighlightLayer) {
            this.removeChild(this.m_HighlightLayer);
            this.m_HighlightLayer = null;
        }
        if (this.m_IconLayer) {
            this.removeChild(this.m_IconLayer);
            this.m_IconLayer = null;
        }
        if (this.m_Hitbox) {
            this.removeChild(this.m_Hitbox);
            this.m_Hitbox = null;
        }
    }

    public redrawTile(): void {
        this.DrawTile();
    }

    private ResetChildren(): void {
        if (this.m_TileBitmap) {
            this.m_TileBitmap.parent.removeChild(this.m_TileBitmap);
            this.m_TileBitmap = null;
        }
        if (this.m_BackgroundLayer) {
            while (this.m_BackgroundLayer.numChildren > 0) {
                this.m_BackgroundLayer.removeChildAt(0);
            }
        }
        if (this.m_CellOverlayLayer) {
            while (this.m_CellOverlayLayer.numChildren > 0) {
                const bmp = this.m_CellOverlayLayer.removeChildAt(0) as Bitmap;
                if (bmp !== null) {
                    bmp.bitmapData = null!;
                }
            }
            if (this.m_CellOverlayLayer.parent) {
                this.m_CellOverlayLayer.parent.removeChild(this.m_CellOverlayLayer);
            }
        }
        this.ClearRangeLayer();
        this.ClearLineLayer();
        if (this.m_IconLayer) {
            while (this.m_IconLayer.numChildren > 0) {
                const bmp = this.m_IconLayer.removeChildAt(0) as Bitmap;
                if (bmp !== null) {
                    bmp.bitmapData = null!;
                }
            }
        }
        if (this.m_InfoLayer) {
            while (this.m_InfoLayer.numChildren > 0) {
                this.m_InfoLayer.removeChildAt(0);
            }
            if (this.m_InfoLayer.parent) {
                this.m_InfoLayer.parent.removeChild(this.m_InfoLayer);
            }
        }
        if (this.m_BuffEffect) {
            this.m_BuffEffect.spriteData = null;
            this.m_BuffEffect = null;
        }
    }

    private ClearRangeLayer(): void {
        if (this.m_RangeLayer) {
            this.m_RangeLayer.graphics.clear();
            if (this.m_RangeLayer.parent) {
                this.m_RangeLayer.parent.removeChild(this.m_RangeLayer);
            }
        }
        if (this.m_RangeGlowLayer) {
            this.m_RangeGlowLayer.graphics.clear();
            if (this.m_RangeGlowLayer.parent) {
                this.m_RangeGlowLayer.parent.removeChild(this.m_RangeGlowLayer);
            }
        }
    }

    private ClearLineLayer(): void {
        if (this.m_LineLayer) {
            while (this.m_LineLayer.numChildren > 0) {
                this.m_LineLayer.removeChildAt(0);
            }
            if (this.m_LineLayer.parent) {
                this.m_LineLayer.parent.removeChild(this.m_LineLayer);
            }
        }
    }

    TickFast(): void {
        if (this.m_BuffEffect !== null) {
            this.m_BuffEffect.update();
            if (this.m_Cell !== null) {
                this.m_Cell.currentBuffEffectFrame = this.m_BuffEffect.currentFrame;
            }
        }
    }

    private DrawTile(): void {
        this.ResetChildren();
        if (this.m_Cell === null) {
            return;
        }
        this.DrawBackgroundLayer();
        this.DrawHighlightLayer();
        this.DrawRangeLayer();
        this.DrawConnectingLines();
        if (this.m_Cell.DoesContainDisplayableBase() === false) {
            return;
        }
        this.DrawCellOverlayLayer();
        this.DrawIconLayer();
        this.DrawInfoLayer();
        this.DrawDamageBarLayer();
    }

    private DrawBackgroundLayer(): void {
        const tile = MapRoom3TileSetManager.instance.GetTileToDrawForCell(this.m_Cell!, this.m_CellIndex);
        if (Boolean(tile) && Boolean(tile.bmd)) {
            this.m_TileBitmap = new Bitmap(tile.bmd);
            this.m_TileBitmap.x = (MapRoom3CellGraphic.HEX_WIDTH - this.m_TileBitmap.width) * 0.5;
            this.m_TileBitmap.y = this.m_TileBitmap.height > MapRoom3CellGraphic.HEX_HEIGHT ? MapRoom3CellGraphic.HEX_HEIGHT - this.m_TileBitmap.height : (MapRoom3CellGraphic.HEX_HEIGHT - this.m_TileBitmap.height) * 0.5;
            if (this.m_Cell!.isBlocked === false) {
                this.m_TileBitmap.x += this.x;
                this.m_TileBitmap.y += this.y;
                MapRoom3.mapRoom3Window.baseLayer.addChild(this.m_TileBitmap);
            } else {
                this.m_BackgroundLayer!.addChild(this.m_TileBitmap);
            }
        }
    }

    private DrawCellOverlayLayer(): void {
        if (this.m_Cell!.cellType === EnumYardType.FORTIFICATION) {
            return;
        }
        switch (this.m_Cell!.relationship) {
            case EnumBaseRelationship.k_RELATIONSHIP_SELF:
                this.m_CellOverlayLayer!.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_OVERLAY_GLOW_BLUE)));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_ALLY:
                this.m_CellOverlayLayer!.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_OVERLAY_GLOW_GREEN)));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_NEUTRAL:
                this.m_CellOverlayLayer!.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_OVERLAY_GLOW_YELLOW)));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_ENEMY:
                this.m_CellOverlayLayer!.addChild(new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_OVERLAY_GLOW_RED)));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_NONE:
            default:
                return;
        }
        MapRoom3.mapRoom3Window.cellOverlayLayer.addChild(this.m_CellOverlayLayer!);
        this.m_CellOverlayLayer!.x = this.x;
        this.m_CellOverlayLayer!.y = this.y;
    }

    private DrawRangeLayer(): void {
        this.DrawRoundedHexagonalRange();
    }

    private DrawTiledOvalsRange(): void {
        if (this.m_Cell!.isInAttackRange === false) {
            return;
        }
        const size = new Point(MapRoom3CellGraphic.HEX_WIDTH * 1.25, MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * 1.25);
        const posX = this.x + MapRoom3CellGraphic.HEX_WIDTH * 0.5 - size.x * 0.5;
        const posY = this.y + MapRoom3CellGraphic.HEX_HEIGHT * 0.5 - size.y * 0.5;
        this.m_RangeLayer!.x = posX;
        this.m_RangeLayer!.y = posY;
        this.m_RangeGlowLayer!.x = posX;
        this.m_RangeGlowLayer!.y = posY;
        MapRoom3CellGraphic.DrawProceduralEllipse(this.m_RangeLayer!.graphics, 0xFFFFFF, 1, size);
        MapRoom3CellGraphic.DrawProceduralEllipse(this.m_RangeGlowLayer!.graphics, 0xFFFFFF, 1, size);
        MapRoom3.mapRoom3Window.rangeLayer.addChild(this.m_RangeLayer!);
        MapRoom3.mapRoom3Window.rangeGlowLayer.addChild(this.m_RangeGlowLayer!);
    }

    private DrawTiledHexagonsRange(): void {
        if (this.m_Cell!.isInAttackRange === false) {
            return;
        }
        this.m_RangeLayer!.x = this.x;
        this.m_RangeLayer!.y = this.y;
        this.m_RangeGlowLayer!.x = this.x;
        this.m_RangeGlowLayer!.y = this.y;
        MapRoom3CellGraphic.DrawProceduralHexagon(this.m_RangeLayer!.graphics, 0xFFFFFF, 1);
        MapRoom3CellGraphic.DrawProceduralHexagon(this.m_RangeGlowLayer!.graphics, 0xFFFFFF, 1);
        MapRoom3.mapRoom3Window.rangeLayer.addChild(this.m_RangeLayer!);
        MapRoom3.mapRoom3Window.rangeGlowLayer.addChild(this.m_RangeGlowLayer!);
    }

    private DrawCircularRange(): void {
        if (this.m_Cell!.hasCellsInAttackRange === false && (this.m_Mousedover === false || this.m_Cell!.attackRange < 2)) {
            return;
        }
        const range = this.m_Cell!.attackRange;
        const size = new Point(MapRoom3CellGraphic.HEX_WIDTH + range * MapRoom3CellGraphic.HEX_WIDTH * 2, MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP + range * MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * 2);
        const posX = this.x + MapRoom3CellGraphic.HEX_WIDTH * 0.5 - size.x * 0.5;
        const posY = this.y + MapRoom3CellGraphic.HEX_HEIGHT * 0.5 - size.y * 0.5;
        this.m_RangeLayer!.x = posX;
        this.m_RangeLayer!.y = posY;
        this.m_RangeGlowLayer!.x = posX;
        this.m_RangeGlowLayer!.y = posY;
        MapRoom3CellGraphic.DrawProceduralEllipse(this.m_RangeLayer!.graphics, 0xFFFFFF, 1, size);
        MapRoom3CellGraphic.DrawProceduralEllipse(this.m_RangeGlowLayer!.graphics, 0xFFFFFF, 1, size);
        if (this.m_Cell!.hasCellsInAttackRange === true) {
            MapRoom3.mapRoom3Window.rangeLayer.addChild(this.m_RangeLayer!);
            MapRoom3.mapRoom3Window.rangeGlowLayer.addChild(this.m_RangeGlowLayer!);
        } else {
            MapRoom3.mapRoom3Window.mouseoverRangeLayer.addChild(this.m_RangeLayer!);
            MapRoom3.mapRoom3Window.mouseoverRangeGlowLayer.addChild(this.m_RangeGlowLayer!);
        }
    }

    private DrawRoundedHexagonalRange(): void {
        if (this.m_Cell!.hasCellsInAttackRange === false && (this.m_Mousedover === false || this.m_Cell!.attackRange < 2)) {
            return;
        }
        const range = this.m_Cell!.attackRange;
        if (range < 2) {
            this.DrawCircularRange();
            return;
        }
        const cornerRadius = range === 2 ? MapRoom3CellGraphic.HEX_WIDTH * 0.25 : MapRoom3CellGraphic.HEX_WIDTH * 0.5;
        const halfWidth = range * MapRoom3CellGraphic.HEX_WIDTH * 0.5 + MapRoom3CellGraphic.HEX_WIDTH * 0.25;
        const halfHeight = range * MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP + MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * 0.5;
        const posX = this.x + MapRoom3CellGraphic.HEX_WIDTH * 0.5;
        const posY = this.y + MapRoom3CellGraphic.HEX_HEIGHT * 0.5;
        this.m_RangeLayer!.x = posX;
        this.m_RangeLayer!.y = posY;
        this.m_RangeGlowLayer!.x = posX;
        this.m_RangeGlowLayer!.y = posY;
        MapRoom3CellGraphic.DrawProceduralRangeHexagon(this.m_RangeLayer!.graphics, 0xFFFFFF, 1, halfWidth, halfHeight, cornerRadius);
        MapRoom3CellGraphic.DrawProceduralRangeHexagon(this.m_RangeGlowLayer!.graphics, 0xFFFFFF, 1, halfWidth, halfHeight, cornerRadius);
        if (this.m_Cell!.hasCellsInAttackRange === true) {
            MapRoom3.mapRoom3Window.rangeLayer.addChild(this.m_RangeLayer!);
            MapRoom3.mapRoom3Window.rangeGlowLayer.addChild(this.m_RangeGlowLayer!);
        } else {
            MapRoom3.mapRoom3Window.mouseoverRangeLayer.addChild(this.m_RangeLayer!);
            MapRoom3.mapRoom3Window.mouseoverRangeGlowLayer.addChild(this.m_RangeGlowLayer!);
        }
    }

    private DrawIconLayer(): void {
        let mainIcon: Bitmap | null = null;
        let isFullyFortified = false;
        switch (this.m_Cell!.cellType) {
            case EnumYardType.PLAYER:
                mainIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(this.m_Cell!.isDestroyed ? MapRoom3AssetCache.CELL_ICON_PLAYER_BASE : MapRoom3AssetCache.CELL_ICON_PLAYER_BASE));
                isFullyFortified = this.IsFullyFortified();
                if (this.m_Cell!.hasDamageProtection) {
                    this.DrawDamageProtectionIcon();
                }
                break;
            case EnumYardType.RESOURCE:
                mainIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(this.m_Cell!.isDestroyed ? MapRoom3AssetCache.CELL_ICON_RESOURCE_CELL : MapRoom3AssetCache.CELL_ICON_RESOURCE_CELL));
                isFullyFortified = this.IsFullyFortified();
                break;
            case EnumYardType.STRONGHOLD:
                mainIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(this.m_Cell!.isDestroyed ? MapRoom3AssetCache.CELL_ICON_STRONGHOLD : MapRoom3AssetCache.CELL_ICON_STRONGHOLD));
                isFullyFortified = this.IsFullyFortified();
                break;
            case EnumYardType.FORTIFICATION:
                if (this.m_Cell!.isDestroyed) {
                    mainIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION));
                } else {
                    mainIcon = this.GetFortificationIconToDisplay();
                    this.DrawFortificationLightIcon();
                }
                break;
            case EnumYardType.EMPTY:
                if (this.m_Cell!.isOwnedByWildMonster) {
                    mainIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(this.m_Cell!.isDestroyed ? MapRoom3AssetCache.CELL_ICON_WILD_MONSTER_BASE : MapRoom3AssetCache.CELL_ICON_WILD_MONSTER_BASE));
                }
        }
        if (isFullyFortified) {
            const frontIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FULLY_FORTIFIED_FRONT));
            frontIcon.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - frontIcon.width) * 0.5);
            frontIcon.y = Math.round((MapRoom3CellGraphic.HEX_HEIGHT - frontIcon.height) * 0.5);
            this.m_IconLayer!.addChildAt(frontIcon, 0);
        }
        if (mainIcon !== null) {
            mainIcon.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - mainIcon.width) * 0.5);
            mainIcon.y = Math.round((MapRoom3CellGraphic.HEX_HEIGHT - mainIcon.height) * 0.5);
            this.m_IconLayer!.addChildAt(mainIcon, 0);
        }
        if (isFullyFortified) {
            const backIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FULLY_FORTIFIED_BACK));
            backIcon.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - backIcon.width) * 0.5);
            backIcon.y = Math.round((MapRoom3CellGraphic.HEX_HEIGHT - backIcon.height) * 0.5);
            this.m_IconLayer!.addChildAt(backIcon, 0);
        }
        if (this.m_Cell!.isInRangeOfStronghold && !MapRoom3.mapRoom3Window.IsZoomedOut()) {
            this.DrawBuffedEffect();
        }
    }

    private GetFortificationIconToDisplay(): Bitmap {
        const cellX = this.m_Cell!.cellX;
        const cellY = this.m_Cell!.cellY;
        let checkX = cellX + 1;
        let checkY = cellY;
        let checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (this.m_Cell!.DoesFortify(checkCell)) {
            return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_EAST));
        }
        checkX = cellX - 1;
        checkY = cellY;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (this.m_Cell!.DoesFortify(checkCell)) {
            return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_WEST));
        }
        checkX = cellY % 2 ? cellX + 1 : cellX;
        checkY = cellY - 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (this.m_Cell!.DoesFortify(checkCell)) {
            return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_NORTH_EAST));
        }
        checkX = cellY % 2 ? cellX : cellX - 1;
        checkY = cellY - 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (this.m_Cell!.DoesFortify(checkCell)) {
            return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_NORTH_WEST));
        }
        checkX = cellY % 2 ? cellX + 1 : cellX;
        checkY = cellY + 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (this.m_Cell!.DoesFortify(checkCell)) {
            return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_SOUTH_EAST));
        }
        checkX = cellY % 2 ? cellX : cellX - 1;
        checkY = cellY + 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (this.m_Cell!.DoesFortify(checkCell)) {
            return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_SOUTH_WEST));
        }
        return new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION));
    }

    private IsFullyFortified(): boolean {
        const cellX = this.m_Cell!.cellX;
        const cellY = this.m_Cell!.cellY;
        let checkX = cellX + 1;
        let checkY = cellY;
        let checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (checkCell !== null && checkCell.DoesFortify(this.m_Cell!) === false) {
            return false;
        }
        checkX = cellX - 1;
        checkY = cellY;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (checkCell !== null && checkCell.DoesFortify(this.m_Cell!) === false) {
            return false;
        }
        checkX = cellY % 2 ? cellX + 1 : cellX;
        checkY = cellY - 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (checkCell !== null && checkCell.DoesFortify(this.m_Cell!) === false) {
            return false;
        }
        checkX = cellY % 2 ? cellX : cellX - 1;
        checkY = cellY - 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (checkCell !== null && checkCell.DoesFortify(this.m_Cell!) === false) {
            return false;
        }
        checkX = cellY % 2 ? cellX + 1 : cellX;
        checkY = cellY + 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (checkCell !== null && checkCell.DoesFortify(this.m_Cell!) === false) {
            return false;
        }
        checkX = cellY % 2 ? cellX : cellX - 1;
        checkY = cellY + 1;
        checkCell = MapRoomManager.instance.FindCell(checkX, checkY) as MapRoom3Cell;
        if (checkCell !== null && checkCell.DoesFortify(this.m_Cell!) === false) {
            return false;
        }
        return true;
    }

    private DrawFortificationLightIcon(): void {
        let lightIcon: Bitmap | null = null;
        switch (this.m_Cell!.relationship) {
            case EnumBaseRelationship.k_RELATIONSHIP_SELF:
                lightIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_BLUE));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_ALLY:
                lightIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_GREEN));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_NEUTRAL:
                lightIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_YELLOW));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_ENEMY:
                lightIcon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_FORTIFICATION_LIGHT_RED));
                break;
            case EnumBaseRelationship.k_RELATIONSHIP_NONE:
            default:
                return;
        }
        if (lightIcon !== null) {
            lightIcon.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - lightIcon.width) * 0.5);
            lightIcon.y = Math.round((MapRoom3CellGraphic.HEX_HEIGHT - lightIcon.height) * 0.5);
            this.m_IconLayer!.addChild(lightIcon);
        }
    }

    private DrawDamageProtectionIcon(): void {
        const icon = new Bitmap(MapRoom3AssetCache.instance.GetAsset(MapRoom3AssetCache.CELL_ICON_DAMAGE_PROTECTION));
        icon.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - icon.width) * 0.5);
        icon.y = Math.round((MapRoom3CellGraphic.HEX_HEIGHT - icon.height) * 0.5);
        this.m_IconLayer!.addChild(icon);
    }

    private DrawBuffedEffect(): void {
        let isPlayerBuff = false;
        let isEnemyBuff = false;
        const len = this.m_Cell!.inRangeOfStrongholds.length;
        for (let i = 0; i < len; i++) {
            const stronghold = this.m_Cell!.inRangeOfStrongholds[i];
            if (stronghold.isOwnedByPlayer) {
                isPlayerBuff = true;
            } else if (stronghold.userID === this.m_Cell!.userID && stronghold.wildMonsterTribeId === this.m_Cell!.wildMonsterTribeId) {
                isEnemyBuff = true;
            }
        }
        let spriteData: SpriteData | null = null;
        if (isPlayerBuff && isEnemyBuff) {
            spriteData = MapRoom3AssetCache.instance.GetStrongholdBuffEffectMixed();
        } else if (isPlayerBuff) {
            spriteData = MapRoom3AssetCache.instance.GetStrongholdBuffEffectPlayer();
        } else if (isEnemyBuff) {
            spriteData = MapRoom3AssetCache.instance.GetStrongholdBuffEffectEnemy();
        }
        if (spriteData === null) {
            return;
        }
        this.m_BuffEffect = new SpriteSheetAnimation(spriteData, MapRoom3AssetCache.STRONGHOLD_BUFF_EFFECT_TOTAL_FRAMES);
        this.m_BuffEffect.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - spriteData.width) * 0.5);
        this.m_BuffEffect.y = Math.round((MapRoom3CellGraphic.HEX_HEIGHT - spriteData.height) * 0.5) + MapRoom3AssetCache.STRONGHOLD_BUFF_EFFECT_OFFSET_Y;
        this.m_BuffEffect.gotoAndPlay(this.m_Cell!.currentBuffEffectFrame);
        this.m_IconLayer!.addChildAt(this.m_BuffEffect, 0);
    }

    private DrawConnectingLines(): void {
        if (MapRoom3CellGraphic.DRAW_CONNECTING_LINES_ON_MOUSEOVER === false) {
            return;
        }
        if (this.m_Mousedover === false) {
            return;
        }
        if (this.m_Cell!.isInRangeOfStronghold === false) {
            return;
        }
        const len = this.m_Cell!.inRangeOfStrongholds.length;
        for (let i = 0; i < len; i++) {
            const stronghold = this.m_Cell!.inRangeOfStrongholds[i];
            if (stronghold.isOwnedByPlayer) {
                this.DrawConnectingLineTo(stronghold, MapRoom3CellGraphic.CONNECTING_LINE_BLUE);
            } else if (stronghold.userID === this.m_Cell!.userID && stronghold.wildMonsterTribeId === this.m_Cell!.wildMonsterTribeId) {
                this.DrawConnectingLineTo(stronghold, MapRoom3CellGraphic.CONNECTING_LINE_RED);
            } else {
                this.DrawConnectingLineTo(stronghold, MapRoom3CellGraphic.CONNECTING_LINE_NEUTRAL);
            }
        }
        MapRoom3.mapRoom3Window.cellOverlayLayer.addChild(this.m_LineLayer!);
        this.m_LineLayer!.x = this.x;
        this.m_LineLayer!.y = this.y;
    }

    private DrawConnectingLineTo(cell: MapRoom3Cell, color: number): void {
        const targetX = cell.cellX * MapRoom3CellGraphic.HEX_WIDTH + (cell.cellY % 2 ? MapRoom3CellGraphic.HEX_WIDTH * 0.5 : 0);
        const targetY = cell.cellY * MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP;
        const line = new Shape();
        line.graphics.lineStyle(MapRoom3CellGraphic.CONNECTING_LINE_THICKNESS, color, MapRoom3CellGraphic.CONNECTING_LINE_ALPHA);
        line.graphics.lineTo(targetX - this.x, targetY - this.y);
        line.x = line.x + MapRoom3CellGraphic.HEX_WIDTH * 0.5;
        line.y = line.y + MapRoom3CellGraphic.HEX_HEIGHT * 0.5;
        this.m_LineLayer!.addChild(line);
    }

    private DrawInfoLayer(): void {
        if (MapRoom3.mapRoom3Window.IsZoomedOut()) {
            return;
        }
        if (this.m_Cell!.cellType === EnumYardType.FORTIFICATION && MapRoom3CellGraphic.DEBUG_DISPLAY === false) {
            return;
        }
        const textField = new TextField();
        textField.defaultTextFormat = new TextFormat("Verdana", 10, 0xFFFFFF, true, null, null, null, null, TextFormatAlign.CENTER);
        textField.width = Math.floor(MapRoom3CellGraphic.HEX_WIDTH * 1.5);
        textField.height = 20;
        textField.x = Math.floor(-MapRoom3CellGraphic.HEX_WIDTH * 0.25);
        textField.y = MapRoom3CellGraphic.HEX_HEIGHT - textField.height;
        if (MapRoom3CellGraphic.DEBUG_DISPLAY) {
            textField.x = 0;
            textField.y = 0;
            textField.width = MapRoom3CellGraphic.HEX_WIDTH;
            textField.height = MapRoom3CellGraphic.HEX_HEIGHT;
            textField.multiline = true;
            textField.wordWrap = true;
            textField.htmlText = "x: " + this.m_Cell!.cellX.toString() + " y: " + this.m_Cell!.cellY.toString() + " h: " + this.m_Cell!.cellHeight.toString() + " t: " + this.m_Cell!.cellType.toString() + " rel: " + this.m_Cell!.relationship.toString() + " r: " + this.m_Cell!.attackRange.toString() + " in_r: " + this.m_Cell!.isInAttackRange.toString();
        } else {
            textField.htmlText = this.m_Cell!.name + " (" + this.m_Cell!.baseLevel.toString() + ")";
        }
        textField.filters = [new GlowFilter(0, 1, 2, 2, 4, BitmapFilterQuality.HIGH)];
        textField.x = textField.x + this.x;
        textField.y = textField.y + this.y;
        this.m_InfoLayer!.addChild(textField);
        MapRoom3.mapRoom3Window.infoLayer.addChild(this.m_InfoLayer!);
    }

    private DrawDamageBarLayer(): void {
        if (this.m_Cell!.damage <= 0) {
            return;
        }
        const bmd = MapRoom3AssetCache.instance.GetDamageBarSegmentAsset(this.m_Cell!.damagePercentage);
        if (bmd === null) {
            return;
        }
        const bar = new Bitmap(bmd);
        bar.x = Math.round((MapRoom3CellGraphic.HEX_WIDTH - bar.width) * 0.5);
        this.m_IconLayer!.addChild(bar);
    }

    private DrawHighlightLayer(): void {
        if (this.m_HighlightLayer === null) {
            return;
        }
        this.m_HighlightLayer.graphics.clear();
        this.m_HighlightLayer.x = 0;
        this.m_HighlightLayer.y = MapRoom3CellGraphic.HEX_HEIGHT * 0.5 - MapRoom3CellGraphic.HEX_HEIGHT_OVERLAP * 0.5;
        if (this.m_Selected) {
            MapRoom3CellGraphic.DrawProceduralEllipse(this.m_HighlightLayer.graphics, 0xFFFFFF, 0.5);
        } else if (this.m_Mousedover) {
            MapRoom3CellGraphic.DrawProceduralEllipse(this.m_HighlightLayer.graphics, 0xFFFFFF, 0.3);
        }
    }

    public setMapCell(cell: MapRoom3Cell | null): void {
        if (this.m_Cell !== null && this.m_Cell.cellGraphic === this) {
            this.m_Cell.cellGraphic = null;
        }
        this.m_Cell = cell;
        if (this.m_Cell !== null) {
            this.m_Cell.cellGraphic = this;
        }
        this.DrawTile();
    }

    public set mousedover(value: boolean) {
        if (this.m_Mousedover !== value) {
            this.m_Mousedover = value;
            this.DrawHighlightLayer();
            this.ClearRangeLayer();
            this.DrawRangeLayer();
            this.ClearLineLayer();
            this.DrawConnectingLines();
            this.m_InfoLayer!.visible = !this.m_Mousedover;
        }
    }

    public set selected(value: boolean) {
        if (this.m_Selected !== value) {
            this.m_Selected = value;
            this.DrawHighlightLayer();
        }
    }
}
