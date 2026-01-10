import DisplayObject from "openfl/display/DisplayObject";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";

import { Button } from "../../../../Button";

/**
 * Monster Madness popup info for event complete.
 */
export class MonsterMadnessPopupInfoEventComplete extends MonsterMadnessPopupInfo {
    constructor() {
        super();
    }

    public override getCopy(mode: number): string {
        return "mm_goal3_completed2";
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupVideo(MonsterMadnessPopupInfo.KOGOTH_SPINNING_STOMP_VIDEO);
    }

    public override setupButton(button: Button, mode: number): void {
        this.setupCloseButtton(button);
    }
}
