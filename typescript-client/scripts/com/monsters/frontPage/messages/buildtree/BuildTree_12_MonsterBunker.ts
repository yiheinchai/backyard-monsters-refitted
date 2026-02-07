import { BuildTreeMessage } from "../BuildTreeMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getMONSTERBUNKER(): any { return require("../../../../../MONSTERBUNKER").MONSTERBUNKER; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }



/**
 * Build tree 12 - Monster Bunker suggestion message.
 */
export class BuildTree_12_MonsterBunker extends BuildTreeMessage {
    constructor() {
        super("bunker", getMONSTERBUNKER().TYPE, "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 3 && getBASE().hasNumBuildings(getMONSTERBUNKER().TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(getMONSTERBUNKER().TYPE);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }
}
