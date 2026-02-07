import MouseEvent from 'openfl/events/MouseEvent';
import { HATCHERYCCPOPUP } from './HATCHERYCCPOPUP';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * HATCHERYCC - Hatchery Control Center Controller
 * Manages the hatchery control center popup for batch monster creation
 */
export class HATCHERYCC {
    public static readonly TYPE: number = 16;
    public static readonly DEFAULT_QUEUE_LIMIT: number = 20;
    public static queueLimit: number = HATCHERYCC.DEFAULT_QUEUE_LIMIT;
    public static doesShowInfernoCreeps: boolean = false;
    public static _mc: HATCHERYCCPOPUP | null = null;
    public static _open: boolean = false;

    constructor() {}

    public static Show(): void {
        if (!HATCHERYCC._open) {
            HATCHERYCC._open = true;
            getGLOBAL().BlockerAdd();
            HATCHERYCC._mc = getGLOBAL()._layerWindows.addChild(new HATCHERYCCPOPUP()) as HATCHERYCCPOPUP;
            HATCHERYCC._mc.Setup();
            HATCHERYCC._mc.Center();
            HATCHERYCC._mc.ScaleUp();
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        if (HATCHERYCC._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            getBASE().BuildingDeselect();
            HATCHERYCC._open = false;
            getGLOBAL()._layerWindows.removeChild(HATCHERYCC._mc!);
            HATCHERYCC._mc = null;
        }
    }

    public static Tick(): void {
        if (HATCHERYCC._mc) {
            HATCHERYCC._mc.Update();
        }
    }
}
