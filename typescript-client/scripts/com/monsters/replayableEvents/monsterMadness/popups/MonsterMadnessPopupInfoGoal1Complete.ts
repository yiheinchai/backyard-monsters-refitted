import DisplayObject from "openfl/display/DisplayObject";
import MouseEvent from "openfl/events/MouseEvent";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";

import { GLOBAL } from "../../../../../GLOBAL";
import { KEYS } from "../../../../../KEYS";
import { CREATURES } from "../../../../../CREATURES";
import { BUILDINGS } from "../../../../../BUILDINGS";
import { CHAMPIONCHAMBER } from "../../../../../CHAMPIONCHAMBER";
import { CHAMPIONCAGE } from "../../../../../CHAMPIONCAGE";
import { Button } from "../../../../Button";

/**
 * Monster Madness popup info goal 1 complete - displayed when goal 1 is completed.
 */
export class MonsterMadnessPopupInfoGoal1Complete extends MonsterMadnessPopupInfo {
    constructor() {
        super();
        this.isOnlySeenOnce = true;
    }

    protected onClickBrag(event: MouseEvent): void {
        this.ShowBrag("mm_g1_complete", "mm_korathunlocked_streamtitle", "mm_korathunlocked_streambody", MonsterMadnessPopupInfo.KOGOTH_BRAG_IMAGE1);
    }

    public override getCopy(mode: number): string {
        let copy: string;
        if (GLOBAL._bCage) {
            if (CREATURES._guardian) {
                if (GLOBAL._bChamber) {
                    copy = "mm_goal1_completed4";
                } else {
                    copy = "mm_goal1_completed2";
                }
            } else {
                copy = "mm_goal1_completed3";
            }
        } else {
            copy = "mm_goal1_completed1";
        }
        return copy;
    }

    public override getMedia(mode: number): DisplayObject {
        return this.setupVideo(MonsterMadnessPopupInfo.KOGOTH_SPINNING_VIDEO);
    }

    public override setupButton(button: Button, mode: number): void {
        button.Setup(KEYS.Get("btn_brag"));
        button.Highlight = true;
        button.addEventListener(MouseEvent.CLICK, this.onClickBrag.bind(this));
    }

    private buildCage(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.buildCage.bind(this));
        this.close();
        BUILDINGS._buildingID = 114;
        BUILDINGS.Show();
    }

    private buildChamber(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.buildChamber.bind(this));
        this.close();
        BUILDINGS._buildingID = 119;
        BUILDINGS.Show();
    }

    private openChamber(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.openChamber.bind(this));
        this.close();
        CHAMPIONCHAMBER.Show();
    }

    private openCage(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.openCage.bind(this));
        this.close();
        CHAMPIONCAGE.Show();
    }
}
