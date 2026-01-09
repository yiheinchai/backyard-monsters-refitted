import { MovieClip } from "openfl/display/MovieClip";
import { Sprite } from "openfl/display/Sprite";
import { Event } from "openfl/events/Event";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";
import { getTimer } from "openfl/utils/getTimer";

import { BaseObject } from "./model/BaseObject";
import { DescentView } from "./views/DescentView";
import { DescentMapRoom } from "./DescentMapRoom";
import { DescentMonsterBase } from "./DescentMonsterBase";
import { ForeignBase } from "./ForeignBase";
import { MapRoom } from "./MapRoom";
import { MapViewDescent_Fog_Shroud } from "./MapViewDescent_Fog_Shroud";
import { MiniMap } from "./MiniMap";
import { Obstruction } from "./Obstruction";
import { PlayerBase } from "./PlayerBase";
import { WildMonsterBase } from "./WildMonsterBase";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { MAPROOM_INFERNO } from "../../../MAPROOM_INFERNO";

/**
 * DescentLayer - Inferno map room descent layer.
 * 
 * We have opted to use the March 2012 pre-patch version of descent bases
 * which introduced the original 13, over the reduced version of 7.
 * For more info visit: https://backyard-monsters.fandom.com/wiki/Inferno
 */
export class DescentLayer extends Sprite {
    private _lastUpdated: number = 0;
    private _getting: boolean = false;
    private _gets: number = 0;
    public basesForeign: Array<any>;
    public basesWM: Array<any>;
    public basesAll: Array<any>;
    public baseData: Array<any>;
    private divisor: number = 85;
    public lastOpened: ForeignBase | null = null;
    private _frameNumber: number = 0;
    private jitter: number = 2;
    public obstructions: Array<any> | null = null;
    public _playersLimit: number = 180;
    public mapWidth: number = 760;
    public player: PlayerBase | null = null;
    public _wmbToDisplay: number = 13;
    private wmBasesUsed: number = 0;
    private descentShroud: MovieClip | null = null;
    public targetLvl: number = 0;
    public targetBase: DescentMonsterBase | null = null;
    private _BRIDGE: any;
    private descentBaseProps: Record<string, any>;
    public faked: boolean = false;

    constructor() {
        this.descentBaseProps = {
            "0": { "x": 150, "y": 10 },
            "1": { "x": 350, "y": 260 },
            "2": { "x": 550, "y": 340 },
            "3": { "x": 350, "y": 420 },
            "4": { "x": 135, "y": 440 },
            "5": { "x": 270, "y": 620 },
            "6": { "x": 550, "y": 560 },
            "7": { "x": 450, "y": 775 },
            "8": { "x": 150, "y": 885 },
            "9": { "x": 540, "y": 1010 },
            "10": { "x": 330, "y": 1170 },
            "11": { "x": 155, "y": 1390 },
            "12": { "x": 540, "y": 1360 },
            "13": { "x": 350, "y": 1765 }
        };
        super();
        this.basesForeign = [];
        this.baseData = [];
        this.basesAll = [];
        this.basesWM = [];
        if (MAPROOM_DESCENT._open) {
            if (DescentMapRoom.BRIDGE) {
                this._BRIDGE = DescentMapRoom.BRIDGE;
            }
        } else if (MAPROOM_INFERNO._open) {
            if (MapRoom.BRIDGE) {
                this._BRIDGE = MapRoom.BRIDGE;
            }
        }
        this.descentShroud = new MapViewDescent_Fog_Shroud();
        this.player = new PlayerBase(this._BRIDGE.playerBaseID, this._BRIDGE.playerBaseSeed);
        this.player.addEventListener(MouseEvent.MOUSE_OVER, this.sortToTop.bind(this));
        this.basesAll.push(this.player);
        this.addChild(this.player);
        this.player.x = 350;
        this.player.y = 10;
        this.player.alpha = 0;
        this.wmBasesUsed = 0;
    }

    public Clear(): void {
        for (let i = 0; i < this.basesAll.length; i++) {
            if (this.basesAll[i].parent) {
                this.basesAll[i].removeEventListener("over", this.onBaseStateChange.bind(this));
                this.basesAll[i].removeEventListener("off", this.onBaseStateChange.bind(this));
                this.basesAll[i].removeEventListener("down", this.onBaseStateChange.bind(this));
                this.basesAll[i].parent.removeChild(this.basesAll[i]);
            }
        }
        for (let i = 0; i < this.baseData.length; i++) {
            this.baseData[i].Clear();
        }
        this.basesForeign = [];
        this.baseData = [];
        this.basesAll = [];
        this.basesWM = [];
        this.player = null;
        this.descentShroud = null;
    }

    public Tick(): void {
        if (this._lastUpdated > 0 && GLOBAL.Timestamp() - this._lastUpdated > 15 && !this._getting) {
            this.Get();
        }
        if (this._frameNumber % 40 === 0) {
            let msg = "";
            if (this._BRIDGE.GLOBAL._flags.attacking === 0) {
                msg = KEYS.Get("map_msg_attackingdisabled");
            }
            if (msg) {
                // Display message
            }
        }
        ++this._frameNumber;
    }

