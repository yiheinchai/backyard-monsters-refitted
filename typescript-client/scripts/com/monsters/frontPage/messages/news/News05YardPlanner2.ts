import MouseEvent from "openfl/events/MouseEvent";

import { KeywordMessage } from "../KeywordMessage";

import { Button } from "../../../../../Button";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("../../../../../POPUPS").POPUPS; }
function getPLANNER(): any { return require("../../../../../PLANNER").PLANNER; }


/**
 * News 05 - Yard Planner 2 news message.
 */
export class News05YardPlanner2 extends KeywordMessage {
    constructor() {
        super("yp2");
    }

    public override setupButton(button: Button): Button {
        button.Highlight = true;
        if (getGLOBAL()._bYardPlanner) {
            button.SetupKey("btn_open");
            button.addEventListener(MouseEvent.CLICK, this.openYardPlanner.bind(this), false, 0, true);
        } else {
            button.SetupKey("btn_buildnow");
            button.addEventListener(MouseEvent.CLICK, this.buildYardPlanner.bind(this), false, 0, true);
        }
        return button;
    }

    protected buildYardPlanner(event: MouseEvent): void {
        this.buyBuilding(getPLANNER().TYPE);
    }

    protected openYardPlanner(event: MouseEvent): void {
        getPOPUPS().Next();
        getPLANNER().Show();
    }

    public override get areRequirementsMet(): boolean {
        if (getGLOBAL()._flags.yp_version === 2) {
            return true;
        }
        return false;
    }
}
