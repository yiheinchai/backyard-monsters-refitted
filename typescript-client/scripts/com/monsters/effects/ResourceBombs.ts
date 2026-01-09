import { BitmapData } from "openfl/display/BitmapData";
import { MovieClip } from "openfl/display/MovieClip";
import { Point } from "openfl/geom/Point";

import { SecNum } from "../../cc/utils/SecNum";
import { ALLIANCES } from "../alliances/ALLIANCES";
import { ImageCache } from "../display/ImageCache";
import { InstanceManager } from "../managers/InstanceManager";
import { ResourceBomb } from "./ResourceBomb";

import { ACHIEVEMENTS } from "../../../ACHIEVEMENTS";
import { ATTACK } from "../../../ATTACK";
import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { CATAPULTPOPUP } from "../../../CATAPULTPOPUP";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { MAP } from "../../../MAP";
import { MARKETING } from "../../../MARKETING";
import { SOUNDS } from "../../../SOUNDS";

/**
 * ResourceBombs - manages catapult resource bombs during attacks.
 */
export class ResourceBombs {
    public static _activeBombs: Record<string, ResourceBomb> = {};
    public static bombcounter: number = 0;
    public static bmd_pebble: BitmapData | null = null;
    public static bmd_pebblehit: BitmapData | null = null;
    public static bmd_twigs: BitmapData | null = null;
    public static bmd_putty: BitmapData | null = null;
    public static _bombs: Record<string, any> | null = null;
    public static _bombid: string = "";
    public static _setup: boolean = false;
    public static _doneData: boolean = false;
    public static _mc: CATAPULTPOPUP | null = null;
    public static _state: number = 0;
    protected static _launchedBomb: boolean = false;

    constructor() {
    }

    public static get launchedBomb(): boolean {
        return ResourceBombs._launchedBomb;
    }

    public static Data(): void {
        ResourceBombs._bombs = {
            "tw0": { "used": false, "group": 0, "particles": 200, "name": KEYS.Get("bomb_tw0_name"), "description": "", "radius": 200, "damage": 2200, "cost": 10000, "resource": 1, "image": "bombbuttons/twigs1.png", "col": 0, "dropTarget": 2, "catapultLevel": 1 },
            "tw1": { "used": false, "group": 0, "particles": 200, "name": KEYS.Get("bomb_tw1_name"), "description": "", "radius": 200, "damage": 7000, "cost": 100000, "resource": 1, "image": "bombbuttons/twigs2.png", "col": 1, "dropTarget": 2, "catapultLevel": 1 },
            "tw2": { "used": false, "group": 0, "particles": 200, "name": KEYS.Get("bomb_tw2_name"), "description": "", "radius": 200, "damage": 50000, "cost": 5000000, "resource": 1, "image": "bombbuttons/twigs3.png", "col": 2, "dropTarget": 2, "catapultLevel": 1 },
            "pb0": { "used": false, "group": 1, "particles": 200, "name": KEYS.Get("bomb_pb0_name"), "description": "", "radius": 200, "damage": 2400, "cost": 10000, "resource": 2, "image": "bombbuttons/pebbles1.png", "col": 0, "dropTarget": 2, "catapultLevel": 2 },
            "pb1": { "used": false, "group": 1, "particles": 200, "name": KEYS.Get("bomb_pb1_name"), "description": "", "radius": 300, "damage": 9000, "cost": 100000, "resource": 2, "image": "bombbuttons/pebbles2.png", "col": 1, "dropTarget": 2, "catapultLevel": 2 },
            "pb2": { "used": false, "group": 1, "particles": 200, "name": KEYS.Get("bomb_pb2_name"), "description": "", "radius": 350, "damage": 30000, "cost": 2000000, "resource": 2, "image": "bombbuttons/pebbles3.png", "col": 2, "dropTarget": 2, "catapultLevel": 2 },
            "pb3": { "used": false, "group": 1, "particles": 200, "name": KEYS.Get("bomb_pb3_name"), "description": "", "radius": 400, "damage": 75000, "cost": 10000000, "resource": 2, "image": "bombbuttons/pebbles4.png", "col": 3, "dropTarget": 2, "catapultLevel": 2 },
            "pu0": { "used": false, "group": 2, "particles": 25, "name": KEYS.Get("bomb_pu0_name"), "description": "bomb_pu_description", "damageMult": 0.2, "radius": 150, "damage": 0, "speed": 1.2, "speedlength": 10, "cost": 10000, "resource": 3, "image": "bombbuttons/putty1.png", "col": 0, "dropTarget": 3, "catapultLevel": 3 },
            "pu1": { "used": false, "group": 2, "particles": 37, "name": KEYS.Get("bomb_pu1_name"), "description": "bomb_pu_description", "damageMult": 0.4, "radius": 150, "damage": 0, "speed": 1.4, "speedlength": 15, "cost": 100000, "resource": 3, "image": "bombbuttons/putty2.png", "col": 1, "dropTarget": 3, "catapultLevel": 3 },
            "pu2": { "used": false, "group": 2, "particles": 43, "name": KEYS.Get("bomb_pu2_name"), "description": "bomb_pu_description", "damageMult": 0.7, "radius": 300, "damage": 0, "speed": 1.8, "speedlength": 30, "cost": 5000000, "resource": 3, "image": "bombbuttons/putty3.png", "col": 2, "dropTarget": 3, "catapultLevel": 3 },
            "pu3": { "used": false, "group": 2, "particles": 50, "name": KEYS.Get("bomb_pu3_name"), "description": "bomb_pu_description", "damageMult": 0.9, "radius": 500, "damage": 0, "speed": 2, "speedlength": 40, "cost": 10000000, "resource": 3, "image": "bombbuttons/putty4.png", "col": 3, "dropTarget": 3, "catapultLevel": 3 }
        };
    }

