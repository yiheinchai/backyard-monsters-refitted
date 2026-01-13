import DisplayObject from "openfl/display/DisplayObject";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";
import { MonsterMadnessPopup } from "./MonsterMadnessPopup";

import { Button } from "../../../../../Button";

/**
 * Monster Madness popup info for goal 1.
 */
export class MonsterMadnessPopupInfoGoal1 extends MonsterMadnessPopupInfo {
    constructor() {
        super();
    }

    public override getCopy(mode: number): string {
        return mode === MonsterMadnessPopup.MR2 || mode === MonsterMadnessPopup.MR2_AND_INFERNO ? "mm_goal1_desc" : "mm_nomr2_desc";
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupVideo(MonsterMadnessPopupInfo.KOGOTH_SPINNING_VIDEO);
    }

    public override setupButton(button: Button, mode: number): void {
        this.setupCloseButtton(button);
    }
}
