import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { DisplayObject } from "openfl/display/DisplayObject";
import { MovieClip } from "openfl/display/MovieClip";
import { MouseEvent } from "openfl/events/MouseEvent";
import { Point } from "openfl/geom/Point";
import { getTimer } from "openfl/utils/getTimer";

import { SecNum } from "../../../cc/utils/SecNum";
import { AllyInfo } from "../alliances/AllyInfo";
import { IMapRoomCell } from "../maproom_manager/IMapRoomCell";
import { MapRoomCell_CLIP } from "./MapRoomCell_CLIP";
import { MapRoom } from "./MapRoom";

import { ALLIANCES } from "../../../ALLIANCES";
import { BUILDING5 } from "../../../BUILDING5";
import { CREATURES } from "../../../CREATURES";
import { GLOBAL } from "../../../GLOBAL";
import { JSON } from "../../../JSON";
import { LOGGER } from "../../../LOGGER";
import { LOGIN } from "../../../LOGIN";

/**
 * MapRoomCell - Represents a single cell in the map room grid.
 */
export class MapRoomCell extends MapRoomCell_CLIP implements IMapRoomCell {
    public X: number = 0;
    public Y: number = 0;
    public _updated: boolean = false;
    public _dataAge: number = 0;
    public _base: number = 0;
    public _baseID: number = 0;
    public _allianceID: number = 0;
    public _alliance: AllyInfo | null = null;
    public _height: number = 0;
    public _mine: number = 0;
    public _facebookID: number = 0;
    public _pic_square: string = "";
    public _userID: number = 0;
    public _online: number = 0;
    public _friend: number = 0;
    public _truce: number = 0;
    public _name: string = "";
    public _protected: number = 0;
    public _resources: any = null;
    public _hpResources: any = null;
    public _monsterData: any = null;
    public _flingerRange: SecNum | null = null;
    public _flingerLevel: SecNum | null = null;
    public _catapult: SecNum | null = null;
    public _level: number = 0;
    public _destroyed: number = 0;
    public _damaged: number = 0;
    public _water: boolean = false;
    public _monsters: any = null;
    public _ticks: number = 0;
    public _processed: boolean = false;
    public _dirty: boolean = false;
    public _locked: number = 0;
    public _hpMonsterData: any = null;
    public _hpMonsters: any = null;
    public _invitePendingID: number = 0;
    public _damage: number = 0;
    public _workerBusy: boolean = false;
    public _inRange: boolean = false;
    public _over: boolean = false;
    public _terrain: string = "";
    public _hasWarned: number = 0;
    public _value: number = 0;
    private _smokeBMD: BitmapData | null = null;
    private _smokeDO: DisplayObject | null = null;
    private _smokeRender: boolean = false;
    private _smokeParticles: Array<any> | null = null;
    private _frame: number = 0;
    public depth: number = 0;
    private inTest: boolean = false;
    private _inAllianceProps: any;
    private _soloProps: any;
    private _picURLs: any;
    private testAllianceIDs: Array<number>;

    constructor() {
        this._inAllianceProps = { "txtNameX": 0, "txtNameY": 1, "txtAllyX": 0, "txtAllyY": 11 };
        this._soloProps = { "txtNameX": 0, "txtNameY": 1, "txtAllyX": 0, "txtAllyY": 11 };
        this._picURLs = { "baseURL": "alliances/", "sizeL": "_large", "sizeM": "_medium", "sizeS": "_small", "sizeXS": "_xsmall", "ally": "A", "friendly": "F", "hostile": "H", "neutral": "N", "ext": ".png" };
        this.testAllianceIDs = [1, 2, 3, 102, 111];
        super();
        this.mc.mcHit.addEventListener(MouseEvent.MOUSE_OVER, this.Over.bind(this));
        this.mc.mcHit.addEventListener(MouseEvent.MOUSE_OUT, this.Out.bind(this));
        this.mc.mcHit.addEventListener(MouseEvent.MOUSE_UP, this.Click.bind(this));
        this.mc.mcPlayer.mouseEnabled = false;
        this.mc.mcPlayer.mouseChildren = false;
        this.mc.mcGlow.mouseEnabled = false;
        this.mc.mcGlow.mouseChildren = false;
        this.mc.mcGlow.gotoAndStop(1);
        this.mc.mcEdges.mouseEnabled = false;
        this.mc.mcEdges.mouseChildren = false;
        this.mc.mcPlayer.mcWorker.visible = false;
        this.mc.mcPlayer.mcInvite.visible = false;
        this.mc.mcPlayer.mcFlag.mouseEnabled = false;
        this.mc.mcPlayer.mcFlag.mouseChildren = false;
        this.mc.mcPlayer.mcFlag.gotoAndStop(1);
        this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop(1);
        this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop(1);
        this.mc.mcPlayer.mcFlag.txtAlliance.visible = false;
        this.mc.mcPlayer.mcFlag.txtAlliance.htmlText = "";
        this.mc.mcEdges.enabled = false;
        this.mc.mcEdges.visible = false;
        this.mc.mcPrompt.enabled = false;
        this.mc.mcPrompt.visible = false;
    }

