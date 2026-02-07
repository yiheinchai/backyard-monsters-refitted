import MouseEvent from "openfl/events/MouseEvent";

import { POPUPSETTINGS } from "./POPUPSETTINGS";
import { STOREPOPUP_CLIP } from "./STOREPOPUP_CLIP";

// Lazy imports to break circular dependency chains
function getSTORE(): any { return require("./STORE").STORE; }


export class STOREPOPUP extends STOREPOPUP_CLIP {
    constructor() {
        super();
    }

    public Hide(param1: MouseEvent = null): void {
        getSTORE().Hide();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
