import { KeywordMessage } from "../KeywordMessage";

// Lazy imports to break circular dependency chains
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getBUILDINGOPTIONS(): any { return require("../../../../../BUILDINGOPTIONS").BUILDINGOPTIONS; }
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }



/**
 * News 06 - Town Hall Level 10 news message.
 */
export class News06TownHallLevel10 extends KeywordMessage {
    constructor() {
        super("townhall10", "btn_upgradenow");
    }

    protected override onButtonClick(): void {
        getPOPUPS().Next();
        getBUILDINGOPTIONS().Show(getGLOBAL().townHall, "upgrade");
    }

    public override get areRequirementsMet(): boolean {
        return getGLOBAL().townHall._lvl.Get() === 9;
    }
}
