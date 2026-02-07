import { KeywordMessage } from "../../../../frontPage/messages/KeywordMessage";

import { YARD_PROPS } from "../../../../../../YARD_PROPS";

// Lazy imports to break circular dependency chains
function getBuildingEvent(): any { return require("../../../../events/BuildingEvent").BuildingEvent; }
function getGLOBAL(): any { return require("../../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../../BASE").BASE; }
function getPOPUPS(): any { return require("../../../../../../POPUPS").POPUPS; }
function getSpurtzCannon(): any { return require("../../../../../../SpurtzCannon").SpurtzCannon; }
function getLOGGER(): any { return require("../../../../../../LOGGER").LOGGER; }


/**
 * Spurtz Cannon reward message 1 - shown when first cannon is unlocked.
 */
export class SpurtzCannonRewardMessage1 extends KeywordMessage {
    constructor() {
        super("event_bruwarreward1", "btn_buildnow");
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        if (YARD_PROPS._yardProps[getSpurtzCannon().TYPE - 1].block) {
            return;
        }
        getBASE().addBuildingB(getSpurtzCannon().TYPE, true);
        getGLOBAL().eventDispatcher.addEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.constructedBuilding.bind(this)
        );
    }

    protected constructedBuilding(event: BuildingEvent): void {
        getLOGGER().StatB({
            "st1": "ERS",
            "st2": "Brukkarg War",
            "st3": "cannon_placed"
        }, "Cannon_Placed");
        getGLOBAL().eventDispatcher.removeEventListener(
            getBuildingEvent().PLACED_FOR_CONSTRUCTION,
            this.constructedBuilding.bind(this)
        );
        if (event.building instanceof getSpurtzCannon()) {
            getGLOBAL().Brag("event5-reward", "event_bruwarreward1_streamtitle", "event_bruwarreward1_streamdesc", "event_bruwarreward1_stream.png");
        }
    }
}
