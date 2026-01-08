import { MapBasePopup_CLIP } from "./MapBasePopup_CLIP";

import { KEYS } from "../../../../KEYS";
import { TweenLite } from "gs/TweenLite";
import { Elastic } from "gs/easing/Elastic";

/**
 * Map base popup - popup for map base actions with animation.
 */
export class MapBasePopup extends MapBasePopup_CLIP {
    constructor() {
        super();
    }

    public initWithTitleAndButtons(title: string, buttons: Array<any>, actions: Array<any>): void {
        this.title_txt.htmlText = "<b>" + KEYS.Get("map_options") + "</b>";
    }

    public setHeightForButtons(buttonCount: number): void {
        if (buttonCount === 2) {
            this.bg_mc.height = 98;
            this.bg_mc.y = 19;
        } else if (buttonCount === 3) {
            this.bg_mc.height = 131;
            this.bg_mc.y = 35;
        } else {
            this.bg_mc.height = 163;
            this.bg_mc.y = 51;
        }
    }

    public Show(): void {
        const targetX: number = this.x;
        this.x -= 15;
        TweenLite.to(this, 0.6, {
            "x": targetX,
            "ease": Elastic.easeOut
        });
    }
}
