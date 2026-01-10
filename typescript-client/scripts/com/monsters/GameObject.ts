import DisplayObject from "openfl/display/DisplayObject";
import IBitmapDrawable from "openfl/display/IBitmapDrawable";
import Sprite from "openfl/display/Sprite";
import EventDispatcher from "openfl/events/EventDispatcher";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { SecNum } from "../cc/utils/SecNum";
import { BYMConfig } from "./configs/BYMConfig";
import { SpriteSheetAnimation } from "./display/SpriteSheetAnimation";
import { IAttackable } from "./interfaces/IAttackable";
import { ITargetable } from "./interfaces/ITargetable";
import { CModifiableProperty } from "./monsters/components/CModifiableProperty";
import { MaxHealthProperty } from "./monsters/components/MaxHealthProperty";
import { RasterData } from "./rendering/RasterData";

import { MAP } from "../../MAP";

/**
 * Container for RasterData with source display object tracking.
 */
class RasterDataContainer {
    public m_source: DisplayObject | null;
    public m_rasterData: RasterData | null;
    public m_rasterPt: Point | null;
    public m_depth: number;

    constructor(source: DisplayObject, rasterData: RasterData, rasterPt: Point, depth: number) {
        this.m_source = source;
        this.m_rasterData = rasterData;
        this.m_rasterPt = rasterPt;
        this.m_depth = depth;
    }

    public clear(): void {
        if (this.m_rasterData) {
            this.m_rasterData.clear();
        }
        this.m_source = null;
        this.m_rasterData = null;
        this.m_rasterPt = null;
    }
}

/**
 * Base class for all game objects with health, armor, movement, and rendering.
 */
export class GameObject extends EventDispatcher implements IAttackable {
    protected static readonly k_DOES_PRINT_DETAILED_LOGGING: boolean = true;

    public _middle: number = 0;
    private _health: SecNum;
    public _size: number = 0;
    public _mc: Sprite;
    public targetableStatus: number = 0;
    public maxHealthProperty: MaxHealthProperty;
    public moveSpeedProperty: CModifiableProperty;
    public armorProperty: CModifiableProperty;

    protected m_children: RasterDataContainer[] = [];
    protected m_baseDepth: number = 0;
    protected m_isCleared: boolean = false;
    private m_attackFlags: number = 0;
    private m_defenseFlags: number = 0;
    protected m_attackPriorityFlags: number[] = [];

    constructor() {
        super();
        this._mc = new Sprite();
        this._health = new SecNum(0);
        this.moveSpeedProperty = new CModifiableProperty(Number.MAX_VALUE, 0, 1);
        this.armorProperty = new CModifiableProperty(1, 0, 0);
        this.maxHealthProperty = new MaxHealthProperty(this, Number.MAX_VALUE, 0);
        
        if (BYMConfig.instance.RENDERER_ON) {
            this.m_children = [];
        }
        this.m_baseDepth = 0;
        this.m_isCleared = false;
        this.m_attackFlags = 0;
        this.m_defenseFlags = 0;
        this.m_attackPriorityFlags = [];
    }

    public getRandomPointOnGraphic(): Point {
        const halfWidth = this.width * 0.25;
        const halfHeight = this.height * 0.25;
        const randX = Math.random() * (halfWidth * 2) - halfWidth;
        const randY = Math.random() * (halfHeight * 2) - halfHeight;
        return new Point(randX, randY);
    }

    public get isImmobile(): boolean {
        return this.moveSpeed <= 0;
    }

    public get isCleared(): boolean {
        return this.m_isCleared;
    }

    public get armor(): number {
        return this.armorProperty.value;
    }

    public get moveSpeed(): number {
        return this.moveSpeedProperty.value;
    }

    public get isTargetable(): boolean {
        return this.targetableStatus === 0;
    }

    public get defenseFlags(): number {
        return this.m_defenseFlags;
    }

    public get attackFlags(): number {
        return this.m_attackFlags;
    }

    public get attackPriorityFlags(): number[] {
        return this.m_attackPriorityFlags;
    }

    public set attackFlags(value: number) {
        this.m_attackFlags = value;
    }

