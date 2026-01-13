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

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGGER } from "../../../LOGGER";
import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { POPUPS } from "../../../POPUPS";
import { URLLoaderApi } from "../../../URLLoaderApi";
import { MapRoomManager } from "../maproom_manager/MapRoomManager";
import { PopupRelocateMe_CLIP } from "../../../PopupRelocateMe_CLIP";

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
        this.tTitle.htmlText = "<b>" + KEYS.Get("map_relocate") + "</b>";
        
        if (mode === "invite") {
            this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
                MapRoom.AcceptInvitation(true);
            });
            this.RESOURCECOST = new SecNum(10000000);
            this.SHINYCOST = new SecNum(1200);
            this.tDescription.htmlText = '<font color="#CC0000">' + KEYS.Get("msg_moveyard_warn") + '</font>';
        } else {
            this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                this.RelocateConfirm(true);
            });
            this.RESOURCECOST = new SecNum(30000000);
            this.SHINYCOST = new SecNum(1500);
            this.tDescription.htmlText = '<font color="#CC0000">' + KEYS.Get("msg_movetooutpost_warn") + '</font>';
        }
        
        this.mcInstant.tDescription.htmlText = "<b>" + KEYS.Get("map_relocateinstant") + "</b>";
        this.mcInstant.bAction.Setup(KEYS.Get("btn_useshiny", { v1: GLOBAL.FormatNumber(this.SHINYCOST.Get()) }));
        
        for (let i = 1; i < 5; i++) {
            const resource = this.mcResources["mcR" + i] as MovieClip;
            resource.gotoAndStop(i);
            (resource as any).tTitle.htmlText = "<b>" + KEYS.Get(GLOBAL._resourceNames[i - 1]) + "</b>";
            (resource as any).tValue.htmlText = "<b>" + GLOBAL.FormatNumber(this.RESOURCECOST.Get()) + "</b>";
        }
        
        this.mcResources.mcTime.visible = false;
        this.mcResources.bAction.SetupKey("btn_useresources");
        
        if (mode === "invite") {
            this.mcResources.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
                MapRoom.AcceptInvitation(false);
            });
        } else {
            this.mcResources.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
                this.RelocateConfirm(false);
            });
        }
    }

    public Cleanup(): void {
        // Cleanup listeners - simplified since we use arrow functions
    }

    public Hide(): void {
        GLOBAL.BlockerRemove();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public RelocateConfirm(useShiny: boolean): void {
        const RelocateSuccess = (response: any): void => {
            PLEASEWAIT.Hide();
            if (response.error === 0) {
                if (response.cantMoveTill) {
                    GLOBAL.Message(KEYS.Get("movebase_warning", { v1: GLOBAL.ToTime(response.cantMoveTill - response.currenttime) }));
                    this.Hide();
                } else {
                    GLOBAL._resources.r1max -= GLOBAL._outpostCapacity.Get();
                    GLOBAL._resources.r2max -= GLOBAL._outpostCapacity.Get();
                    GLOBAL._resources.r3max -= GLOBAL._outpostCapacity.Get();
                    GLOBAL._resources.r4max -= GLOBAL._outpostCapacity.Get();
                    LOGGER.Stat([45, useShiny ? this.SHINYCOST.Get() : 0]);
                    this.Hide();
                    MapRoom._mc._popupInfoMine.Hide();
                    MapRoomManager.instance.BookmarksClear();
                    GLOBAL._mapOutpost.shift();
                    
                    if (response.coords && response.coords.length === 2 && response.coords[0] > -1 && response.coords[1] > -1) {
                        GLOBAL._mapHome = new Point(response.coords[0], response.coords[1]);
                        MapRoom._Setup(GLOBAL._mapHome);
                    }
                    
                    if (useShiny) {
                        GLOBAL._credits.Add(-this.SHINYCOST.Get());
                    } else {
                        GLOBAL._resources.r1.Add(-this.RESOURCECOST.Get());
                        GLOBAL._resources.r2.Add(-this.RESOURCECOST.Get());
                        GLOBAL._resources.r3.Add(-this.RESOURCECOST.Get());
                        GLOBAL._resources.r4.Add(-this.RESOURCECOST.Get());
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
                        LOGGER.Log("err", "Null home cell when transfering base");
                    }
                    
                    MapRoom.ClearCells();
                    PLEASEWAIT.Show(KEYS.Get("wait_packingyard"));
                    this.addEventListener(Event.ENTER_FRAME, this.RelocateComplete.bind(this));
                    MapRoomManager.instance.Tick();
                    
                    if (MapRoomPopup.instance) {
                        MapRoomPopup.instance.CloseMapRoomAfterMigration();
                    }
                }
            } else {
                GLOBAL.Message(KEYS.Get("msg_err_relocate") + response.error);
            }
        };

        const RelocateFail = (event: IOErrorEvent): void => {
            this.Hide();
            GLOBAL.Message(KEYS.Get("msg_err_relocate") + event.text);
        };

        const relocateVars: any[][] = [["type", "outpost"], ["baseid", this._cell?._baseID || 0]];
        
        if (useShiny) {
            if (GLOBAL._credits.Get() < this.SHINYCOST.Get()) {
                this.Hide();
                POPUPS.DisplayGetShiny();
                return;
            }
            relocateVars.push(["shiny", this.SHINYCOST.Get()]);
        } else {
            if (GLOBAL._resources.r1.Get() < this.RESOURCECOST.Get() ||
                GLOBAL._resources.r2.Get() < this.RESOURCECOST.Get() ||
                GLOBAL._resources.r3.Get() < this.RESOURCECOST.Get() ||
                GLOBAL._resources.r4.Get() < this.RESOURCECOST.Get()) {
                this.Hide();
                GLOBAL.Message(KEYS.Get("map_relocate_notenoughresources"));
                return;
            }
            relocateVars.push(["resources", JSON.encode({
                r1: this.RESOURCECOST.Get(),
                r2: this.RESOURCECOST.Get(),
                r3: this.RESOURCECOST.Get(),
                r4: this.RESOURCECOST.Get()
            })]);
        }
        
        PLEASEWAIT.Show(KEYS.Get("wait_relocating"));
        new URLLoaderApi().load(GLOBAL._baseURL + "migrate", relocateVars, RelocateSuccess, RelocateFail);
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
