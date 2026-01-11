import DisplayObject from "openfl/display/DisplayObject";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";

import { Button } from "../../../../../Button";

/**
 * Monster Madness popup info for goal 2.
 */
export class MonsterMadnessPopupInfoGoal2 extends MonsterMadnessPopupInfo {
    constructor() {
        super();
    }

    public override getCopy(mode: number): string {
        return "mm_goal2_desc";
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupVideo(MonsterMadnessPopupInfo.KOGOTH_SPINNING_FIREBALL_VIDEO);
    }

    public override setupButton(button: Button, mode: number): void {
        this.setupCloseButtton(button);
    }
}
