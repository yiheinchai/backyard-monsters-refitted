import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getCHAMPIONCHAMBER(): any { return require("../../../../../CHAMPIONCHAMBER").CHAMPIONCHAMBER; }
function getCHAMPIONCAGE(): any { return require("../../../../../CHAMPIONCAGE").CHAMPIONCAGE; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 19 - Champion Chamber suggestion message.
 */
export class BuildTree_19_ChampionChamber extends BuildTreeMessage {
    constructor() {
        super("chamber", getCHAMPIONCHAMBER().TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 4 && getBASE().hasNumBuildings(getCHAMPIONCHAMBER().TYPE) <= 0 && getBASE().hasNumBuildings(getCHAMPIONCAGE().TYPE, 1) >= 1;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(getCHAMPIONCHAMBER().TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
