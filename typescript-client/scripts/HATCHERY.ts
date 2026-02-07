import MouseEvent from 'openfl/events/MouseEvent';
import { HATCHERYPOPUP } from './HATCHERYPOPUP';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getBUILDING13(): any { return require("./BUILDING13").BUILDING13; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * HATCHERY - Hatchery Building Controller
 * Manages the hatchery popup for creating monsters
 */
export class HATCHERY {
    public static readonly TYPE: number = 13;
    public static _mc: HATCHERYPOPUP | null = null;
    public static _open: boolean = false;

    constructor() {}

    public static Show(building: BUILDING13): void {
        if (!HATCHERY._open) {
            HATCHERY._open = true;
            getGLOBAL().BlockerAdd();
            HATCHERY._mc = getGLOBAL()._layerWindows.addChild(new HATCHERYPOPUP()) as HATCHERYPOPUP;
            HATCHERY._mc.Setup(building);
            HATCHERY._mc.Center();
            HATCHERY._mc.ScaleUp();
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        if (HATCHERY._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getBASE().BuildingDeselect();
            HATCHERY._open = false;
            getGLOBAL()._layerWindows.removeChild(HATCHERY._mc!);
            HATCHERY._mc = null;
        }
    }

    public static Tick(): void {
        if (HATCHERY._mc) {
            HATCHERY._mc.Update();
        }
    }
}
