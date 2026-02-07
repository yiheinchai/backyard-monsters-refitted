import { KeywordMessage } from "../KeywordMessage";

// Lazy imports to break circular dependency chains
function getFrontPageHandler(): any { return require("../../FrontPageHandler").FrontPageHandler; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBASE(): any { return require("../../../../../BASE").BASE; }
function getSTORE(): any { return require("../../../../../STORE").STORE; }



/**
 * Build tree 07 - Stone Blocks upgrade suggestion message.
 */
export class BuildTree_07_StoneBlocks extends KeywordMessage {
    constructor() {
        super("blocks2", "btn_upgrade");
    }

    public override get areRequirementsMet(): boolean {
        if (getBASE().hasNumBuildings(17, 2) !== 0 && getBASE().hasNumBuildings(17, 1) > 0) {
            return false;
        }
        return Boolean(getGLOBAL().townHall) && getGLOBAL().townHall._lvl.Get() >= 3 && getBASE().hasNumBuildings(17, 1) > 0;
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
