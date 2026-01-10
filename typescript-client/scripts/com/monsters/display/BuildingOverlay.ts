import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { DisplayObject } from "openfl/display/DisplayObject";
import { Sprite } from "openfl/display/Sprite";
import { GlowFilter } from "openfl/filters/GlowFilter";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";
import { TextField } from "openfl/text/TextField";
import { TextFormat } from "openfl/text/TextFormat";

import { BYMConfig } from "../configs/BYMConfig";
import { ImageText } from "./ImageText";

import { BFOUNDATION } from "../../../BFOUNDATION";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { MAP } from "../../../MAP";
import { Embed } from "../../../core/Embed";

// [Embed(source="/_assets/assets.swf", symbol="bmp_healthbarlarge")]
declare class bmp_healthbarlarge extends BitmapData {}
// [Embed(source="/_assets/assets.swf", symbol="bmp_healthbarsmall")]
declare class bmp_healthbarsmall extends BitmapData {}
// [Embed(source="/_assets/assets.swf", symbol="bmp_progressbarlarge")]
declare class bmp_progressbarlarge extends BitmapData {}
// [Embed(source="/_assets/assets.swf", symbol="bmp_overlaytext")]
declare class bmp_overlaytext extends BitmapData {}

interface BuildingOverlayData {
    container: Sprite;
    bmdtext: BitmapData;
    bmdprogress: BitmapData;
    bmdhp: BitmapData;
    indextext: string;
    indexprogress: number;
    indexhp: number;
}

/**
 * Displays building health bars, progress bars, and status text overlays.
 */
@Embed({ source: "/_assets/assets.swf", symbol: "bmp_healthbarlarge" })
export class BuildingOverlay {
    private static readonly k_SHOW_DEBUG_HEALTH: boolean = false;
    
    private static debugHealth: TextField | null = null;
    private static _buildings: { [key: string]: BuildingOverlayData } = {};
    private static _bmdHPbarLarge: BitmapData = new bmp_healthbarlarge(0, 0);
    private static _bmdHPbarSmall: BitmapData = new bmp_healthbarsmall(0, 0);
    private static _bmpProgressBarLarge: BitmapData = new bmp_progressbarlarge(0, 0);
    private static _bmpOverlayText: BitmapData = new bmp_overlaytext(0, 0);
    private static _isSetup: boolean = false;
    
    private static u_bmd: BitmapData;
    private static r_bmd: BitmapData;
    private static b_bmd: BitmapData;
    private static f_bmd: BitmapData;
    private static labelWidth: number = 0;
    private static _textDO: DisplayObject | null = null;

    constructor() {}

