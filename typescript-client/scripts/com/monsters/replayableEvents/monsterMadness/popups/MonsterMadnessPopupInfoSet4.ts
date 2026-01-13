import DisplayObject from "openfl/display/DisplayObject";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";
import { MonsterMadnessPopup } from "./MonsterMadnessPopup";

import { Button } from "../../../../../Button";

/**
 * Monster Madness popup info set 4 - fourth set of popup info.
 */
export class MonsterMadnessPopupInfoSet4 extends MonsterMadnessPopupInfo {
    constructor() {
        super();
    }

    public override getCopy(mode: number): string {
        let copy: string;
        switch (mode) {
            case MonsterMadnessPopup.MR2_AND_INFERNO:
                copy = "mm_pop_both4";
                break;
            case MonsterMadnessPopup.MR2:
                copy = "mm_pop_mronly4";
                break;
            case MonsterMadnessPopup.INFERNO:
                copy = "mm_pop_infonly4";
                break;
            case MonsterMadnessPopup.TOWNHALL_GREATER_THAN_5:
                copy = "mm_pop_neitherclose4";
                break;
            case MonsterMadnessPopup.TOWNHALL_LESS_THAN_5:
                copy = "mm_pop_neither4";
                break;
            default:
                copy = "invalid userstate";
        }
        return copy;
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupImage("specialevent/monstermadness/pop_four_epic.png");
    }

    public override setupButton(button: Button, mode: number): void {
        if (mode === MonsterMadnessPopup.MR2 || mode === MonsterMadnessPopup.MR2_AND_INFERNO) {
            this.setupMapButtton(button);
        } else if (mode === MonsterMadnessPopup.INFERNO || mode === MonsterMadnessPopup.TOWNHALL_GREATER_THAN_5) {
            this.setupUpgradeButton(button);
        } else {
            button.visible = false;
        }
    }
}
