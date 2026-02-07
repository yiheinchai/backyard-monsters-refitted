import DisplayObject from "openfl/display/DisplayObject";
import MouseEvent from "openfl/events/MouseEvent";

import { MonsterMadnessPopupInfo } from "./MonsterMadnessPopupInfo";

import { Button } from "../../../../../Button";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../../KEYS").KEYS; }
function getCREATURES(): any { return require("../../../../../CREATURES").CREATURES; }
function getBUILDINGS(): any { return require("../../../../../BUILDINGS").BUILDINGS; }
function getCHAMPIONCHAMBER(): any { return require("../../../../../CHAMPIONCHAMBER").CHAMPIONCHAMBER; }
function getCHAMPIONCAGE(): any { return require("../../../../../CHAMPIONCAGE").CHAMPIONCAGE; }


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
        if (getGLOBAL()._bCage) {
            if (getCREATURES()._guardian) {
                if (getGLOBAL()._bChamber) {
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
        button.Setup(getKEYS().Get("btn_brag"));
        button.Highlight = true;
        button.addEventListener(MouseEvent.CLICK, this.onClickBrag.bind(this));
    }

    private buildCage(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.buildCage.bind(this));
        this.close();
        getBUILDINGS()._buildingID = 114;
        getBUILDINGS().Show();
    }

    private buildChamber(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.buildChamber.bind(this));
        this.close();
        getBUILDINGS()._buildingID = 119;
        getBUILDINGS().Show();
    }

    private openChamber(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.openChamber.bind(this));
        this.close();
        getCHAMPIONCHAMBER().Show();
    }

    private openCage(event: MouseEvent): void {
        (event.target as any).removeEventListener(MouseEvent.CLICK, this.openCage.bind(this));
        this.close();
        getCHAMPIONCAGE().Show();
    }
}
