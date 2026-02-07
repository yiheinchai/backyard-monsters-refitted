import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";

import { SecNum } from "../../cc/utils/SecNum";
import { MapRoomCell } from "./MapRoomCell";
import { MapRoom } from "./MapRoom";
import { MapRoomPopup } from "./MapRoomPopup";

import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { PopupRelocateMe_CLIP } from "../../../PopupRelocateMe_CLIP";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }


// JSON declaration
declare const JSON: { encode(obj: any): string; decode(str: string): any };

/**
 * Popup for relocating the player's base.
 */
export class PopupRelocateMe extends PopupRelocateMe_CLIP {
    private _cell: MapRoomCell | null = null;
    private _oldCell: MapRoomCell | null = null;
    private RESOURCECOST: SecNum;
    private SHINYCOST: SecNum;
    private _mode: string = "";

    constructor() {
        super();
        this.RESOURCECOST = new SecNum(0);
        this.SHINYCOST = new SecNum(0);
    }

    public Setup(cell: MapRoomCell, mode: string = "outpost"): void {
        this._cell = cell;
        
        if (!MapRoom._open) {
            this.x = 365;
            this.y = 260;
        } else {
            this.x = 395;
            this.y = 260;
        }
        
        this._mode = mode;
        this.tTitle.htmlText = "<b>" + getKEYS().Get("map_relocate") + "</b>";
        
        if (mode === "invite") {
            this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
                MapRoom.AcceptInvitation(true);
            });
            this.RESOURCECOST = new SecNum(10000000);
            this.SHINYCOST = new SecNum(1200);
            this.tDescription.htmlText = '<font color="#CC0000">' + getKEYS().Get("msg_moveyard_warn") + '</font>';
        } else {
            this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                this.RelocateConfirm(true);
            });
            this.RESOURCECOST = new SecNum(30000000);
            this.SHINYCOST = new SecNum(1500);
            this.tDescription.htmlText = '<font color="#CC0000">' + getKEYS().Get("msg_movetooutpost_warn") + '</font>';
        }
        
        this.mcInstant.tDescription.htmlText = "<b>" + getKEYS().Get("map_relocateinstant") + "</b>";
        this.mcInstant.bAction.Setup(getKEYS().Get("btn_useshiny", { v1: getGLOBAL().FormatNumber(this.SHINYCOST.Get()) }));
        
        for (let i = 1; i < 5; i++) {
            const resource = this.mcResources["mcR" + i] as MovieClip;
            resource.gotoAndStop(i);
            (resource as any).tTitle.htmlText = "<b>" + getKEYS().Get(getGLOBAL()._resourceNames[i - 1]) + "</b>";
            (resource as any).tValue.htmlText = "<b>" + getGLOBAL().FormatNumber(this.RESOURCECOST.Get()) + "</b>";
        }
        
        (this.mcResources as any).mcTime.visible = false;
        (this.mcResources as any).bAction.SetupKey("btn_useresources");
        
        if (mode === "invite") {
            (this.mcResources as any).bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
                MapRoom.AcceptInvitation(false);
            });
        } else {
            (this.mcResources as any).bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                this.RelocateConfirm(false);
            });
        }
    }

    public Cleanup(): void {
        // Cleanup listeners - simplified since we use arrow functions
    }

    public Hide(): void {
        getGLOBAL().BlockerRemove();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public RelocateConfirm(useShiny: boolean): void {
        const RelocateSuccess = (response: any): void => {
            PLEASEWAIT.Hide();
            if (response.error === 0) {
                if (response.cantMoveTill) {
                    getGLOBAL().Message(getKEYS().Get("movebase_warning", { v1: getGLOBAL().ToTime(response.cantMoveTill - response.currenttime) }));
                    this.Hide();
                } else {
                    getGLOBAL()._resources.r1max -= getGLOBAL()._outpostCapacity.Get();
                    getGLOBAL()._resources.r2max -= getGLOBAL()._outpostCapacity.Get();
                    getGLOBAL()._resources.r3max -= getGLOBAL()._outpostCapacity.Get();
                    getGLOBAL()._resources.r4max -= getGLOBAL()._outpostCapacity.Get();
                    getLOGGER().Stat([45, useShiny ? this.SHINYCOST.Get() : 0]);
                    this.Hide();
                    MapRoom._mc._popupInfoMine.Hide();
                    getMapRoomManager().instance.BookmarksClear();
                    getGLOBAL()._mapOutpost.shift();
                    
                    if (response.coords && response.coords.length === 2 && response.coords[0] > -1 && response.coords[1] > -1) {
                        getGLOBAL()._mapHome = new Point(response.coords[0], response.coords[1]);
                        MapRoom._Setup(getGLOBAL()._mapHome);
                    }
                    
                    if (useShiny) {
                        getGLOBAL()._credits.Add(-this.SHINYCOST.Get());
                    } else {
                        getGLOBAL()._resources.r1.Add(-this.RESOURCECOST.Get());
                        getGLOBAL()._resources.r2.Add(-this.RESOURCECOST.Get());
                        getGLOBAL()._resources.r3.Add(-this.RESOURCECOST.Get());
                        getGLOBAL()._resources.r4.Add(-this.RESOURCECOST.Get());
                    }
                    
                    if (this._cell) {
                        this._cell._updated = false;
                        this._cell._dirty = true;
                    }
                    this._oldCell = MapRoom._homeCell;
                    
                    if (this._oldCell) {
                        this._oldCell._updated = false;
                        this._oldCell._dirty = false;
                    } else {
                        getLOGGER().Log("err", "Null home cell when transfering base");
                    }
                    
                    MapRoom.ClearCells();
                    PLEASEWAIT.Show(getKEYS().Get("wait_packingyard"));
                    this.addEventListener(Event.ENTER_FRAME, this.RelocateComplete.bind(this));
                    getMapRoomManager().instance.Tick();
                    
                    if (MapRoomPopup.instance) {
                        MapRoomPopup.instance.CloseMapRoomAfterMigration();
                    }
                }
            } else {
                getGLOBAL().Message(getKEYS().Get("msg_err_relocate") + response.error);
            }
        };

        const RelocateFail = (event: IOErrorEvent): void => {
            this.Hide();
            getGLOBAL().Message(getKEYS().Get("msg_err_relocate") + event.text);
        };

        const relocateVars: any[][] = [["type", "outpost"], ["baseid", this._cell?._baseID || 0]];
        
        if (useShiny) {
            if (getGLOBAL()._credits.Get() < this.SHINYCOST.Get()) {
                this.Hide();
                getPOPUPS().DisplayGetShiny();
                return;
            }
            relocateVars.push(["shiny", this.SHINYCOST.Get()]);
        } else {
            if (getGLOBAL()._resources.r1.Get() < this.RESOURCECOST.Get() ||
                getGLOBAL()._resources.r2.Get() < this.RESOURCECOST.Get() ||
                getGLOBAL()._resources.r3.Get() < this.RESOURCECOST.Get() ||
                getGLOBAL()._resources.r4.Get() < this.RESOURCECOST.Get()) {
                this.Hide();
                getGLOBAL().Message(getKEYS().Get("map_relocate_notenoughresources"));
                return;
            }
            relocateVars.push(["resources", JSON.encode({
                r1: this.RESOURCECOST.Get(),
                r2: this.RESOURCECOST.Get(),
                r3: this.RESOURCECOST.Get(),
                r4: this.RESOURCECOST.Get()
            })]);
        }
        
        PLEASEWAIT.Show(getKEYS().Get("wait_relocating"));
        new (getURLLoaderApi())().load(getGLOBAL()._baseURL + "migrate", relocateVars, RelocateSuccess, RelocateFail);
    }

    private RelocateComplete(event: Event): void {
        if (this._cell && this._oldCell && this._cell._updated && this._oldCell._updated) {
            this.removeEventListener(Event.ENTER_FRAME, this.RelocateComplete.bind(this));
            PLEASEWAIT.Hide();
        }
        if (this._oldCell) {
            this._oldCell._updated = true;
        }
    }
}