    public Get(): void {
        this._getting = true;
        ++this._gets;
        if (this._gets > 12) {
            // Exceeded attempts
        }
        const obj: any = {
            "error": 0,
            "bases": [],
            "currenttime": GLOBAL.Timestamp()
        };
        try {
            GLOBAL.WaitHide();
            if (obj.error === 0) {
                obj.wmbases = [];
                const aib = this._BRIDGE.WMBASE._descentBases;
                try {
                    if (aib) {
                        for (const ai in aib) {
                            if (aib[ai]) {
                                const _o: any = {};
                                if (aib[ai].tribe) {
                                    _o.baseid = aib[ai].baseid;
                                    _o.level = aib[ai].level;
                                    _o.type = aib[ai].tribe.type;
                                    _o.description = aib[ai].tribe.description;
                                    _o.wm = 1;
                                    _o.friend = 0;
                                    _o.pic = aib[ai].tribe.profilepic;
                                    _o.basename = KEYS.Get("ai_tribe", { "v1": aib[ai].tribe.name });
                                    _o.destroyed = aib[ai].destroyed;
                                    obj.wmbases.push(_o);
                                }
                            }
                        }
                    }
                } catch (e: any) {
                    LOGGER.Log("err", "DescentLayer WM: " + e.message);
                }
                try {
                    const start = getTimer();
                    this.Create(obj);
                    this._getting = false;
                    this._lastUpdated = GLOBAL.Timestamp() + Math.floor(Math.random() * 5);
                    this.dispatchEvent(new Event(Event.COMPLETE));
                } catch (e: any) {
                    LOGGER.Log("err", "DescentLayer Create: " + e.message);
                }
            } else {
                LOGGER.Log("err", "MAPROOMPOPUP.Get: " + obj.error);
                GLOBAL.ErrorMessage("MAPROOMPOPUP.Get 1");
            }
            if (MiniMap.getInstance()) {
                MiniMap.getInstance().Update(this.basesForeign, this.basesWM);
            }
        } catch (e: any) {
            LOGGER.Log("err", "DescentLayer: " + e.message);
        }
    }

    public Create(data: any): void {
        let exists = false;
        if (this.basesForeign === null) {
            this.basesForeign = [];
        }
        if (this.basesWM === null) {
            this.basesWM = [];
        }
        if (this.basesAll === null) {
            this.basesAll = [];
        }
        if (this.baseData === null) {
            this.baseData = [];
        }
        if (Boolean(data) && Boolean(data.wmbases)) {
            for (let j = 0; j < data.wmbases.length; j++) {
                if (this.wmBasesUsed < this._wmbToDisplay) {
                    const base = data.wmbases[j];
                    exists = false;
                    for (const bd of this.baseData) {
                        if (Math.floor(bd.baseid.Get()) === base.baseid) {
                            exists = true;
                        }
                    }
                    if (!exists) {
                        const baseObj = new BaseObject(base);
                        const wmBase = new DescentMonsterBase();
                        wmBase.Setup(baseObj);
                        wmBase.useHandCursor = true;
                        wmBase.buttonMode = true;
                        wmBase.addEventListener("over", this.onBaseStateChange.bind(this));
                        wmBase.addEventListener("off", this.onBaseStateChange.bind(this));
                        wmBase.addEventListener("down", this.onBaseStateChange.bind(this));
                        if (this.setMapLinear(wmBase, base.level)) {
                            this.baseData.push(baseObj);
                            this.addChild(wmBase);
                            this.basesAll.push(wmBase);
                            this.basesWM.push(wmBase);
                            ++this.wmBasesUsed;
                            if (Boolean(wmBase.data) && wmBase.data.destroyed === 1) {
                                ++this.targetLvl;
                            } else if (this.targetLvl + 1 === wmBase.data.level.Get()) {
                                this.targetBase = wmBase;
                                this.PositionShroud(this.targetBase);
                            }
                        }
                    }
                }
            }
            for (const wm of this.basesWM) {
                if (wm === this.targetBase) {
                    wm.InitTargetListener();
                }
            }
        }
        if (this.basesForeign.length < this._playersLimit && data && Boolean(data.bases)) {
            let count: number;
            if (this.basesForeign.length + data.bases.length >= this._playersLimit) {
                count = this._playersLimit - this.basesForeign.length;
            } else {
                count = data.bases.length;
            }
            if (data && data.bases && data.bases.length > 0) {
                for (let j = 0; j < count; j++) {
                    const base = data.bases[j];
                    exists = false;
                    for (const bd of this.baseData) {
                        if (Math.floor(bd.baseid.Get()) === base.baseid) {
                            bd.Update(base);
                            bd.online = base.saved >= GLOBAL.Timestamp() - 62;
                            exists = true;
                            break;
                        }
                    }
                    if (!exists) {
                        const baseObj = new BaseObject(base);
                        const foreignBase = new ForeignBase();
                        foreignBase.Setup(baseObj);
                        foreignBase.useHandCursor = true;
                        foreignBase.buttonMode = true;
                        foreignBase.addEventListener("over", this.onBaseStateChange.bind(this));
                        foreignBase.addEventListener("off", this.onBaseStateChange.bind(this));
                        foreignBase.addEventListener("down", this.onBaseStateChange.bind(this));
                        this.baseData.push(baseObj);
                        if (this.setMapCoords(foreignBase)) {
                            this.addChild(foreignBase);
                            this.basesForeign.push(foreignBase);
                            this.basesAll.push(foreignBase);
                        }
                    }
                }
            }
            this.setChildIndex(this.player!, this.numChildren - 1);
            return;
        }
    }

