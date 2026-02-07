import { KeywordMessage } from "../KeywordMessage";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getBUILDING14(): any { return require("../../../../../BUILDING14").BUILDING14; }
function getINFERNO_MAGMA_TOWER(): any { return require("../../../../../INFERNO_MAGMA_TOWER").INFERNO_MAGMA_TOWER; }



/**
 * News 01 - Magma Tower news message.
 */
export class News01MagmaTower extends KeywordMessage {
    constructor() {
        let buttonCopy: string = "";
        if (getGLOBAL().StatGet(getBUILDING14().UNDERHALL_LEVEL) >= 1) {
            buttonCopy = "btn_buildnow";
        }
        super("3_14_0", buttonCopy);
        this.imageURL = KeywordMessage._IMAGE_DIRECTORY + KeywordMessage.PREFIX + "magmaabove.jpg";
    }

    public override get areRequirementsMet(): boolean {
        return !getGLOBAL()._flags.viximo && !getGLOBAL()._flags.kongregate;
    }

    protected override onButtonClick(): void {
        this.buyBuilding(getINFERNO_MAGMA_TOWER().ID);
    }
}