    public set alliance(value: AllyInfo) { this._alliance = value; }
    public get allianceID(): number { return this._allianceID; }
    public get monsters(): any { return this._monsters; }
    public get monsterData(): any { return this._monsterData; }
    public get resources(): any { return this._resources; }
    public get hpMonsters(): any { return this._hpMonsters; }
    public get hpMonsterData(): any { return this._hpMonsterData; }
    public get hpResources(): any { return this._hpResources; }
    public get terrain(): string { return this._terrain; }
    public get flingerRange(): SecNum | null { return this._flingerRange; }
    public get baseID(): number { return this._baseID; }
    public get baseType(): number { return this._base; }
    public set baseType(value: number) { this._base = value; }
    public get cellX(): number { return this.X; }
    public set cellX(value: number) { this.X = value; }
    public get cellY(): number { return this.Y; }
    public set cellY(value: number) { this.Y = value; }
    public get cellHeight(): number { return this._height; }
    public get mine(): number { return this._mine; }
    public get online(): number { return this._online; }
    public get truce(): number { return this._truce; }
    public get isDestroyed(): boolean { return !!this._destroyed; }
    public set destroyed(value: number) { this._destroyed = value; }
    public get isLocked(): boolean { return this._locked !== 0 && this._locked !== LOGIN._playerID; }
    public get isProtected(): number { return this._protected; }
    public set isProtected(value: number) { this._protected = value; }
    public get isDirty(): boolean { return this._dirty; }
    public set isDirty(value: boolean) { this._dirty = value; }
    public get isMainBase(): boolean { return this._base === 2; }

    public Setup(serverData: any): void {
        this._dataAge = 10;
        this._updated = true;
        this._processed = false;
        this._base = serverData.b;
        if (serverData.bid) {
            if (this._baseID !== 0 && this._baseID === GLOBAL._homeBaseID) {
                MapRoom._homeCell = this;
            } else if (this.X === GLOBAL._mapHome.x && this.Y === GLOBAL._mapHome.y) {
                MapRoom._homeCell = this;
            }
            this._baseID = serverData.bid;
        }
        this._value = serverData.v;
        if (serverData.aid) {
            this._allianceID = serverData.aid;
        } else {
            this._allianceID = 0;
            this._alliance = null;
        }
        if (this._alliance) {
            this.mc.mcPlayer.mcFlag.visible = true;
            ALLIANCES.SetCellAlliance(this, true);
        } else if (Boolean(this._allianceID) && this._allianceID > 0) {
            ALLIANCES.SetCellAlliance(this, true);
            this.mc.mcPlayer.mcFlag.visible = false;
        }
        this.mc.mcPlayer.mcLevel.visible = false;
        this._height = serverData.i;
        this._water = this._height < 100;
        this._mine = serverData.mine;
        if (serverData.f) {
            this._flingerLevel = new SecNum(serverData.f);
            this._flingerRange = new SecNum(BUILDING5.getFlingerRange(serverData.f, this.isMainBase));
        } else {
            this._flingerRange = new SecNum(0);
            this._flingerLevel = new SecNum(0);
        }
        if (serverData.c) {
            this._catapult = new SecNum(serverData.c);
        } else {
            this._catapult = new SecNum(0);
        }
        this._userID = serverData.uid;
        this._facebookID = serverData.fbid;
        this._truce = serverData.t;
        this._name = serverData.n;
        this._friend = serverData.fr;
        this._online = serverData.on;
        this._protected = serverData.p;
        this._invitePendingID = serverData.pi || 0;
        if (serverData.r) {
            this._hpResources = { "r1": Math.floor(serverData.r.r1), "r2": Math.floor(serverData.r.r2), "r3": Math.floor(serverData.r.r3), "r4": Math.floor(serverData.r.r4), "r1max": Math.floor(serverData.r.r1max), "r2max": Math.floor(serverData.r.r2max), "r3max": Math.floor(serverData.r.r3max), "r4max": Math.floor(serverData.r.r4max) };
            this._resources = { "r1": new SecNum(Math.floor(serverData.r.r1)), "r2": new SecNum(Math.floor(serverData.r.r2)), "r3": new SecNum(Math.floor(serverData.r.r3)), "r4": new SecNum(Math.floor(serverData.r.r4)), "r1max": Math.floor(serverData.r.r1max), "r2max": Math.floor(serverData.r.r2max), "r3max": Math.floor(serverData.r.r3max), "r4max": Math.floor(serverData.r.r4max) };
        } else {
            this._hpResources = { "r1": 0, "r2": 0, "r3": 0, "r4": 0, "r1max": 500000, "r2max": 500000, "r3max": 500000, "r4max": 500000 };
            this._resources = { "r1": new SecNum(0), "r2": new SecNum(0), "r3": new SecNum(0), "r4": new SecNum(0), "r1max": 500000, "r2max": 500000, "r3max": 500000, "r4max": 500000 };
        }
        this._dirty = false;
        if (serverData.m && serverData.m.hcc != null && serverData.m.h != null && serverData.m.overdrivepower != null && serverData.m.housed != null) {
            this._hpMonsterData = serverData.m;
            if (!this._hpMonsterData.overdrivetime) this._hpMonsterData.overdrivetime = 0;
            if (!this._hpMonsterData.saved) this._hpMonsterData.saved = 0;
            if (!this._hpMonsterData.space) this._hpMonsterData.space = 0;
        } else {
            this._hpMonsterData = { "hcc": [], "h": [], "hstage": [], "hid": [], "overdrivepower": 1, "overdrivetime": 0, "saved": GLOBAL.Timestamp() - 5, "housed": {}, "space": 0 };
        }
        if (this._hpMonsterData) this.SecureMonsterData();
        this._monsters = {};
        if (this._monsterData) {
            this._monsters = this._monsterData.housed;
            this._monsterData.finishtime = this._hpMonsterData.finishtime;
        }
        if (this._hpMonsterData) this._hpMonsters = this._hpMonsterData.housed;
        this._level = serverData.l;
        this._destroyed = serverData.d || 0;
        this._locked = serverData.lo || 0;
        this._ticks = 0;
        this._damage = serverData.dm || 0;
        if (serverData.pic_square) this._pic_square = serverData.pic_square;
        if (serverData.im) this._pic_square = serverData.im;
        this.Update();
        const startTime = getTimer();
        if (this._monsterData) {
            const savedTime = Math.floor(this._monsterData.saved);
            for (let t = savedTime; t < GLOBAL.Timestamp(); t++) {
                if (this.Tick(t)) break;
            }
        }
        this._processed = true;
    }