    public PositionShroud(base: DescentMonsterBase): void {
        let found = false;
        for (const wm of this.basesWM) {
            if (Math.floor(wm.data.baseid.Get()) === base.data.baseid.Get()) {
                found = true;
            }
        }
        if (found) {
            DescentView.getInstance().shroud.x = -50;
            DescentView.getInstance().shroud.y = base.mapY;
        }
    }

    private onBaseStateChange(event: Event): void {
        const base = event.target as ForeignBase;
        if (this.lastOpened && this.lastOpened.state !== "off" && this.lastOpened !== base) {
            this.lastOpened.setState("off");
        }
        this.sortToTop(event);
        this.lastOpened = base;
        if (event.type === "down") {
            this.dispatchEvent(event.clone());
        }
    }

    private sortToTop(event: any): void {
        this.setChildIndex(event.target, this.numChildren - 1);
    }

    public setMapLinear(base: any, level: string): boolean {
        if (Number(level) > 13) {
            return false;
        }
        const valid = true;
        const posX = this.descentBaseProps[level].x;
        const posY = this.descentBaseProps[level].y;
        base.mapX = posX;
        base.mapY = posY;
        base.x = posX;
        base.y = posY;
        return valid;
    }

    public setMapCoords(base: any, forWM: boolean = false): boolean {
        let posX: number;
        let posY: number;
        let offset: number;
        const valid = true;
        if (forWM) {
            const typeMap: Record<string, number> = { "l": 0, "k": 1, "a": 2, "d": 3 };
            const typeIndex = typeMap[base.data.basename.charAt(0).toLowerCase()];
            posX = Obstruction.Reserved[typeIndex].x / this.divisor;
            posY = (Obstruction.Reserved[typeIndex].y - 130) / this.divisor;
            for (const wm of this.basesWM) {
                if (wm.mapX === posX && wm.mapY === posY) {
                    return false;
                }
            }
            base.mapX = posX;
            base.mapY = posY;
            offset = 0;
        } else {
            const maxPos = this.mapWidth / this.divisor - 2;
            posX = 1 + base.data.baseid.Get() % maxPos;
            posY = 1 + base.data.baseseed.Get() % maxPos;
            const coords = this.getNonConflictingCoords(new Point(posX, posY), new Rectangle(2, 2, maxPos - 2, maxPos - 2), 10);
            if (!coords) {
                return false;
            }
            base.mapX = coords.x;
            base.mapY = coords.y;
            offset = base.data.baseid.Get() % (this.divisor * 0.5);
        }
        base.x = 130 + this.divisor * base.mapX + offset;
        base.y = 130 + this.divisor * base.mapY + offset;
        return valid;
    }

    private getNonConflictingCoords(start: Point, bounds: Rectangle, range: number = 3): Point | null {
        if (!this.baseExistsAt(start.x, start.y) && !Obstruction.pointIsBlocked(start.x * this.divisor, start.y * this.divisor)) {
            return start;
        }
        const checked: Record<number, Record<number, number>> = {};
        for (let i = -range; i <= range; i++) {
            checked[i] = {};
            for (let j = -range; j <= range; j++) {
                checked[i][j] = 0;
            }
        }
        for (let dist = 1; dist <= range; dist++) {
            for (let i = -dist; i <= dist; i++) {
                for (let j = -dist; j <= dist; j++) {
                    if (checked[i][j] === 0 && start.x + i > bounds.x && start.x + i < bounds.x + bounds.width && start.y + j > bounds.y && start.y + j < bounds.y + bounds.height) {
                        if (!(this.baseExistsAt(start.x + i, start.y + j) || Obstruction.pointIsBlocked((start.x + i) * this.divisor, (start.y + j) * this.divisor))) {
                            return new Point(start.x + i, start.y + j);
                        }
                        checked[i][j] = 1;
                    }
                }
            }
        }
        return null;
    }

    public baseExistsAt(posX: number, posY: number): boolean {
        for (const base of this.basesAll) {
            if (base.mapX === posX && base.mapY === posY) {
                return true;
            }
        }
        return false;
    }
}

// ---------------- OLD IMPLEMENTATION ---------------- //
// The old implementation for 7 descent bases has been removed.
// See the original AS3 file for the commented-out old implementation.
