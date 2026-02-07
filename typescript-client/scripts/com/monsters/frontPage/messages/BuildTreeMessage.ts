import { KeywordMessage } from "./KeywordMessage";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }



/**
 * Build tree message - base class for building suggestion messages.
 */
export class BuildTreeMessage extends KeywordMessage {
    protected _buildingType: number;

    constructor(keyword: string, buildingType: number, buttonCopy: string | null = null) {
        super(keyword, buttonCopy);
        this._buildingType = buildingType;
        this.name = this._keyword;
    }

    protected placedForConstruction(event: BuildingEvent): void {
        if (event.building._type === this._buildingType) {
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

    protected targetHasUpgraded(event: BuildingEvent): void {
        if (event.building._type === this._buildingType) {
            getGLOBAL().eventDispatcher.removeEventListener(
                getBuildingEvent().UPGRADED,
                this.targetHasUpgraded.bind(this)
            );
            getLOGGER().StatB({
                "st1": "GTP",
                "st2": "Action",
                "value": 1
            }, this._buttonCopy);
        }
    }
}
