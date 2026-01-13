import MouseEvent from "openfl/events/MouseEvent";

import { KeywordMessage } from "../KeywordMessage";

import { GLOBAL } from "../../../../../GLOBAL";
import { POPUPS } from "../../../../../POPUPS";
import { PLANNER } from "../../../../../PLANNER";
import { Button } from "../../../../../Button";

/**
 * News 05 - Yard Planner 2 news message.
 */
export class News05YardPlanner2 extends KeywordMessage {
    constructor() {
        super("yp2");
    }

    public override setupButton(button: Button): Button {
        button.Highlight = true;
        if (GLOBAL._bYardPlanner) {
            button.SetupKey("btn_open");
            button.addEventListener(MouseEvent.CLICK, this.openYardPlanner.bind(this), false, 0, true);
        } else {
            button.SetupKey("btn_buildnow");
            button.addEventListener(MouseEvent.CLICK, this.buildYardPlanner.bind(this), false, 0, true);
        }
        return button;
    }

    protected buildYardPlanner(event: MouseEvent): void {
        this.buyBuilding(PLANNER.TYPE);
    }

    protected openYardPlanner(event: MouseEvent): void {
        POPUPS.Next();
        PLANNER.Show();
    }

    public override get areRequirementsMet(): boolean {
        if (GLOBAL._flags.yp_version === 2) {
            return true;
        }
        return false;
    }
}