    public static Setup(building: BFOUNDATION): void {
        const overlayOffset = building._overlayOffset;
        
        if (!BuildingOverlay._isSetup) {
            BuildingOverlay._isSetup = true;
            BuildingOverlay.labelWidth = 0;
            const filters = [new GlowFilter(0, 1, 2, 2, 4, 1)];
            
            BuildingOverlay.u_bmd = ImageText.Get(KEYS.Get("bdg_state_upgrading"), 9, 0.6, filters);
            BuildingOverlay.r_bmd = ImageText.Get(KEYS.Get("bdg_state_repairing"), 9, 0.6, filters);
            BuildingOverlay.b_bmd = ImageText.Get(KEYS.Get("bdg_state_building"), 9, 0.6, filters);
            BuildingOverlay.f_bmd = ImageText.Get(KEYS.Get("bdg_state_fortifying"), 9, 0.6, filters);
            
            const bmds = [BuildingOverlay.u_bmd, BuildingOverlay.r_bmd, BuildingOverlay.b_bmd, BuildingOverlay.f_bmd];
            for (const bmd of bmds) {
                BuildingOverlay.labelWidth = BuildingOverlay.labelWidth > bmd.width ? BuildingOverlay.labelWidth : bmd.width;
            }
        }
        
        BuildingOverlay._buildings[building._id] = {
            container: new Sprite(),
            bmdtext: new BitmapData(BuildingOverlay.labelWidth, 21, true, 0xFFFFFF),
            bmdprogress: new BitmapData(51, 6, true, 0xFFFFFF),
            bmdhp: new BitmapData(51, 6, true, 0xFFFFFF),
            indextext: "",
            indexprogress: -1,
            indexhp: -1
        };
        
        const container = BuildingOverlay._buildings[building._id].container;
        container.mouseEnabled = false;
        container.mouseChildren = false;
        
        let child: DisplayObject;
        child = container.addChild(new Bitmap(BuildingOverlay._buildings[building._id].bmdtext));
        child.x = -26 + overlayOffset.x + (51 - BuildingOverlay.labelWidth) * 0.5;
        child.y = -32 + overlayOffset.y;
        
        child = container.addChild(new Bitmap(BuildingOverlay._buildings[building._id].bmdprogress));
        child.x = -26 + overlayOffset.x;
        child.y = -20 + overlayOffset.y;
        
        child = container.addChild(new Bitmap(BuildingOverlay._buildings[building._id].bmdhp));
        child.x = -26 + overlayOffset.x;
        child.y = -14 + overlayOffset.y;
        
        if (!BYMConfig.instance.RENDERER_ON) {
            building._mc.addChild(container);
        } else {
            container.x = building._mc.x;
            container.y = building._mc.y;
            MAP._BUILDINGTOPS.addChild(container);
        }
        
        if (GLOBAL._aiDesignMode && BuildingOverlay.k_SHOW_DEBUG_HEALTH) {
            BuildingOverlay.debugHealth = new TextField();
            BuildingOverlay.debugHealth.defaultTextFormat = new TextFormat("Arial", 10, 0xFFFFFF, true);
        }
        
        BuildingOverlay.Update(building);
    }

