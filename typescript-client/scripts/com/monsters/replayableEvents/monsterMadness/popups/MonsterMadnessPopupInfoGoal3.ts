import DisplayObject from "openfl/display/DisplayObject";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";

import { Button } from "../../../../../Button";

/**
 * Monster Madness popup info for goal 3.
 */
export class MonsterMadnessPopupInfoGoal3 extends MonsterMadnessPopupInfo {
    constructor() {
        super();
    }

    public override getCopy(mode: number): string {
        return "mm_goal3_desc";
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupVideo(MonsterMadnessPopupInfo.KOGOTH_SPINNING_STOMP_VIDEO);
    }

    public override setupButton(button: Button, mode: number): void {
        this.setupCloseButtton(button);
    }
}
