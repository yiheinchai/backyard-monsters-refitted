import DisplayObject from "openfl/display/DisplayObject";
import MouseEvent from "openfl/events/MouseEvent";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";

import { Button } from "../../../../Button";
import { KEYS } from "../../../../../KEYS";

/**
 * Monster Madness popup info for goal 2 complete.
 */
export class MonsterMadnessPopupInfoGoal2Complete extends MonsterMadnessPopupInfo {
    constructor() {
        super();
        this.isOnlySeenOnce = true;
    }

    public override getCopy(mode: number): string {
        return "mm_goal2_completed";
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupVideo(MonsterMadnessPopupInfo.KOGOTH_SPINNING_FIREBALL_VIDEO);
    }

    public override setupButton(button: Button, mode: number): void {
        button.Setup(KEYS.Get("btn_brag"));
        button.Highlight = true;
        button.addEventListener(MouseEvent.CLICK, this.onClickBrag.bind(this));
    }

    protected onClickBrag(event: MouseEvent): void {
        this.ShowBrag("mm_g2_complete", "mm_korathability1_streamtitle", "mm_korathability1_streambody", MonsterMadnessPopupInfo.KOGOTH_BRAG_IMAGE2);
    }
}