    public static Setup(): void {
        ImageCache.GetImageWithCallBack("effects/twigs.png", ResourceBombs.onAssetLoaded, true, 6);
        ImageCache.GetImageWithCallBack("effects/pebble.png", ResourceBombs.onAssetLoaded, true, 6);
        ImageCache.GetImageWithCallBack("effects/pebblehit.png", ResourceBombs.onAssetLoaded, true, 6);
        ImageCache.GetImageWithCallBack("effects/putty.png", ResourceBombs.onAssetLoaded, true, 6);
        let highestCost = 0;
        let bestBombId = "tw0";
        ResourceBombs._bombid = "tw0";
        ResourceBombs._launchedBomb = false;
        if (GLOBAL.mode === GLOBAL.e_BASE_MODE.ATTACK) {
            for (const bombId in ResourceBombs._bombs) {
                const bomb = ResourceBombs._bombs[bombId];
                if (GLOBAL._attackersResources["r" + bomb.resource].Get() >= bomb.cost && GLOBAL._attackersCatapult >= bomb.catapultLevel && bomb.cost <= 2000000) {
                    if (bomb.cost > highestCost) {
                        highestCost = bomb.cost;
                        bestBombId = bombId;
                    }
                }
            }
            ResourceBombs._bombid = bestBombId;
        }
    }

    public static Clear(): void {
        ResourceBombs._mc = null;
        ResourceBombs._launchedBomb = false;
    }

    public static onAssetLoaded(url: string, bmd: BitmapData): void {
        if (url === "effects/pebble.png") {
            ResourceBombs.bmd_pebble = bmd;
        } else if (url === "effects/pebblehit.png") {
            ResourceBombs.bmd_pebblehit = bmd;
        } else if (url === "effects/twigs.png") {
            ResourceBombs.bmd_twigs = bmd;
        } else if (url === "effects/putty.png") {
            ResourceBombs.bmd_putty = bmd;
        }
    }

    public static BombAdd(bombData: Record<string, any>): void {
        ResourceBombs._state = 1;
        ATTACK.DropZone(bombData.radius, bombData.dropTarget);
        if (ResourceBombs._mc) {
            ResourceBombs._mc.Update();
        }
    }

    public static BombRemove(): void {
        if (ResourceBombs._state === 1) {
            ATTACK.RemoveDropZone();
            ResourceBombs._state = 0;
            if (ResourceBombs._mc) {
                ResourceBombs._mc.Update();
            }
        }
    }

