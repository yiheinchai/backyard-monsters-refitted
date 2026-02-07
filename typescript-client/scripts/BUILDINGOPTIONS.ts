import DisplayObject from 'openfl/display/DisplayObject';
import MouseEvent from 'openfl/events/MouseEvent';
import { BUILDINGOPTIONSPOPUP } from './BUILDINGOPTIONSPOPUP';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * BUILDINGOPTIONS - Building Options Dialog Management
 * Handles showing and hiding the building options popup
 */
export class BUILDINGOPTIONS {
    public static _do: BUILDINGOPTIONSPOPUP | null = null;
    public static _doBG: DisplayObject | null = null;
    public static _building: BFOUNDATION | null = null;
    public static _open: boolean = false;

    constructor() {}

    public static Show(building: BFOUNDATION, mode: string = "info"): void {
        if (!BUILDINGOPTIONS._open) {
            getGLOBAL().BlockerAdd();
            getSOUNDS().Play("click1");
            getBASE().BuildingDeselect();
            BUILDINGOPTIONS._building = building;
            BUILDINGOPTIONS._open = true;
            BUILDINGOPTIONS._do = getGLOBAL()._layerWindows.addChild(new BUILDINGOPTIONSPOPUP(mode)) as BUILDINGOPTIONSPOPUP;
            BUILDINGOPTIONS._do.Center();
            BUILDINGOPTIONS._do.ScaleUp();
        }
    }

    public static Hide(event: MouseEvent | null = null): void {
        if (BUILDINGOPTIONS._open) {
            getGLOBAL().BlockerRemove();
            getSOUNDS().Play("close");
            BUILDINGOPTIONS._open = false;
            getGLOBAL()._layerWindows.removeChild(BUILDINGOPTIONS._do!);
            BUILDINGOPTIONS._do = null;
        }
    }
}