    public set defenseFlags(value: number) {
        this.m_defenseFlags = value;
    }

    public get graphic(): Sprite {
        return this._mc;
    }

    public get x(): number {
        return this._mc.x;
    }

    public get y(): number {
        return this._mc.y;
    }

    public get width(): number {
        return this._mc.width;
    }

    public get height(): number {
        return this._mc.height;
    }

    public get numChildren(): number {
        return !BYMConfig.instance.RENDERER_ON ? this.graphic.numChildren : this.m_children.length;
    }

    public get maxHealth(): number {
        return this.maxHealthProperty.value;
    }

    public get health(): number {
        return this._health.Get();
    }

    public setHealth(value: number): void {
        this._health.Set(value);
    }

    public modifyHealth(amount: number, source: ITargetable | null = null): number {
        return 0;
    }

    public override addChild(child: DisplayObject): DisplayObject {
        if (!BYMConfig.instance.RENDERER_ON) {
            return this.graphic.addChild(child);
        }
        
        if (!(child instanceof Object) && !(child instanceof SpriteSheetAnimation)) {
            return child;
        }
        
        const offset = MAP.instance.offset;
        const pt = new Point(this._mc.x + child.x - offset.x, this._mc.y + child.y - offset.y);
        const drawable = child instanceof SpriteSheetAnimation 
            ? (child as SpriteSheetAnimation).bitmapData as IBitmapDrawable
            : child as unknown as IBitmapDrawable;
        
        this.m_children.push(new RasterDataContainer(child, new RasterData(drawable, pt, Number.MAX_VALUE), pt, 0));
        return child;
    }

    public override removeChild(child: DisplayObject): DisplayObject {
        if (!BYMConfig.instance.RENDERER_ON) {
            return this.graphic.removeChild(child);
        }
        
        for (let i = 0; i < this.m_children.length; i++) {
            if (this.m_children[i].m_source === child) {
                this.m_children[i].clear();
                this.m_children.splice(i, 1);
                break;
            }
        }
        return child;
    }

    public override getChildAt(index: number): DisplayObject {
        if (!BYMConfig.instance.RENDERER_ON) {
            return this.graphic.getChildAt(index);
        }
        return this.m_children[index].m_source as DisplayObject;
    }

    public override setChildIndex(child: DisplayObject, index: number): void {
        if (!BYMConfig.instance.RENDERER_ON) {
            this.graphic.setChildIndex(child, index);
        } else {
            for (const container of this.m_children) {
                if (container.m_source === child) {
                    container.m_depth = index;
                    return;
                }
            }
        }
    }

    protected updateRasterData(): void {
        if (!BYMConfig.instance.RENDERER_ON) return;
        
        const offset = MAP.instance.offset;
        const viewRect = MAP.instance.viewRect;
        const testRect = new Rectangle();
        
        if (this._mc && this.m_children.length > 0) {
            let middleOffset = this._mc.height * 0.5;
            if (this._middle) {
                middleOffset = this._middle;
            }
            
            const baseDepth = this.m_baseDepth + (this._mc.y - offset.y + middleOffset) * 1000 + (this._mc.x - offset.x);
            
            for (let i = 0; i < this.m_children.length; i++) {
                const container = this.m_children[i];
                const rd = container.m_rasterData;
                const pt = container.m_rasterPt;
                const depth = container.m_depth;
                
                if (rd && pt) {
                    rd.depth = depth ? baseDepth + depth : baseDepth + i + 1;
                    pt.x = this._mc.x + container.m_source!.x - offset.x;
                    pt.y = this._mc.y + container.m_source!.y - offset.y;
                    
                    testRect.x = pt.x;
                    testRect.y = pt.y;
                    testRect.width = rd.rect!.width;
                    testRect.height = rd.rect!.height;
                    
                    rd.visible = viewRect.intersects(testRect) && this._mc.visible;
                    rd.alpha = this._mc.alpha;
                }
            }
        }
    }

    public clear(): void {
        for (const container of this.m_children) {
            container.clear();
        }
        this.maxHealthProperty = null!;
        this.moveSpeedProperty = null!;
        this.armorProperty = null!;
        this.m_children = null!;
        this.m_isCleared = true;
    }
}
