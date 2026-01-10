import MouseEvent from "openfl/events/MouseEvent";

import { POPUPSETTINGS } from "./POPUPSETTINGS";
import { STORE } from "./STORE";
import { STOREPOPUP_CLIP } from "./STOREPOPUP_CLIP";

export class STOREPOPUP extends STOREPOPUP_CLIP {
    constructor() {
        super();
    }

    public Hide(param1: MouseEvent = null): void {
        STORE.Hide();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
