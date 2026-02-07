import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import Point from "openfl/geom/Point";

import { SecNum } from "../../../cc/utils/SecNum";
import { BYMConfig } from "../../configs/BYMConfig";
import { ILootable } from "../../interfaces/ILootable";
import { RasterData } from "../../rendering/RasterData";
import { ChampionBase } from "./ChampionBase";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../../managers/InstanceManager").InstanceManager; }
function getPATHING(): any { return require("../../pathing/PATHING").PATHING; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getBFOUNDATION(): any { return require("../../../../BFOUNDATION").BFOUNDATION; }
function getBRESOURCE(): any { return require("../../../../BRESOURCE").BRESOURCE; }
function getBSTORAGE(): any { return require("../../../../BSTORAGE").BSTORAGE; }
function getBTOWER(): any { return require("../../../../BTOWER").BTOWER; }
function getBunker(): any { return require("../../../../Bunker").Bunker; }
function getCHAMPIONCAGE(): any { return require("../../../../CHAMPIONCAGE").CHAMPIONCAGE; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getGRID(): any { return require("../../../../GRID").GRID; }
function getMONSTERBUNKER(): any { return require("../../../../MONSTERBUNKER").MONSTERBUNKER; }
function getSPRITES(): any { return require("../../../../SPRITES").SPRITES; }



/**
 * Krallen - looter champion that targets resource buildings and storage.
 */
export class Krallen extends ChampionBase {
    public static readonly MAX_POWERLEVEL: number = 2;
    public static readonly TYPE: number = 5;

    public _lootMults: Map<any, SecNum> | null = null;

    constructor(
        creatureId: string,
        position: Point,
        rotation: number,
        targetPos: Point | null = null,
        isEnemy: boolean = false,
        targetBuilding: BFOUNDATION | null = null,
        level: number = 1,
        hp: number = 0,
        damage: number = 0,
        speed: number = 1,
        range: number = 20000,
        armor: number = 0,
        powerLevel: number = 1
    ) {
        powerLevel = Math.min(powerLevel, Krallen.MAX_POWERLEVEL);
        super(creatureId, position, rotation, targetPos, isEnemy, targetBuilding, level, hp, damage, speed, range, armor, powerLevel);
        const abilities: Array<any> = getCHAMPIONCAGE().GetGuardianProperties(this._creatureID, "abilities");
        const pLevel = this._powerLevel.Get();
        const abilityCount = abilities.length;
        this._lootMults = new Map();
        this._lootMults.set(BRESOURCE, new SecNum(2));
        this._lootMults.set(BSTORAGE, new SecNum(3));
        this._buff = getCHAMPIONCAGE().GetGuardianProperty(this._creatureID, this._level.Get(), "buffs");
        let i = 0;
        while (i < abilityCount) {
            if (pLevel < i) {
                break;
            }
            const AbilityClass = abilities[i] as any;
            if (AbilityClass) {
                this.addComponent(new AbilityClass());
            }
            i++;
        }
    }

    protected override setupSprite(): void {
        this._frameNumber = Math.random() * 7;
        this._spriteID = this._creatureID + "_" + this._powerLevel.Get();
        getSPRITES().SetupSprite(this._spriteID);
        const descriptor = getSPRITES().GetSpriteDescriptor(this._spriteID);
        this._graphic = new BitmapData(descriptor.width, descriptor.height, true, 16777215);
        this._graphicMC = BYMConfig.instance.RENDERER_ON ? new Bitmap(this._graphic) : this.graphic.addChild(new Bitmap(this._graphic)) as Bitmap;
        this._graphicMC.x = getCHAMPIONCAGE().GetGuardianProperty(this._creatureID, this._powerLevel.Get(), "offset_x");
        this._graphicMC.y = getCHAMPIONCAGE().GetGuardianProperty(this._creatureID, this._powerLevel.Get(), "offset_y");
        if (BYMConfig.instance.RENDERER_ON) {
            this._rasterData = new RasterData(this._graphicMC, this._rasterPt, Number.MAX_VALUE);
        }
    }

    public override findTarget(param1: number = 0): void {
        const buildingsAll = getInstanceManager().getInstancesByClass(getBFOUNDATION()) as Record<string, any>;
        const towers = getInstanceManager().getInstancesByClass(getBTOWER()) as Array<any>;
        const bunkers = getInstanceManager().getInstancesByClass(getBunker()) as Array<any>;
        const monsterBunkers = getInstanceManager().getInstancesByClass(getMONSTERBUNKER()) as Array<any>;
        const candidates: Array<any> = [];
        const lootedBuildings: Map<BFOUNDATION, boolean> = new Map();
        this._looking = true;
        const myGridPos = getPATHING().FromISO(this._tmpPoint);
        let foundValidTarget = false;

        // Search for lootable buildings
        for (const key in buildingsAll) {
            const building = buildingsAll[key] as BFOUNDATION;
            if (building.health > 0 && (building as any as ILootable)) {
                if (!building._looted) {
                    const buildingGridPos = getGRID().FromISO(building._mc.x, building._mc.y + building._middle);
                    const distance = getGLOBAL().QuickDistance(myGridPos, buildingGridPos) - building._middle;
                    candidates.push({
                        "building": building,
                        "distance": distance
                    });
                    foundValidTarget = true;
                } else {
                    lootedBuildings.set(building, true);
                }
            }
        }

        // If no lootable buildings, target towers
        if (!foundValidTarget) {
            for (const tower of towers) {
                if (tower.health > 0 && !(tower as BTOWER).isJard) {
                    const buildingGridPos = getGRID().FromISO(tower._mc.x, tower._mc.y + tower._middle);
                    const distance = getGLOBAL().QuickDistance(myGridPos, buildingGridPos) - tower._middle;
                    candidates.push({
                        "building": tower,
                        "distance": distance,
                        "expand": false
                    });
                    foundValidTarget = true;
                }
            }
        }

        // If no towers, target bunkers
        if (!foundValidTarget) {
            for (const bunker of bunkers) {
                if (bunker.health > 0 && (bunker._used > 0 || bunker._monstersDispatchedTotal > 0)) {
                    const buildingGridPos = getGRID().FromISO(bunker._mc.x, bunker._mc.y + bunker._middle);
                    const distance = getGLOBAL().QuickDistance(myGridPos, buildingGridPos) - bunker._middle;
                    candidates.push({
                        "building": bunker,
                        "distance": distance,
                        "expand": false
                    });
                }
            }
        }

        // If still none, go for already looted buildings
        if (!foundValidTarget) {
            lootedBuildings.forEach((value, building) => {
                const buildingGridPos = getGRID().FromISO(building._mc.x, building._mc.y + building._middle);
                const distance = getGLOBAL().QuickDistance(myGridPos, buildingGridPos) - building._middle;
                candidates.push({
                    "building": building,
                    "distance": distance,
                    "expand": true
                });
                foundValidTarget = true;
            });
        }

        // Fallback to any building
        if (candidates.length === 0) {
            for (const building of getBASE()._buildingsMain) {
                if (building._class !== "decoration" && building._class !== "immovable" && building.health > 0 && building._class !== "enemy") {
                    if (building._class === "tower" && !getMONSTERBUNKER().isBunkerBuilding(building._type)) {
                        if ((building as BTOWER).isJard) {
                            continue;
                        }
                    }
                    const buildingGridPos = getGRID().FromISO(building._mc.x, building._mc.y + building._middle);
                    const distance = getGLOBAL().QuickDistance(myGridPos, buildingGridPos) - building._middle;
                    candidates.push({
                        "building": building,
                        "distance": distance,
                        "expand": true
                    });
                }
            }
        }

        if (candidates.length === 0) {
            this.changeModeRetreat();
        } else {
            candidates.sort((a, b) => a.distance - b.distance);
            let idx = 0;
            if (this._movement === "burrow") {
                this._hasTarget = true;
                this._hasPath = true;
                const targetGridPos = getGRID().FromISO(candidates[idx].building._mc.x, candidates[idx].building._mc.y);
                const direction = Math.floor(Math.random() * 4);
                const footprintH = candidates[idx].building._footprint[0].height;
                const footprintW = candidates[idx].building._footprint[0].width;
                if (direction === 0) {
                    targetGridPos.x += Math.random() * footprintH;
                    targetGridPos.y += footprintW;
                } else if (direction === 1) {
                    targetGridPos.x += footprintH;
                    targetGridPos.y += footprintW;
                } else if (direction === 2) {
                    targetGridPos.x += footprintH - Math.random() * footprintH / 2;
                    targetGridPos.y -= footprintW / 4;
                } else if (direction === 3) {
                    targetGridPos.x -= footprintH / 4;
                    targetGridPos.y += footprintW - Math.random() * footprintW / 2;
                }
                this._waypoints = [getGRID().ToISO(targetGridPos.x, targetGridPos.y, 0)];
                this._targetPosition = this._waypoints[0];
                this._targetBuilding = candidates[idx].building;
            } else if (this._movement === "fly") {
                this._hasTarget = true;
                this._hasPath = true;
                this._targetBuilding = candidates[idx].building;
                this._targetCenter = this._targetBuilding._position;
                if (getGLOBAL().QuickDistance(this._tmpPoint, this._targetCenter) < 170) {
                    this._atTarget = true;
                    this._hasPath = true;
                    this._targetPosition = this._targetCenter;
                } else {
                    let angle = Math.atan2(this._tmpPoint.y - this._targetCenter.y, this._tmpPoint.x - this._targetCenter.x) * 57.2957795;
                    angle += (Math.random() * 40 - 20);
                    angle = angle / (180 / Math.PI);
                    const dist = 120 + Math.random() * 10;
                    const destPoint = new Point(this._targetCenter.x + Math.cos(angle) * dist * 1.7, this._targetCenter.y + Math.sin(angle) * dist);
                    this._waypoints = [destPoint];
                    this._targetPosition = this._waypoints[0];
                }
            } else if (getGLOBAL()._catchup) {
                this.WaypointTo(new Point(candidates[0].building._mc.x, candidates[0].building._mc.y), candidates[0].building);
            } else {
                idx = 0;
                while (idx < 2) {
                    if (candidates.length > idx) {
                        this.WaypointTo(new Point(candidates[idx].building._mc.x, candidates[idx].building._mc.y), candidates[idx].building);
                    }
                    idx++;
                }
            }
        }
    }

    public override clear(): void {
        this._lootMults = null;
        super.clear();
    }
}
