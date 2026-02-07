import IOErrorEvent from 'openfl/events/IOErrorEvent';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { ALLIANCES } from './com/monsters/alliances/ALLIANCES';
import { BFOUNDATION } from './BFOUNDATION';
import { ACHIEVEMENTS } from './ACHIEVEMENTS';
import { MAPROOM } from './MAPROOM';
import { PLEASEWAIT } from './PLEASEWAIT';

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("./com/monsters/events/BuildingEvent").BuildingEvent; }
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSTORE(): any { return require("./STORE").STORE; }
function getURLLoaderApi(): any { return require("./URLLoaderApi").URLLoaderApi; }


/**
 * BUILDING11 - Map Room
 * Extends BFOUNDATION for the world map room building
 */
export class BUILDING11 extends BFOUNDATION {
    public static readonly CHANGED_TO_MR2: string = "changedToMR2";
    private callPending: boolean = false;

    constructor() {
        super();
        this._type = 11;
        this._footprint = [new Rectangle(0, 0, 90, 90)];
        this._gridCost = [[new Rectangle(0, 0, 90, 90), 10], [new Rectangle(10, 10, 70, 70), 200]];
        this.SetProps();
    }

    public override Tick(seconds: number): void {
        if (this._countdownBuild.Get() > 0 || this.health < this.maxHealth * 0.5) {
            this._canFunction = false;
        } else {
            this._canFunction = true;
            MAPROOM.initMaproomSetup = true;
        }
        if (getMapRoomManager().instance.isInMapRoom3) {
            getGLOBAL().StatSet("mrl", 3);
        } else {
            if (this._lvl.Get() < 2 && getGLOBAL().StatGet("mrl") === 2) {
                getGLOBAL().StatSet("mrl", 2);
            }
            if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD && this._lvl.Get() === 1 && 
                getGLOBAL().StatGet("mrl") !== 2 && getBASE()._saveCounterA === getBASE()._saveCounterB && !getBASE()._saving) {
                this.NewWorld();
            }
        }
        if (!getGLOBAL()._catchup && getGLOBAL()._render && this._countdownUpgrade.Get() && 
            this._countdownUpgrade.Get() < 60 * 60 * 24 * 2) {
            this.PopupUpgrade(2);
        }
        super.Tick(seconds);
    }

    private NewWorld(): void {
        if (!getMapRoomManager().instance.isInMapRoom3 && getGLOBAL().mode === getGLOBAL()._loadmode && getGLOBAL()._flags.maproom2) {
            ACHIEVEMENTS.Check("map2", 1);
            if (this.callPending) return;
            this.callPending = true;
            const data: any[] = [["version", 2]];
            new (getURLLoaderApi())().load(getGLOBAL()._mapURL + "setmapversion", data, this.NewWorldSuccess.bind(this), this.NewWorldFail.bind(this));
        }
    }

    private NewWorldSuccess(serverData: any): void {
        if (serverData.error === 0) {
            if (getGLOBAL().mode !== getGLOBAL()._loadmode) return;
            getGLOBAL().StatSet(BUILDING11.CHANGED_TO_MR2, 1);
            getGLOBAL().StatSet("mrl", 2, true);
            getMapRoomManager().instance.mapRoomVersion = getMapRoomManager().MAP_ROOM_VERSION_2;
            getGLOBAL()._baseURL = serverData.baseurl;
            getGLOBAL()._homeBaseID = serverData.homebaseid;
            getBASE()._loadedBaseID = serverData.homebaseid;
            getBASE()._baseID = 0;
            getBASE()._loadedFriendlyBaseID = getGLOBAL()._homeBaseID;
            getMapRoomManager().instance.BookmarksClear();
            if (serverData.basesaveid !== 1) {
                getBASE()._lastSaveID = serverData.basesaveid;
            }
            if (serverData.homebase?.length === 2 && serverData.homebase[0] > -1 && serverData.homebase[1] > -1) {
                if (serverData.worldsize) {
                    getMapRoomManager().instance.mapWidth = serverData.worldsize[0];
                    getMapRoomManager().instance.mapHeight = serverData.worldsize[1];
                }
                getGLOBAL()._mapHome = new Point(serverData.homebase[0], serverData.homebase[1]);
                if (serverData.outposts) {
                    getGLOBAL()._mapOutpost = [];
                    for (const outpost of serverData.outposts) {
                        if (outpost.length === 2) {
                            getGLOBAL()._mapOutpost.push(new Point(outpost[0], outpost[1]));
                        }
                    }
                }
                getGLOBAL().eventDispatcher.dispatchEvent(new (getBuildingEvent())(getBuildingEvent().ENTER_MR2, this));
            } else {
                getLOGGER().Log("err", "BUILDING11.NewWorldSuccess Invalid home base coordinate.");
            }
        } else {
            this.callPending = true;
            getGLOBAL()._flags.discordOldEnough = false;
        }
        this.callPending = false;
        PLEASEWAIT.Hide();
    }

    private NewWorldFail(event: IOErrorEvent): void {
        this.callPending = false;
        getLOGGER().Log("err", "BUILDING11.NewWorld HTTP");
        PLEASEWAIT.Hide();
    }

    public override PlaceB(): void {
        super.PlaceB();
        getGLOBAL()._bMap = this;
    }

    public override Constructed(): void {
        getGLOBAL()._bMap = this;
        super.Constructed();
    }

    public override UpgradeB(): void {
        super.UpgradeB();
        this.PopupUpgrade(1);
    }

    public PopupUpgrade(n: number): void {
        if (getGLOBAL().StatGet("mrp") < n && !getSTORE()._open) {
            getGLOBAL().StatSet("mrp", n);
            getGLOBAL()._selectedBuilding = getGLOBAL()._bMap;
        }
    }

    public override Upgraded(): void {
        if (!getMapRoomManager().instance.isInMapRoom3) {
            PLEASEWAIT.Show(getKEYS().Get("wait_newworld"));
        }
        super.Upgraded();
    }

    public override Recycle(): void {
        if (getMapRoomManager().instance.isInMapRoom2) {
            if (ALLIANCES._myAlliance !== null) {
                getGLOBAL().Message(getKEYS().Get("map_alliance_recycle", { v1: ALLIANCES._myAlliance.name }));
                return;
            }
            getGLOBAL()._mapOutpostIDs.length = 0;
            getGLOBAL().Message(getKEYS().Get("newmap_recycle1"), getKEYS().Get("btn_recycle"), this.RecycleD.bind(this));
        } else {
            if (getMapRoomManager().instance.isInMapRoom3 && !getGLOBAL()._aiDesignMode) {
                getGLOBAL().Message(getKEYS().Get("map_cannot_recycle_map_room3"));
                return;
            }
            getGLOBAL().Message(getKEYS().Get("newmap_recycle2"), getKEYS().Get("btn_recycle"), this.RecycleD.bind(this));
        }
        getGLOBAL().eventDispatcher.dispatchEvent(new (getBuildingEvent())(getBuildingEvent().ATTEMPT_RECYCLE, this));
    }

    private RecycleD(): void {
        if (getGLOBAL().mode !== getGLOBAL()._loadmode) return;
        const data: any[] = [["version", 1]];
        if (getMapRoomManager().instance.isInMapRoom3) {
            this.RecycleB();
            return;
        }
        new (getURLLoaderApi())().load(getGLOBAL()._mapURL + "setmapversion", data, this.RecycleDSuccess.bind(this), this.RecycleDFail.bind(this));
    }

    private RecycleDSuccess(serverData: any): void {
        PLEASEWAIT.Hide();
        if (serverData.error === 0 && getGLOBAL().mode === getGLOBAL()._loadmode) {
            if (!getMapRoomManager().instance.isInMapRoom3) {
                getGLOBAL().StatSet("mrl", 1, true);
            }
            getGLOBAL()._bMap = null;
            getMapRoomManager().instance.mapRoomVersion = getMapRoomManager().MAP_ROOM_VERSION_1;
            getGLOBAL()._baseURL = serverData.baseurl;
            getBASE()._baseID = 0;
            getBASE()._loadedFriendlyBaseID = 0;
            for (let i = 1; i < 5; i++) {
                getBASE()._GIP["r" + i].Set(0);
            }
            getBASE()._lastProcessedGIP = getGLOBAL().Timestamp();
            getGLOBAL()._mapOutpost = [];
            if (serverData.basesaveid !== 1) {
                getBASE()._lastSaveID = serverData.basesaveid;
            }
            getMapRoomManager().instance.BookmarksClear();
            this.RecycleB();
            if (this._lvl.Get() === 2) {
                getGLOBAL().Message(getKEYS().Get("newmap_return"));
            }
            getGLOBAL().eventDispatcher.dispatchEvent(new (getBuildingEvent())(getBuildingEvent().DESTROY_MAPROOM, this));
        }
    }

    private RecycleDFail(event: IOErrorEvent): void {
        PLEASEWAIT.Hide();
        getLOGGER().Log("err", "BUILDING11.Recycle HTTP");
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this._lvl.Get() > 1) {
            ACHIEVEMENTS.Check("map2", 1);
        }
        if (this._countdownBuild.Get() === 0) {
            getGLOBAL()._bMap = this;
        }
    }
}
