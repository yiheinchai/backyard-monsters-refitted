import MouseEvent from 'openfl/events/MouseEvent';
import { BUILDINGSPOPUP } from './BUILDINGSPOPUP';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BUILDINGS - Buildings Menu Controller
 * Manages the buildings popup for placing new buildings
 */
export class BUILDINGS {
    public static _mc: BUILDINGSPOPUP | null = null;
    public static _open: boolean = false;
    public static _menuA: number = 1;
    public static _menuB: number = 0;
    public static _page: number = 0;
    public static _buildingID: number = 0;

    constructor() {}

    public static Reset(full: boolean = false): void {
        if (full) {
            BUILDINGS._menuA = 1;
            BUILDINGS._menuB = 0;
            BUILDINGS._page = 0;
        }
        BUILDINGS._buildingID = 0;
        BUILDINGS.Hide();
    }

    public static Show(event: MouseEvent | null = null): void {
        if (getMapRoomManager().instance.isInMapRoom3 && !getBASE().isMainYardOrInfernoMainYard) return;
        getGLOBAL().BlockerAdd();
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            if (getGLOBAL()._newBuilding) {
                (getGLOBAL()._newBuilding as BFOUNDATION).Cancel();
            }
            if (!BUILDINGS._open) {
                getSOUNDS().Play("click1");
                getBASE().BuildingDeselect();
                BUILDINGS._open = true;
                BUILDINGS._mc = getGLOBAL()._layerWindows.addChild(new BUILDINGSPOPUP()) as BUILDINGSPOPUP;
                BUILDINGS._mc.Center();
                BUILDINGS._mc.ScaleUp();
            }
            if (BUILDINGS._buildingID > 0) {
                BUILDINGS._mc!.ShowInfo(BUILDINGS._buildingID);
            }
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        getGLOBAL().BlockerRemove();
        if (BUILDINGS._open) {
            getSOUNDS().Play("close");
            BUILDINGS._open = false;
            BUILDINGS._mc!.HideInfo();
            BUILDINGS._mc!._buildingInfoMC = null;
            getGLOBAL()._layerWindows.removeChild(BUILDINGS._mc!);
            BUILDINGS._mc = null;
        }
    }
}