    public static BombDrop(): void {
        const bombData = ResourceBombs._bombs![ResourceBombs._bombid];
        let canDrop = false;
        if (Boolean(ResourceBombs._mc) && ResourceBombs._mc!.waitTime > GLOBAL.Timestamp()) {
            return;
        }
        ATTACK.RemoveDropZone();
        if (GLOBAL._attackersResources) {
            if (GLOBAL._attackersResources["r" + bombData.resource].Get() >= bombData.cost) {
                GLOBAL._resources["r" + bombData.resource].Add(-bombData.cost);
                GLOBAL._hpResources["r" + bombData.resource] -= bombData.cost;
                GLOBAL._attackersDeltaResources["r" + bombData.resource] = new SecNum(-bombData.cost);
                GLOBAL._attackersDeltaResources.dirty = true;
                canDrop = true;
            }
        }
        if (canDrop) {
            for (const key in ResourceBombs._bombs) {
                const bomb = ResourceBombs._bombs[key];
                if (bomb.resource === bombData.resource) {
                    bomb.used = true;
                }
            }
            ResourceBombs.Trigger(MAP._BUILDINGBASES, new Point(MAP._GROUND.mouseX, MAP._GROUND.mouseY), bombData, 2);
        }
        if (ResourceBombs._bombid === "pu3") {
            ACHIEVEMENTS.Check("hugerage", 1);
        }
        ATTACK.Log("bomb" + ResourceBombs._bombid, "<font color=\"#A800FF\">" + KEYS.Get("attack_log_catapulted", { "v1": GLOBAL.FormatNumber(bombData.cost), "v2": GLOBAL._resourceNames[bombData.resource - 1] }) + "</font>");
        ResourceBombs._state = 0;
        if (ResourceBombs._mc) {
            ResourceBombs._mc.Update();
        }
    }

    public static Trigger(container: MovieClip, position: Point, bombData: Record<string, any>, scale: number = 2): void {
        ResourceBombs._activeBombs[ResourceBombs.bombcounter] = new ResourceBomb(container, position, bombData, scale);
        if (bombData.resource === 1) {
            SOUNDS.Play("twigbomb");
        } else if (bombData.resource === 2) {
            SOUNDS.Play("pebblebomb");
        } else if (bombData.resource === 3) {
            SOUNDS.Play("puttybomb");
        }
        ++ResourceBombs.bombcounter;
        ResourceBombs._launchedBomb = true;
        if (ResourceBombs._mc) {
            ResourceBombs._mc.fired();
        }
        if (ALLIANCES._myAlliance) {
            LOGGER.Stat([27, bombData.resource, bombData.col, bombData.cost, ALLIANCES._allianceID]);
        } else {
            LOGGER.Stat([27, bombData.resource, bombData.col, bombData.cost]);
        }
    }

    public static Tick(): void {
        let count = 0;
        for (const key in ResourceBombs._activeBombs) {
            const bomb = ResourceBombs._activeBombs[key];
            count++;
            if (bomb.Tick()) {
                BASE.Save();
                bomb.Freeze();
                delete ResourceBombs._activeBombs[key];
                count--;
                if (count === 0 && GLOBAL.mode === GLOBAL.e_BASE_MODE.BUILD) {
                    const buildings = InstanceManager.getInstancesByClass(BFOUNDATION);
                    for (const building of buildings) {
                        const b = building as BFOUNDATION;
                        if (b.health < b.maxHealth && b._repairing === 0) {
                            b.Repair();
                        }
                    }
                    MARKETING.Show("catapult");
                    BASE.Save();
                }
            }
        }
    }

    public static Check(): string {
        const values: Array<number> = [];
        const bombIds = ["tw0", "tw1", "tw2", "pb0", "pb1", "pb2", "pb3", "pu0", "pu1", "pu2", "pu3"];
        for (const bombId of bombIds) {
            const bomb = ResourceBombs._bombs![bombId];
            if (bomb.radius) {
                values.push(bomb.radius);
            }
            if (bomb.damage) {
                values.push(bomb.damage);
            }
            if (bomb.cost) {
                values.push(bomb.cost);
            }
            if (bomb.resource) {
                values.push(bomb.resource);
            }
            if (bomb.damageMult) {
                values.push(bomb.damageMult);
            }
            if (bomb.speed) {
                values.push(bomb.speed);
            }
            if (bomb.speedlength) {
                values.push(bomb.speedlength);
            }
        }
        // md5 function not available, return placeholder
        return JSON.stringify(values);
    }
}
