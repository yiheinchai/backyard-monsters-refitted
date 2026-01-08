import { KrallenHUD_CLIP } from "./KrallenHUD_CLIP";

/**
 * KOTH HUD graphic - King of the Hill HUD display.
 */
export class KOTHHUDGraphic extends KrallenHUD_CLIP {
    constructor(active: boolean, level: number) {
        super();
        this.update(active, level);
        this.buttonMode = true;
    }

    public update(active: boolean, level: number): void {
        this.gotoAndStop(active ? "active" : "inactive");
        this.mcLevel.tLevel.text = level.toString();
        this.mcLevel.visible = Boolean(level);
    }
}
