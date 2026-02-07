import { BasePlanner } from './com/monsters/baseplanner/BasePlanner';
import MouseEvent from 'openfl/events/MouseEvent';
import StageDisplayState from 'openfl/display/StageDisplayState';
import { PLANNERPOPUP } from './PLANNERPOPUP';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSTORE(): any { return require("./STORE").STORE; }


/**
 * PLANNER - Yard Planner Controller
 * Manages the yard planner popup for organizing base layout
 */
export class PLANNER {
    public static readonly TYPE: number = 10;
    public static _mc: PLANNERPOPUP | null = null;
    public static _open: boolean = false;
    public static _selected: boolean = false;
    public static _useOldPlanner: boolean = true;
    public static basePlanner: BasePlanner | null = null;

    constructor() {
        PLANNER._open = false;
    }

    public static Show(event: MouseEvent | null = null): void {
        if (getGLOBAL()._selectedBuilding) {
            getGLOBAL()._selectedBuilding.StopMoveB();
        }
        if (getGLOBAL()._newBuilding) {
            (getGLOBAL()._newBuilding as any).Cancel();
        }
        getBASE().BuildingDeselect();
        PLANNER._selected = false;
        
        if (getGLOBAL()._flags?.yp_version !== null) {
            switch (getGLOBAL()._flags.yp_version) {
                case 0:
                    getGLOBAL().Message(">Yard PLANNER has been disabled for this ENVIRONMENT");
                    return;
                case 1:
                    PLANNER._useOldPlanner = true;
                    break;
                case 2:
                    PLANNER._useOldPlanner = false;
                    break;
            }
        }
        
        if (!PLANNER._open) {
            PLANNER._open = true;
            getSOUNDS().Play("click1");
            getBASE().BuildingDeselect();
            getGLOBAL().BlockerAdd();
            
            if (PLANNER._useOldPlanner) {
                if (getGLOBAL()._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN) {
                    getGLOBAL()._ROOT.stage.displayState = StageDisplayState.NORMAL;
                }
                PLANNER._mc = getGLOBAL()._layerWindows.addChild(new PLANNERPOPUP()) as PLANNERPOPUP;
            } else {
                if (PLANNER.basePlanner) {
                    PLANNER.basePlanner.setup();
                } else {
                    PLANNER.basePlanner = new BasePlanner();
                    PLANNER.basePlanner.setup();
                }
            }
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        getGLOBAL().BlockerRemove();
        if (getGLOBAL()._selectedBuilding && getGLOBAL()._selectedBuilding._class !== "mushroom") {
            getGLOBAL()._selectedBuilding.StopMoveB();
        }
        if (getGLOBAL()._newBuilding) {
            (getGLOBAL()._newBuilding as any).Cancel();
        }
        getBASE().BuildingDeselect();
        
        if (PLANNER._open) {
            getSOUNDS().Play("close");
            PLANNER._open = false;
            if (PLANNER._useOldPlanner) {
                PLANNER._mc!.Remove();
                getGLOBAL()._layerWindows.removeChild(PLANNER._mc!);
                PLANNER._mc = null;
            } else {
                PLANNER.basePlanner?.hide();
            }
        }
    }

    public static isOpen(): boolean {
        return PLANNER._open;
    }

    public static Update(): void {
        if (PLANNER._open) {
            if (PLANNER._useOldPlanner) {
                getSTORE().Hide();
                PLANNER.Hide();
                PLANNER.Show();
            }
        }
    }
}
