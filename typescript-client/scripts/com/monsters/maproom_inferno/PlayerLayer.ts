import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import getTimer from "openfl/utils/getTimer";

import { BaseObject } from "./model/BaseObject";
import { DescentMapRoom } from "./DescentMapRoom";
import { ForeignBase } from "./ForeignBase";
import { MapRoom } from "./MapRoom";
import { MiniMap } from "./MiniMap";
import { Obstruction } from "./Obstruction";
import { PlayerBase } from "./PlayerBase";
import { WildMonsterBase } from "./WildMonsterBase";

import { BASE } from "../../../BASE";
import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { MAPROOM_DESCENT } from "../../../MAPROOM_DESCENT";
import { MAPROOM_INFERNO } from "../../../MAPROOM_INFERNO";
import { URLLoaderApi } from "../../../URLLoaderApi";

/**
 * PlayerLayer - manages all player bases on the Inferno map room.
 */
export class PlayerLayer extends Sprite {
    private _lastUpdated: number = 0;
    private _getting: boolean = false;
    private _gets: number = 0;
    public basesForeign: Array<ForeignBase> = [];
    public basesWM: Array<WildMonsterBase> = [];
    public basesAll: Array<any> = [];
    public baseData: Array<BaseObject> = [];
    private divisor: number = 90;
    public lastOpened: ForeignBase | null = null;
    private _frameNumber: number = 0;
    private jitter: number = 2;
    public obstructions: Array<any> = [];
    public _playersLimit: number = 180;
    public mapWidth: number = 1200;
    public mapHeight: number = 1200;
    public player: PlayerBase | null = null;
    public _wmbToDisplay: number = 7;
    private wmBasesUsed: number = 0;
    private _BRIDGE: any = null;
    public faked: boolean = false;

    constructor() {
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
        this.player = new PlayerBase(this._BRIDGE.playerBaseID, this._BRIDGE.playerBaseSeed);
        this.player.addEventListener(MouseEvent.MOUSE_OVER, this.sortToTop.bind(this));
        this.basesAll.push(this.player);
        this.addChild(this.player);
        this.player.x = 740;
        this.player.y = 200;
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
    }

    public Tick(...args: any[]): void {
        if (this._lastUpdated > 0 && GLOBAL.Timestamp() - this._lastUpdated > 15 && !this._getting) {
            this.Get();
        }
        if (this._frameNumber % 40 === 0) {
            let msg = "";
            if (this._BRIDGE.GLOBAL._flags.attacking === 0) {
                msg = KEYS.Get("map_msg_attackingdisabled");
            }
            if (!msg) {
            }
        }
        ++this._frameNumber;
    }