    public static Update(building: BFOUNDATION, forceUpdate: boolean = false): void {
        let progressIndex = -1;
        let statusText = "";
        const now = Date.now();
        
        if (!BuildingOverlay._buildings[building._id]) {
            BuildingOverlay.Setup(building);
        }
        
        const data = BuildingOverlay._buildings[building._id];
        
        if (GLOBAL._render) {
            if (BYMConfig.instance.RENDERER_ON) {
                data.container.x = building._mc.x;
                data.container.y = building._mc.y;
            }
            
            if (building._repairing) {
                progressIndex = Math.floor(49 / building.maxHealth * building.health);
                statusText = "repairing";
            } else if (building._countdownBuild.Get() > 0) {
                let totalTime = 0;
                if (building._prefab) {
                    for (let i = 0; i < building._prefab; i++) {
                        totalTime += GLOBAL._buildingProps[building._type - 1].costs[i].time.Get();
                    }
                } else {
                    totalTime = building._buildingProps.costs[building._lvl.Get()].time.Get();
                }
                progressIndex = Math.floor(49 / totalTime * (totalTime - building._countdownBuild.Get()));
                statusText = "building";
            } else if (building._countdownUpgrade.Get() > 0) {
                const upgradeTime = building._buildingProps.costs[building._lvl.Get()].time.Get();
                progressIndex = Math.floor(49 / upgradeTime * (upgradeTime - building._countdownUpgrade.Get()));
                statusText = "upgrading";
            } else if (building._countdownFortify.Get() > 0) {
                if (building._buildingProps.fortify_costs[building._fortification.Get()]) {
                    const fortifyTime = building._buildingProps.fortify_costs[building._fortification.Get()].time.Get();
                    progressIndex = Math.floor(49 / fortifyTime * (fortifyTime - building._countdownFortify.Get()));
                    statusText = "fortifying";
                }
            }
            
            // Update status text
            if (statusText !== data.indextext || forceUpdate) {
                data.indextext = statusText;
                const textBmd = data.bmdtext;
                const lw = BuildingOverlay.labelWidth;
                
                if (statusText === "repairing") {
                    textBmd.copyPixels(BuildingOverlay.r_bmd, new Rectangle(0, 0, BuildingOverlay.r_bmd.width, BuildingOverlay.r_bmd.height), new Point((lw - BuildingOverlay.r_bmd.width) * 0.5, -1));
                } else if (statusText === "building") {
                    textBmd.copyPixels(BuildingOverlay.b_bmd, new Rectangle(0, 0, BuildingOverlay.b_bmd.width, BuildingOverlay.b_bmd.height), new Point((lw - BuildingOverlay.b_bmd.width) * 0.5, -1));
                } else if (statusText === "upgrading") {
                    textBmd.copyPixels(BuildingOverlay.u_bmd, new Rectangle(0, 0, BuildingOverlay.u_bmd.width, BuildingOverlay.u_bmd.height), new Point((lw - BuildingOverlay.u_bmd.width) * 0.5, -1));
                } else if (statusText === "fortifying") {
                    textBmd.copyPixels(BuildingOverlay.f_bmd, new Rectangle(0, 0, BuildingOverlay.f_bmd.width, BuildingOverlay.f_bmd.height), new Point((lw - BuildingOverlay.f_bmd.width) * 0.5, -1));
                }
            }
            
            // Update progress bar
            if (progressIndex === -1) {
                if (data.indexprogress !== -1) {
                    data.indexprogress = -1;
                    data.bmdtext.fillRect(data.bmdtext.rect, 0);
                    data.bmdprogress.fillRect(data.bmdprogress.rect, 0);
                }
            } else if (progressIndex !== data.indexprogress) {
                data.indexprogress = progressIndex;
                if (building._repairing) {
                    data.bmdprogress.fillRect(data.bmdprogress.rect, 0);
                } else {
                    data.bmdprogress.copyPixels(BuildingOverlay._bmpProgressBarLarge, new Rectangle(0, 6 * progressIndex, 51, 6), new Point(0, 0));
                }
            }
            
            // Debug health display
            if (BuildingOverlay.debugHealth) {
                BuildingOverlay.debugHealth.text = building.health + "/" + building.maxHealth;
                BuildingOverlay.debugHealth.visible = building.isDamaged;
                building.graphic.addChild(BuildingOverlay.debugHealth);
            }
            
            // Update health bar
            if (building.health <= 0) {
                data.indexhp = -1;
                data.bmdhp.fillRect(data.bmdhp.rect, 0);
            } else if (building.health < building.maxHealth) {
                const hpIndex = 19 - Math.floor(19 / building.maxHealth * building.health);
                if (hpIndex !== data.indexhp) {
                    data.indexhp = hpIndex;
                    data.bmdhp.copyPixels(BuildingOverlay._bmdHPbarLarge, new Rectangle(0, 6 * hpIndex, 51, 6), new Point(0, 0));
                }
            } else if (data.indexhp !== -1) {
                data.indexhp = -1;
                data.bmdhp.fillRect(data.bmdhp.rect, 0);
            }
        }
    }

    public static clearBuilding(building: BFOUNDATION): void {
        const data = BuildingOverlay._buildings[building._id];
        if (!data) return;
        
        BuildingOverlay.clearOverlay(data);
        delete BuildingOverlay._buildings[building._id];
    }

    protected static clearOverlay(data: BuildingOverlayData): void {
        if (data.container && data.container.parent === MAP._BUILDINGTOPS) {
            MAP._BUILDINGTOPS.removeChild(data.container);
        }
        if (data.bmdtext instanceof BitmapData) {
            data.bmdtext.dispose();
        }
        if (data.bmdprogress instanceof BitmapData) {
            data.bmdprogress.dispose();
        }
        if (data.bmdhp instanceof BitmapData) {
            data.bmdhp.dispose();
        }
        (data as any).container = null;
        (data as any).indextext = null;
    }

    public static Clear(): void {
        for (const key in BuildingOverlay._buildings) {
            BuildingOverlay.clearOverlay(BuildingOverlay._buildings[key]);
        }
        BuildingOverlay._buildings = {};
    }
}
