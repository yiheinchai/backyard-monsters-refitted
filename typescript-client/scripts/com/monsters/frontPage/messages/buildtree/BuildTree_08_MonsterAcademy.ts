import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 08 - Monster Academy suggestion message.
 */
export class BuildTree_08_MonsterAcademy extends BuildTreeMessage {
    constructor() {
        super("academy", 26, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(26) !== 0) {
            return false;
        }
        return getGLOBAL().townHall && getGLOBAL().townHall._lvl.Get() >= 3 && Boolean(getGLOBAL()._bLocker) && getGLOBAL()._bLocker._lvl.Get() >= 2;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(26);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