    public Update(): void {
        if (this._height < 100) {
            if (this._height < 80) { this.mc.gotoAndStop("water1"); }
            else if (this._height < 90) { this.mc.gotoAndStop("water2"); }
            else { this.mc.gotoAndStop("water3"); }
            this.mc.y = Math.floor(100 - this._height) + 18;
            this.mc.mcWater.y = -Math.floor(100 - this._height);
        } else {
            if (this._height < 105) { this.mc.gotoAndStop("sand1"); this._terrain = "sand"; }
            else if (this._height < 110) { this.mc.gotoAndStop("sand2"); this._terrain = "sand"; }
            else if (this._height < 120) { this.mc.gotoAndStop("land1"); this._terrain = "grass"; }
            else if (this._height < 140) { this.mc.gotoAndStop("land2"); this._terrain = "grass"; }
            else if (this._height < 160) { this.mc.gotoAndStop("land3"); this._terrain = "grass"; }
            else if (this._height < 170) { this.mc.gotoAndStop("land4"); this._terrain = "grass"; }
            else if (this._height < 175) { this.mc.gotoAndStop("land5"); this._terrain = "rock"; }
            else { this.mc.gotoAndStop("land6"); this._terrain = "rock"; }
            this.mc.y = -Math.floor((this._height - 100) * 0.6) + 18;
        }
        if (this._base > 0) {
            this.mc.mcPlayer.visible = true;
            this.mc.mcPlayer.mcFlag2.visible = false;
            this.mc.mcPlayer.mcLevel.visible = false;
            this.SetupAlliance();
            if (this._base === 1) {
                this.mc.mcPlayer.gotoAndStop("tribe-" + this._name);
                this.mc.mcPlayer.mcLevel.gotoAndStop(1);
                this.mc.mcPlayer.mcLevel.lv_txt.htmlText = "<b>" + this._level + "</b>";
                if (Boolean(this._level) && this._level > 0) this.mc.mcPlayer.mcLevel.visible = true;
                this.mc.mcPlayer.mcFlag.txt.htmlText = "" + this._name;
                this.mc.mcPlayer.mcFlag.txt.y = this._inAllianceProps.txtNameY;
                this.mc.mcPlayer.mcFlag.txtAlliance.htmlText = "";
                this.mc.mcPlayer.mcFlag.txtAlliance.y = this._inAllianceProps.txtAllyY;
                this.mc.mcPlayer.mcFlag.txtAlliance.visible = false;
            } else {
                this.mc.mcPlayer.mcLevel.gotoAndStop(2);
                this.mc.mcPlayer.mcLevel.lv_txt.htmlText = "<b>" + this._level + "</b>";
                if (Boolean(this._level) && this._level > 0) this.mc.mcPlayer.mcLevel.visible = true;
                if (this._protected) {
                    if (this._base === 2) this.mc.mcPlayer.gotoAndStop("main-protected");
                    if (this._base === 3) this.mc.mcPlayer.gotoAndStop("outpost-protected");
                } else if (this._base === 2) {
                    if (this._destroyed) { this.mc.mcPlayer.gotoAndStop("main-destroyed"); }
                    else if (this._damage) { this.mc.mcPlayer.gotoAndStop("main-damaged"); }
                    else { this.mc.mcPlayer.gotoAndStop("main"); }
                } else if (this._base === 3) {
                    if (this._destroyed) { this.mc.mcPlayer.gotoAndStop("outpost-destroyed"); }
                    else if (this._damage) { this.mc.mcPlayer.gotoAndStop("outpost-damaged"); }
                    else { this.mc.mcPlayer.gotoAndStop("outpost"); }
                }
                this.mc.mcPlayer.mcFlag.txt.htmlText = "<b>" + this._name + "</b> ";
                if (this._alliance) {
                    this.mc.mcPlayer.mcFlag.txt.y = this._inAllianceProps.txtNameY;
                    this.mc.mcPlayer.mcFlag.txtAlliance.visible = false;
                    this.mc.mcPlayer.mcFlag.txtAlliance.y = this._inAllianceProps.txtAllyY;
                    this.mc.mcPlayer.mcFlag.txtAlliance.htmlText = "";
                } else {
                    this.mc.mcPlayer.mcFlag.txt.y = this._soloProps.txtNameY;
                    this.mc.mcPlayer.mcFlag.txtAlliance.visible = false;
                    this.mc.mcPlayer.mcFlag.txtAlliance.y = this._soloProps.txtAllyY;
                    this.mc.mcPlayer.mcFlag.txtAlliance.htmlText = "";
                }
                this.mc.mcPlayer.mcTruce.visible = this._truce > GLOBAL.Timestamp();
            }
        } else {
            this.mc.mcPlayer.visible = false;
        }
        if (this._damage) {
            this.mc.mcPlayer.mcFlag2.visible = false;
            this.mc.mcPlayer.mcFlag.nameBar.mcBar.width = 100 / 100 * Math.max(0, 100 - this._damage);
            if (this._base === 1) {
                this.mc.mcPlayer.mcFlag.txt.htmlText = "" + this._name + "";
                this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop(this._destroyed ? "destroyed" : "wmyard");
                this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop(this._destroyed ? "destroyed" : "wmyard");
            }
        } else {
            this.mc.mcPlayer.mcFlag.nameBar.mcBar.width = 100;
        }
        if (this._inRange) {
            if (this._over) this.mc.mcGlow.gotoAndStop(4);
            else this.mc.mcGlow.gotoAndStop(3);
        } else if (this._over) {
            this.mc.mcGlow.gotoAndStop(2);
        } else {
            this.mc.mcGlow.gotoAndStop(1);
        }
        if (this._monsterData) {
            if (Boolean(this._monsterData.finishtime) && this._monsterData.finishtime > GLOBAL.Timestamp()) this._workerBusy = true;
            else this._workerBusy = false;
        }
        if (!this._workerBusy && this._base === 3 && Boolean(this._mine)) this.mc.mcPlayer.mcWorker.visible = true;
        else this.mc.mcPlayer.mcWorker.visible = false;
        if (this._invitePendingID && this._base === 3 && Boolean(this._mine)) this.mc.mcPlayer.mcInvite.visible = true;
        else this.mc.mcPlayer.mcInvite.visible = false;
        if (MapRoom._viewOnly && this._baseID === MapRoom._inviteBaseID) {
            this.mc.mcPrompt.bYes.SetupKey("btn_yes");
            this.mc.mcPrompt.bNo.SetupKey("btn_no");
            this.mc.mcPrompt.bYes.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => { MapRoom.PreAcceptInvitation(MapRoom._mc as MovieClip); });
            this.mc.mcPrompt.bNo.addEventListener(MouseEvent.MOUSE_UP, MapRoom.RejectInvitation);
        }
    }

    public Tick(timestamp: number = 0): boolean {
        if (MapRoom._viewOnly) {
            this.mc.mcPlayer.mcWorker.visible = false;
            if (this._baseID === MapRoom._inviteBaseID) {
                if (this._over) this.mc.mcGlow.gotoAndStop(5);
                else this.mc.mcGlow.gotoAndStop(6);
                this.mc.mcPrompt.visible = true;
                this.mc.mcPrompt.enabled = true;
                this.mc.mcPrompt.mouseChildren = true;
            } else {
                this.mc.mcPrompt.visible = false;
                this.mc.mcPrompt.enabled = false;
                this.mc.mcPrompt.mouseChildren = false;
            }
            return true;
        }
        if (this._alliance) this._alliance.Relations(ALLIANCES._allianceID);
        --this._dataAge;
        if (this._inRange) {
            if (this._over) this.mc.mcGlow.gotoAndStop(4);
            else this.mc.mcGlow.gotoAndStop(3);
        } else if (this._over) {
            this.mc.mcGlow.gotoAndStop(2);
        } else {
            this.mc.mcGlow.gotoAndStop(1);
        }
        let complete = true;
        if (!this._mine) { this.mc.mcPlayer.mcWorker.visible = false; return true; }
        if (!this._updated) return true;
        if (Boolean(this._monsterData) && Boolean(this._resources)) {
            if (Boolean(this._monsterData.finishtime) && this._monsterData.finishtime > GLOBAL.Timestamp()) this._workerBusy = true;
            else this._workerBusy = false;
            if (!this._workerBusy && this._base === 3 && Boolean(this._mine)) this.mc.mcPlayer.mcWorker.visible = true;
            else this.mc.mcPlayer.mcWorker.visible = false;
            this._ticks += 1;
            if (timestamp) { this._monsterData.saved = timestamp; this._hpMonsterData.saved = timestamp; }
            else { this._monsterData.saved = GLOBAL.Timestamp(); this._hpMonsterData.saved = GLOBAL.Timestamp(); }
            if (this._monsterData.hcount === 0) return true;
            if (this._monsterData.overdrivetime.Get() > 0) { this._monsterData.overdrivetime.Add(-1); --this._hpMonsterData.overdrivetime; }
            let usedSpace = 0;
            for (const creatureType in this._monsterData.housed) {
                if (this._monsterData.housed[creatureType].Get() > 0) {
                    usedSpace += this._monsterData.housed[creatureType].Get() * CREATURES.GetProperty(creatureType, "cStorage");
                } else {
                    delete this._monsterData.housed[creatureType];
                    delete this._hpMonsterData.housed[creatureType];
                }
            }
            for (let i = 0; i < this._monsterData.hcount; i++) {
                const h = this._monsterData.h[i];
                const hpH = this._hpMonsterData.h[i];
                if (Boolean(this._monsterData.h[i]) && this._monsterData.h[i].length > 0) {
                    if (this._monsterData.hstage[i].Get() === 1) {
                        if (this._monsterData.overdrivetime.Get() > 0 && this._monsterData.overdrivepower.Get() > 0) {
                            this._monsterData.h[i][1].Add(-this._monsterData.overdrivepower.Get());
                            this._hpMonsterData.h[i][1] -= this._hpMonsterData.overdrivepower;
                            complete = false;
                        } else {
                            this._monsterData.h[i][1].Add(-1);
                            this._hpMonsterData.h[i][1] = this._monsterData.h[i][1].Get();
                            complete = false;
                        }
                    }
                    if (h[0] === "") {
                        if (h.length > 2) {
                            const queue = this._monsterData.h[i][2];
                            const hpQueue = this._hpMonsterData.h[i][2];
                            if (queue.length > 0) {
                                const creatureType = String(queue[0][0]);
                                this._monsterData.h[i][2][0][1].Add(-1);
                                this._hpMonsterData.h[i][2][0][1] -= 1;
                                if (this._monsterData.h[i][2][0][1].Get() === 0) {
                                    this._monsterData.h[i][2].splice(0, 1);
                                    this._hpMonsterData.h[i][2].splice(0, 1);
                                }
                                this._monsterData.h[i] = [creatureType, new SecNum(CREATURES.GetProperty(creatureType, "cTime")), queue];
                                this._hpMonsterData.h[i] = [creatureType, CREATURES.GetProperty(creatureType, "cTime"), hpQueue];
                                this._monsterData.hstage[i].Set(1);
                                this._hpMonsterData.hstage[i] = 1;
                                complete = false;
                            } else {
                                this._monsterData.h[i] = [];
                                this._hpMonsterData.h[i] = [];
                                this._monsterData.hstage[i].Set(0);
                                this._hpMonsterData.hstage[i] = 0;
                            }
                        } else {
                            this._monsterData.h[i] = [];
                            this._hpMonsterData.h[i] = [];
                            this._monsterData.hstage[i].Set(0);
                            this._hpMonsterData.hstage[i] = 0;
                        }
                    } else if (h[1].Get() <= 0 && (this._monsterData.hstage[i].Get() === 1 || this._monsterData.hstage[i].Get() === 2) && CREATURES.GetProperty(h[0], "cStorage") <= this._monsterData.space.Get() - usedSpace) {
                        if (this._monsters[h[0]]) { this._monsters[h[0]].Add(1); this._hpMonsters[h[0]] += 1; complete = false; }
                        else { this._monsters[h[0]] = new SecNum(1); this._hpMonsters[h[0]] = 1; complete = false; }
                        usedSpace += CREATURES.GetProperty(h[0], "cStorage");
                        this.Indicate();
                        if (h.length > 2) {
                            const queue = h[2];
                            const hpQueue = hpH[2];
                            if (queue.length > 0) {
                                const creatureType = String(queue[0][0]);
                                queue[0][1].Add(-1);
                                hpQueue[0][1] -= 1;
                                this._monsterData.h[i] = [creatureType, new SecNum(CREATURES.GetProperty(creatureType, "cTime")), queue];
                                this._hpMonsterData.h[i] = [creatureType, CREATURES.GetProperty(creatureType, "cTime"), hpQueue];
                                if (queue[0][1].Get() === 0) { queue.splice(0, 1); hpQueue.splice(0, 1); }
                                this._monsterData.hstage[i].Set(1);
                                this._hpMonsterData.hstage[i] = 1;
                                complete = false;
                            } else {
                                this._monsterData.h[i] = [];
                                this._hpMonsterData.h[i] = [];
                                this._monsterData.hstage[i].Set(0);
                                this._hpMonsterData.hstage[i] = 0;
                            }
                        } else {
                            this._monsterData.h[i] = [];
                            this._hpMonsterData.h[i] = [];
                            this._monsterData.hstage[i].Set(0);
                            this._hpMonsterData.hstage[i] = 0;
                        }
                    } else if (h[1].Get() <= 0 && (this._monsterData.hstage[i].Get() === 1 || this._monsterData.hstage[i].Get() === 2) && CREATURES.GetProperty(h[0], "cStorage") > this._monsterData.space.Get() - usedSpace) {
                        this._monsterData.hstage[i].Set(2);
                        this._hpMonsterData.hstage[i] = 2;
                    }
                } else if (Boolean(this._monsterData.hcc) && this._monsterData.hcc.length > 0) {
                    this._monsterData.h[i] = [this._monsterData.hcc[0][0], new SecNum(CREATURES.GetProperty(this._monsterData.hcc[0][0], "cTime"))];
                    this._monsterData.hcc[0][1].Add(-1);
                    this._hpMonsterData.h[i] = [this._hpMonsterData.hcc[0][0], CREATURES.GetProperty(this._hpMonsterData.hcc[0][0], "cTime")];
                    this._hpMonsterData.hcc[0][1] -= 1;
                    if (this._monsterData.hcc[0][1].Get() <= 0) { (this._monsterData.hcc as Array<any>).shift(); (this._hpMonsterData.hcc as Array<any>).shift(); }
                    this._monsterData.hstage[i].Set(1);
                    this._hpMonsterData.hstage[i] = 1;
                    complete = false;
                }
            }
            if (complete) {
                if (this._monsterData) { this._monsterData.saved = GLOBAL.Timestamp(); this._hpMonsterData.saved = GLOBAL.Timestamp(); }
            }
            return complete;
        }
        return true;
    }

    private Over(event: MouseEvent): void {
        this._over = true;
        if (MapRoom._viewOnly && this._baseID === MapRoom._inviteBaseID) this.mc.mcGlow.gotoAndStop(5);
        else if (this._inRange) this.mc.mcGlow.gotoAndStop(4);
        else this.mc.mcGlow.gotoAndStop(2);
        MapRoom._mc.ShowInfo(this);
    }

    private Out(event: MouseEvent): void {
        this._over = false;
        if (MapRoom._viewOnly && this._baseID === MapRoom._inviteBaseID) this.mc.mcGlow.gotoAndStop(6);
        else if (this._inRange) this.mc.mcGlow.gotoAndStop(3);
        else this.mc.mcGlow.gotoAndStop(1);
    }

    public Cleanup(): void {
        this.mc.mcHit.removeEventListener(MouseEvent.MOUSE_OVER, this.Over.bind(this));
        this.mc.mcHit.removeEventListener(MouseEvent.MOUSE_OUT, this.Out.bind(this));
        this.mc.mcHit.removeEventListener(MouseEvent.MOUSE_UP, this.Click.bind(this));
        this._allianceID = 0;
        this._alliance = null;
    }

    private SecureMonsterData(): void {
        this._monsterData = {};
        this._monsterData.space = new SecNum(this._hpMonsterData.space);
        this._hpMonsterData.overdrivepower = Math.floor(this._hpMonsterData.overdrivepower);
        this._monsterData.overdrivepower = new SecNum(this._hpMonsterData.overdrivepower);
        this._hpMonsterData.overdrivetime = Math.floor(this._hpMonsterData.overdrivetime);
        this._monsterData.overdrivetime = new SecNum(this._hpMonsterData.overdrivetime);
        this._monsterData.saved = this._hpMonsterData.saved;
        this._monsterData.housed = {};
        for (const key in this._hpMonsterData.housed) {
            if (this._hpMonsterData.housed[key]) {
                if (this._hpMonsterData.housed[key] <= 0) { delete this._hpMonsterData.housed[key]; }
                else { this._hpMonsterData.housed[key] = Math.floor(this._hpMonsterData.housed[key]); this._monsterData.housed[key] = new SecNum(this._hpMonsterData.housed[key]); }
            }
        }
        this._monsterData.hcount = this._hpMonsterData.hcount;
        this._monsterData.h = [];
        this._monsterData.hstage = [];
        if (this._hpMonsterData.hstage === null) this._hpMonsterData.hstage = [];
        for (let i = 0; i < this._monsterData.hcount; i++) {
            this._monsterData.h[i] = [];
            if (Boolean(this._hpMonsterData.hstage) && this._hpMonsterData.hstage.length > i) { this._monsterData.hstage[i] = new SecNum(this._hpMonsterData.hstage[i]); }
            else { this._monsterData.hstage[i] = new SecNum(0); this._hpMonsterData.hstage[i] = 0; }
            if (Boolean(this._hpMonsterData.h) && Boolean(this._hpMonsterData.h[i]) && this._hpMonsterData.h[i].length > 0) {
                this._monsterData.h[i][0] = this._hpMonsterData.h[i][0];
                this._monsterData.h[i][1] = new SecNum(this._hpMonsterData.h[i][1]);
                if (this._hpMonsterData.h[i].length > 2) {
                    this._monsterData.h[i][2] = [];
                    const len = this._hpMonsterData.h[i][2].length;
                    for (let j = 0; j < len; j++) {
                        this._monsterData.h[i][2][j] = [];
                        this._monsterData.h[i][2][j][0] = this._hpMonsterData.h[i][2][j][0];
                        this._hpMonsterData.h[i][2][j][1] = Math.floor(this._hpMonsterData.h[i][2][j][1]);
                        this._monsterData.h[i][2][j][1] = new SecNum(this._hpMonsterData.h[i][2][j][1]);
                    }
                }
            }
        }
        this._monsterData.hcc = [];
        const hccLen = this._hpMonsterData.hcc.length;
        for (let i = 0; i < hccLen; i++) {
            if (Boolean(this._hpMonsterData.hcc) && Boolean(this._hpMonsterData.hcc[i]) && this._hpMonsterData.hcc[i].length >= 2) {
                this._hpMonsterData.hcc[i][1] = Math.floor(this._hpMonsterData.hcc[i][1]);
                this._monsterData.hcc[i] = [this._hpMonsterData.hcc[i][0], new SecNum(this._hpMonsterData.hcc[i][1])];
            }
        }
    }

    private Click(event: MouseEvent): void {
        if (Boolean(MapRoom._mc) && MapRoom._mc._dragged) return;
        if (MapRoom._inviteBaseID === this._baseID) return;
        MapRoom._currentPosition = new Point(this.X, this.Y);
        if (GLOBAL._local) {
            let debug = "MapRoomCell.Click - X " + this.X + " Y " + this.Y + " H " + this._height + " B " + this._base + " ID " + this._baseID + " UID " + this._userID + " FBID " + this._facebookID + " Mine " + this._mine + " Name " + this._name + " d " + this._destroyed + " dm " + this._damage + " p " + this._protected + " fr " + this._friend + " busy " + this._workerBusy;
            if (this._flingerRange) debug += " f " + this._flingerRange.Get();
            if (this._hpMonsterData) debug += " monsterdata " + JSON.encode(this._hpMonsterData);
            if (this._hpResources) debug += " resources " + JSON.encode(this._hpResources);
        }
        MapRoom.TransferMonstersB(this);
        if (MapRoom._viewOnly && this._base > 0) { MapRoom._mc.ShowInfoViewOnly(this); }
        else if (this._base > 0 && !MapRoom._monsterTransferInProgress) {
            if (this._mine) { MapRoom._mc.ShowInfoMine(this); }
            else { MapRoom._mc.ShowInfoEnemy(this); }
        }
    }

    public Check(): boolean {
        if (!this._updated) return true;
        if (!this._processed) return true;
        if (!this._mine) return true;
        if (!this._monsterData || !this._hpMonsterData) return true;
        let valid = true;
        const logType = "err";
        if (this._monsterData.overdrivepower.Get() !== this._hpMonsterData.overdrivepower) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") overdrive power " + this._monsterData.overdrivepower.Get() + " " + this._hpMonsterData.overdrivepower); valid = false; }
        if (this._monsterData.overdrivetime.Get() !== this._hpMonsterData.overdrivetime) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") overdrive time " + this._monsterData.overdrivetime.Get() + " " + this._hpMonsterData.overdrivetime); valid = false; }
        for (const key in this._hpMonsterData.housed) {
            if (Boolean(this._monsterData.housed[key]) && this._monsterData.housed[key].Get() !== this._hpMonsterData.housed[key]) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") housed " + key + " " + this._monsterData.housed[key] + " " + this._hpMonsterData.housed[key]); valid = false; }
        }
        for (let i = 0; i < this._monsterData.hcount; i++) {
            if (this._monsterData.h[i].length !== this._hpMonsterData.h[i].length) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") hatchery array length mismatch " + this._monsterData.h[i].length + " " + this._hpMonsterData.h[i].length); valid = false; }
            else if (this._monsterData.h[i].length >= 2) {
                if (this._monsterData.h[i][1].Get() !== this._hpMonsterData.h[i][1]) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") num monsters producing (now) " + this._monsterData.h[i][1].Get() + " " + this._hpMonsterData.h[i][1]); valid = false; }
                if (this._monsterData.h[i].length > 2) {
                    if (this._monsterData.h[i][2].length !== this._hpMonsterData.h[i][2].length) valid = false;
                    const len = this._monsterData.h[i][2].length;
                    for (let j = 0; j < len; j++) {
                        if (this._monsterData.h[i][2][j][1].Get() !== this._hpMonsterData.h[i][2][j][1]) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") num monsters producing (now) " + this._monsterData.h[i][2][j][1].Get() + " " + this._hpMonsterData.h[i][2][j][1]); valid = false; }
                    }
                }
            }
            if (this._monsterData.hstage[i].Get() !== this._hpMonsterData.hstage[i]) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") production stage mismatch"); }
        }
        const hccLen = this._monsterData.hcc.length;
        if (hccLen !== this._hpMonsterData.hcc.length) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") HCC queue length mismatch " + hccLen + " " + this._hpMonsterData.hcc.length); valid = false; }
        else { for (let i = 0; i < hccLen; i++) { if (this._monsterData.hcc[i][1].Get() !== this._hpMonsterData.hcc[i][1]) { LOGGER.Log(logType, "MapRoomCell.Check (" + this.X + "," + this.Y + ") HCC queue size " + this._monsterData.hcc[i][1].Get() + " " + this._hpMonsterData.hcc[i][1]); valid = false; } } }
        return valid;
    }

    private Indicate(): void { }

    private SmokeAdd(): void {
        this.SmokeRemove();
        const clip = new MovieClip();
        clip.addChild(new Bitmap(MapRoom._smokeBMD));
        clip.x = -10;
        clip.y = -90;
        clip.mouseEnabled = false;
        clip.mouseChildren = false;
        this._smokeDO = this.mc.mcPlayer.addChild(clip);
        this.mc.mcPlayer.mouseChildren = false;
    }

    private SmokeRemove(): void {
        if (Boolean(this._smokeDO) && Boolean(this._smokeDO!.parent)) { this._smokeDO!.parent.removeChild(this._smokeDO!); }
    }

    private SetupAlliance(): void {
        this.mc.mcPlayer.mcFlag.visible = false;
        this.mc.mcPlayer.mcFlag.pic.visible = false;
        this.mc.mcPlayer.mcFlag.gotoAndStop("noAlliance");
        this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("none");
        this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("none");
        this.mc.mcPlayer.mcFlag.pic.visible = false;
        if (this._allianceID) {
            this.mc.mcPlayer.mcFlag.gotoAndStop("inAllianceNoPic");
            let numChildren = this.mc.mcPlayer.mcFlag.pic.mcImage.numChildren;
            while (numChildren--) { this.mc.mcPlayer.mcFlag.pic.mcImage.removeChildAt(numChildren); }
            if (this._alliance) {
                this.mc.mcPlayer.mcFlag.visible = true;
                if (Boolean(this._alliance.relationship) || this._alliance.relationship === 0) {
                    switch (this._alliance.relationship) {
                        case -1: this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("hostile"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("hostile"); break;
                        case 1: this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("friendly"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("friendly"); break;
                        case 4: this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("ally"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("ally"); break;
                        case 5: this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("leader"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("leader"); break;
                        default: this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("neutral"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("neutral");
                    }
                }
            }
        } else {
            this.mc.mcPlayer.mcFlag.gotoAndStop("noAlliance");
            this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("none");
            this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("none");
            this.mc.mcPlayer.mcFlag.pic.visible = false;
            this.mc.mcPlayer.mcFlag.visible = true;
        }
        if (this._base > 0) {
            this.mc.mcPlayer.mcFlag.gotoAndStop("noAlliance");
            if (this._base === 1) {
                this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("wmyard");
                this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("wmyard");
                this.mc.mcPlayer.mcFlag.pic.visible = false;
            } else if (this._base === 2 || this._base === 3) {
                if (this._mine) { this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("player"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("player"); }
                else if (!this._allianceID) { this.mc.mcPlayer.mcFlag.nameBar.mcBar.gotoAndStop("none"); this.mc.mcPlayer.mcFlag.nameBar.mcBG.gotoAndStop("none"); }
            }
            this.mc.mcPlayer.mcFlag.visible = true;
        }
    }
}