    public Get(): void {
        const handleLoadSuccessful = (serverData: Record<string, any>): void => {
            try {
                GLOBAL.WaitHide();
                if (serverData.error === 0) {
                    serverData.wmbases = [];
                    const aib = this._BRIDGE.WMBASE._bases;
                    try {
                        if (aib) {
                            for (const ai in aib) {
                                if (aib[ai]) {
                                    if (aib[ai].destroyed === false) {
                                        const _o: Record<string, any> = {};
                                        if (aib[ai].tribe) {
                                            _o.baseid = aib[ai].baseid;
                                            _o.level = aib[ai].level;
                                            _o.type = aib[ai].tribe.type;
                                            _o.description = aib[ai].tribe.description;
                                            _o.wm = 1;
                                            _o.friend = 0;
                                            _o.pic = aib[ai].tribe.profilepic;
                                            _o.basename = aib[ai].tribe.name;
                                            if (_o.level >= BASE._baseLevel - 10) {
                                                serverData.wmbases.push(_o);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } catch (e: any) {
                        LOGGER.Log("err", "PlayerLayer WM: " + e.message);
                    }
                    try {
                        const start = getTimer();
                        this.Create(serverData);
                        this._getting = false;
                        this._lastUpdated = GLOBAL.Timestamp() + Math.floor(Math.random() * 5);
                        this.dispatchEvent(new Event(Event.COMPLETE));
                    } catch (e: any) {
                        LOGGER.Log("err", "PlayerLayer Create: " + e.message);
                    }
                } else {
                    LOGGER.Log("err", "MAPROOMPOPUP.Get: " + serverData.error);
                    GLOBAL.ErrorMessage("MAPROOMPOPUP.Get 1");
                }
                if (MiniMap.getInstance()) {
                    MiniMap.getInstance().Update(this.basesForeign, this.basesWM);
                }
            } catch (e: any) {
                LOGGER.Log("err", "PlayerLayer: " + e.message);
            }
        };
        const handleLoadError = (event: IOErrorEvent): void => {
            GLOBAL.WaitHide();
            LOGGER.Log("err", "MAPROOMPOPUP.Get HTTP");
            GLOBAL.ErrorMessage("MAPROOMPOPUP.Get 2");
        };
        this._getting = true;
        ++this._gets;
        if (this._gets > 12) {
        }
        const loadVars = [["baseid", 0], ["type", "inferno"]];
        const r = new URLLoaderApi();
        r.load(GLOBAL._apiURL + "bm/neighbours/get", loadVars, handleLoadSuccessful, handleLoadError);
    }

    public Create(serverData: Record<string, any>): void {
        let baseExists = false;
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
        if (Boolean(serverData) && Boolean(serverData.wmbases)) {
            for (let i = 0; i < serverData.wmbases.length; i++) {
                if (this.wmBasesUsed < this._wmbToDisplay) {
                    const rawData = serverData.wmbases[i];
                    baseExists = false;
                    for (const existingData of this.baseData) {
                        if (Number(existingData.baseid.Get()) === rawData.baseid) {
                            baseExists = true;
                        }
                    }
                    if (!baseExists) {
                        const baseObj = new BaseObject(rawData);
                        const wmBase = new WildMonsterBase();
                        wmBase.Setup(baseObj);
                        wmBase.useHandCursor = true;
                        wmBase.buttonMode = true;
                        wmBase.addEventListener("over", this.onBaseStateChange.bind(this));
                        wmBase.addEventListener("off", this.onBaseStateChange.bind(this));
                        wmBase.addEventListener("down", this.onBaseStateChange.bind(this));
                        if (this.setMapCoords(wmBase, true)) {
                            this.baseData.push(baseObj);
                            this.addChild(wmBase);
                            this.basesAll.push(wmBase);
                            this.basesWM.push(wmBase);
                            ++this.wmBasesUsed;
                        }
                    }
                }
            }
        }
        if (this.basesForeign.length < this._playersLimit && serverData && Boolean(serverData.bases)) {
            let limit = 0;
            if (this.basesForeign.length + serverData.bases.length >= this._playersLimit) {
                limit = this._playersLimit - this.basesForeign.length;
            } else {
                limit = serverData.bases.length;
            }
            if (serverData && serverData.bases && serverData.bases.length > 0) {
                for (let i = 0; i < limit; i++) {
                    const rawData = serverData.bases[i];
                    baseExists = false;
                    for (const existingData of this.baseData) {
                        if (existingData.baseid.Get() === rawData.baseid) {
                            existingData.Update(rawData);
                            existingData.online = rawData.saved >= GLOBAL.Timestamp() - 62;
                            baseExists = true;
                            break;
                        }
                    }
                    if (!baseExists) {
                        const baseObj = new BaseObject(rawData);
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

    public setMapCoords(base: any, isWM: boolean = false): boolean {
        let mapX = 0;
        let mapY = 0;
        let jitterValue = 0;
        let isValid = true;
        if (isWM) {
            const slotIndex = base.data.baseid.Get() % 10;
            mapX = Obstruction.Slots[slotIndex].x / this.divisor;
            mapY = (Obstruction.Slots[slotIndex].y - 130) / this.divisor;
            for (const wmBase of this.basesWM) {
                if (wmBase.mapX === mapX && wmBase.mapY === mapY) {
                    return false;
                }
            }
            base.mapX = mapX;
            base.mapY = mapY;
            jitterValue = 0;
        } else {
            const gridWidth = this.mapWidth / this.divisor - 2;
            const gridHeight = this.mapHeight / this.divisor - 2;
            mapX = 1 + base.data.baseid.Get() % gridWidth;
            mapY = 1 + base.data.baseseed.Get() % gridHeight;
            const coords = this.getNonConflictingCoords(new Point(mapX, mapY), new Rectangle(2, 2, gridWidth - 2, gridHeight - 2), 6);
            if (!coords) {
                return false;
            }
            base.mapX = coords.x;
            base.mapY = coords.y;
            jitterValue = base.data.baseid.Get() % (this.divisor * 0.5);
        }
        base.x = 30 + this.divisor * base.mapX + jitterValue;
        base.y = 30 + this.divisor * base.mapY + jitterValue;
        return isValid;
    }

    private getNonConflictingCoords(origin: Point, bounds: Rectangle, maxOffset: number = 3): Point | null {
        if (!this.baseExistsAt(origin.x, origin.y) && !Obstruction.pointIsBlocked(origin.x * this.divisor, origin.y * this.divisor)) {
            return origin;
        }
        const checked: Record<number, Record<number, number>> = {};
        for (let i = -maxOffset; i <= maxOffset; i++) {
            checked[i] = {};
            for (let j = -maxOffset; j <= maxOffset; j++) {
                checked[i][j] = 0;
            }
        }
        for (let offset = 1; offset <= maxOffset; offset++) {
            for (let i = -offset; i <= offset; i++) {
                for (let j = -offset; j <= offset; j++) {
                    if (checked[i][j] === 0 && origin.x + i > bounds.x && origin.x + i < bounds.x + bounds.width && origin.y + j > bounds.y && origin.y + j < bounds.y + bounds.height) {
                        if (!(this.baseExistsAt(origin.x + i, origin.y + j) || Obstruction.pointIsBlocked((origin.x + i) * this.divisor, (origin.y + j) * this.divisor))) {
                            return new Point(origin.x + i, origin.y + j);
                        }
                        checked[i][j] = 1;
                    }
                }
            }
        }
        return null;
    }

    public baseExistsAt(x: number, y: number): boolean {
        for (const base of this.basesAll) {
            if (base.mapX === x && base.mapY === y) {
                return true;
            }
        }
        return false;
    }
}
