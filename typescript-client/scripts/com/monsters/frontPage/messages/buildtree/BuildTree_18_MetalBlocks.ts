import { KeywordMessage } from "../KeywordMessage";

// Lazy imports to break circular dependency chains
function getFrontPageHandler(): any { return require("../../FrontPageHandler").FrontPageHandler; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getSTORE(): any { return require("../../../../../STORE").STORE; }



/**
 * Build tree 18 - Metal Blocks suggestion message.
 */
export class BuildTree_18_MetalBlocks extends KeywordMessage {
    constructor() {
        super("blocks3", "btn_buildnow");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() >= 4 && getBASE().hasNumBuildings(17, 1) >= 1 && getBASE().hasNumBuildings(17, 3) <= 0;
    }

    protected override onButtonClick(): void {
        getFrontPageHandler().closeAll();
        if (getBASE().isInfernoMainYardOrOutpost) {
            getSTORE().ShowB(1, 0, ["BLK2I", "BLK3I"]);
        } else {
            getSTORE().ShowB(1, 0, ["BLK2", "BLK3", "BLK4", "BLK5"]);
        }
    }
}
