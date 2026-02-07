import { KeywordMessage } from "../KeywordMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getBUILDING20(): any { return require("../../../../../BUILDING20").BUILDING20; }
function getLOGGER(): any { return require("../../../../../LOGGER").LOGGER; }



/**
 * Build tree 01 - Sniper/Cannon Towers suggestion message (first tower).
 */
export class BuildTree_01_SniperCannonTowers extends KeywordMessage {
    constructor() {
        super("snipercannon", "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 1 && getBASE().hasNumBuildings(getBUILDING20().TYPE) <= 0;
    }

    protected override onButtonClick(): void {
        this.buyMenu(3, 1, 0);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.placedForConstruction.bind(this),
            false,
            0,
            true
        );
    }

    protected placedForConstruction(event: BuildingEvent): void {
        if (event.building._type === getBUILDING20().TYPE) {
            getGLOBAL().eventDispatcher.removeEventListener(
                getBuildingEvent().PLACED_FOR_CONSTRUCTION,
                this.placedForConstruction.bind(this)
            );
            getLOGGER().StatB({
                "st1": "GTP",
                "st2": "Action",
                "value": 1
            }, this._buttonCopy);
        }
    }
}
