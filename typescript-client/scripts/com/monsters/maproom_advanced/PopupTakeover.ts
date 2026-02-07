import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Point from "openfl/geom/Point";

import { SecNum } from "../../cc/utils/SecNum";
import { ImageCache } from "../display/ImageCache";
import { EnumYardType } from "../enums/EnumYardType";
import { CellData } from "./CellData";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";

import { PLEASEWAIT } from "../../../PLEASEWAIT";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";
import { POWERUPS } from "../../../POWERUPS";
import { MapRoomPopup_takeover_CLIP } from "../../../MapRoomPopup_takeover_CLIP";

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }
function getLOGGER(): any { return require("../../../LOGGER").LOGGER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }
function getMapRoomManager(): any { return require("../maproom_manager/MapRoomManager").MapRoomManager; }


// JSON declaration
declare const JSON: { encode(obj: any): string };

/**
 * Popup for taking over an enemy outpost or wild monster yard.
 */
export class PopupTakeover extends MapRoomPopup_takeover_CLIP {
    private static readonly TAKEOVER_CAP: number = 65000000;
    
    private _resourceCost: SecNum;
    private _shinyCost: SecNum;
    private _costGap: number = 0;
    private _cell: MapRoomCell;

    constructor(cell: MapRoomCell) {
        super();
        
        this._cell = cell;
        this.Center();
        
        const ImageLoaded = (path: string, data: BitmapData): void => {
            this.mcImage.addChild(new Bitmap(data));
        };
        
        ImageCache.GetImageWithCallBack("popups/outpost-takeover.png", ImageLoaded, true, 1);
        
        this._costGap = 0;
        this._resourceCost = new SecNum(1000000);
        
        const cellValue = Number(this._cell._value);
        const WMBASE = this._cell._base === 1;
        const WMLEVEL = this._cell._level;
        const slope = WMBASE ? 562500 : 15820570.7;
        const intercept = WMBASE ? -14750000 : -227080916.9;
        const roundTo = 250000;
        
        let newResource: number;
        if (!WMBASE) {
            newResource = Math.min(
                Math.max(
                    Math.round((Math.log(cellValue) * slope + intercept) / roundTo) * roundTo,
                    1000000
                ),
                PopupTakeover.TAKEOVER_CAP
            );
        } else {
            newResource = Math.max(
                Math.round((WMLEVEL * slope + intercept) / roundTo) * roundTo,
                1000000
            );
        }
        
        // Check if adjacent cell for 50% discount
        let half = false;
        if (Math.abs(getGLOBAL()._mapHome.x - this._cell.X) === 1) {
            if (getGLOBAL()._mapHome.y + 1 - (getGLOBAL()._mapHome.x + 1) % 2 * 2 === this._cell.Y || 
                getGLOBAL()._mapHome.y === this._cell.Y) {
                half = true;
            }
        } else if (getGLOBAL()._mapHome.x === this._cell.X) {
            if (getGLOBAL()._mapHome.y + 1 === this._cell.Y || getGLOBAL()._mapHome.y - 1 === this._cell.Y) {
                half = true;
            }
        }
        
        if (half) {
            newResource *= 0.5;
        }
        
        this._resourceCost.Set(newResource);
        
        if (POWERUPS.CheckPowers(POWERUPS.ALLIANCE_CONQUEST, "NORMAL")) {
            this._resourceCost.Set(POWERUPS.Apply(POWERUPS.ALLIANCE_CONQUEST, [this._resourceCost.Get()]));
        }
        
        this._shinyCost = new SecNum(Math.ceil(Math.pow(Math.sqrt(this._resourceCost.Get() / 2), 0.75) * 4));
        
        for (let i = 1; i < 5; i++) {
            const costMC = this.mcResources["mcR" + i] as MovieClip;
            costMC.gotoAndStop(i);
            (costMC as any).tTitle.htmlText = "<b>" + getKEYS().Get(getGLOBAL()._resourceNames[i - 1]) + "</b>";
            
            let colorString = "000000";
            if (getGLOBAL()._resources["r" + i].Get() <= this._resourceCost.Get()) {
                colorString = "FF0000";
            } else if (getGLOBAL()._allianceConquestTime.Get() > getGLOBAL().Timestamp()) {
                colorString = "0000FF";
            }
            
            const displayColor = this._resourceCost.Get() > getGLOBAL()._resources["r" + i].Get() ? "FF0000" : "000000";
            (costMC as any).tValue.htmlText = '<b><font color="#' + displayColor + '">' + 
                getGLOBAL().FormatNumber(this._resourceCost.Get()) + '</font></b>';
        }
        
        const bonusTower = Math.floor(this._cell._height * 100 / getGLOBAL()._averageAltitude.Get() - 100);
        const bonusResource = Math.floor(100 * getGLOBAL()._averageAltitude.Get() / this._cell._height - 100);
        
        let bonusStr = "";
        if (this._cell._height !== getGLOBAL()._averageAltitude.Get()) {
            if (this._cell._height > getGLOBAL()._averageAltitude.Get()) {
                bonusStr = getKEYS().Get("bonus_towerrange", { v1: bonusTower });
            } else {
                bonusStr = getKEYS().Get("bonus_resourceproduction", { v1: bonusResource });
            }
        }
        
        if (this._cell._base === 1) {
            this.tTitle.htmlText = "<b>" + getKEYS().Get("takeover_wildmonsteryard") + "</b>";
        } else {
            this.tTitle.htmlText = "<b>" + getKEYS().Get("takeover_outpost", { v1: this._cell._name }) + "</b>";
        }
        
        this.tDescription.htmlText = "<b>" + getKEYS().Get("takeover_expand") + (bonusStr ? " " + bonusStr : "") + "</b>";
        
        (this.mcResources as any).mcTime.visible = false;
        (this.mcResources as any).bAction.SetupKey("btn_useresources");
        (this.mcResources as any).bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            this.TakeOverConfirm(false);
        });
        
        this.mcInstant.bAction.Setup(getKEYS().Get("btn_useshiny", { v1: this._shinyCost.Get() }));
        this.mcInstant.tDescription.htmlText = getKEYS().Get("takeover_instant");
        this.mcInstant.bAction.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            this.TakeOverConfirm(true);
        });
    }

    public Hide(): void {
        getGLOBAL().BlockerRemove();
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public TakeOverConfirm(useShiny: boolean): void {
        const takeoverSuccessful = (serverData: any): void => {
            PLEASEWAIT.Hide();
            if (serverData.error === 0) {
                getBASE()._takeoverFirstOpen = this._cell._base === 1 ? 1 : 2;
                getBASE()._takeoverPreviousOwnersName = this._cell._name;
                MapRoom.GetCell(this._cell.X, this._cell.Y, true);
                getGLOBAL()._mapOutpost.push(new Point(this._cell.X, this._cell.Y));
                getGLOBAL()._resources.r1max += getGLOBAL()._outpostCapacity.Get();
                getGLOBAL()._resources.r2max += getGLOBAL()._outpostCapacity.Get();
                getGLOBAL()._resources.r3max += getGLOBAL()._outpostCapacity.Get();
                getGLOBAL()._resources.r4max += getGLOBAL()._outpostCapacity.Get();
                MapRoom.ClearCells();
                getMapRoomManager().instance.Hide();
                getGLOBAL()._attackerCellsInRange = [];
                getGLOBAL()._currentCell = this._cell;
                (getGLOBAL()._currentCell as MapRoomCell).baseType = 3;
                getBASE().yardType = EnumYardType.OUTPOST;
                getBASE().LoadBase(null, 0, this._cell._baseID, (GLOBAL as any).e_BASE_MODE.BUILD, false, EnumYardType.OUTPOST);
                getLOGGER().Stat([37, getBASE()._takeoverFirstOpen]);
            } else {
                getGLOBAL().Message(getKEYS().Get("err_takeoverproblem") + serverData.error);
            }
            this.Hide();
        };

        const takeoverError = (event: IOErrorEvent): void => {
            this.Hide();
            getGLOBAL().Message(getKEYS().Get("err_takeoverproblem") + event.text);
        };

        let takeoverVars: any[][];
        
        if (useShiny) {
            if (getGLOBAL()._credits.Get() < this._shinyCost.Get()) {
                getPOPUPS().DisplayGetShiny();
                return;
            }
            takeoverVars = [["baseid", this._cell._baseID], ["shiny", this._shinyCost.Get()]];
        } else {
            if (getGLOBAL()._resources.r1.Get() < this._resourceCost.Get() ||
                getGLOBAL()._resources.r2.Get() < this._resourceCost.Get() ||
                getGLOBAL()._resources.r3.Get() < this._resourceCost.Get() ||
                getGLOBAL()._resources.r4.Get() < this._resourceCost.Get()) {
                getGLOBAL().Message(getKEYS().Get("newmap_take4"));
                return;
            }
            takeoverVars = [
                ["baseid", this._cell._baseID],
                ["resources", JSON.encode({
                    r1: this._resourceCost.Get(),
                    r2: this._resourceCost.Get(),
                    r3: this._resourceCost.Get(),
                    r4: this._resourceCost.Get()
                })]
            ];
        }

        PLEASEWAIT.Show(getKEYS().Get("plsw_taking"));
        new (getURLLoaderApi())().load(getGLOBAL()._mapURL + "takeovercell", takeoverVars, takeoverSuccessful, takeoverError);
    }

    private Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }
}
