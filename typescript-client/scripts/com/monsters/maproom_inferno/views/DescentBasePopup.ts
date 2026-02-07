import Timer from "openfl/utils/Timer";
import TimerEvent from "openfl/events/TimerEvent";
import { TweenLite, Elastic } from "gs/TweenLite";

import { DescentBasePopup_CLIP } from "./DescentBasePopup_CLIP";

// Lazy imports to break circular dependency chains
function getKEYS(): any { return require("../../../../KEYS").KEYS; }



/**
 * Descent base popup - displays depth bar and current level info.
 */
export class DescentBasePopup extends DescentBasePopup_CLIP {
    public maxDepth: number = 13; // Set this to 13, we are no longer using the "new" 7base
    // public maxDepth: number = 7;

    public _t: Timer | null = null;
    public currLvl: number = 0;
    public depthTxt: string = "";
    public depthTxt2: string = "";
    public depthFlip: boolean = false;

    constructor() {
        super();
    }

    public initWithTitleAndButtons(title: string, buttons: Array<any>, callbacks: Array<any>): void {
    }

    public setHeightForButtons(count: number): void {
    }

    public setDepth(level: number): void {
        this.currLvl = level;
        /* We have to re-arrange the order of levels so the depth bar actually does something. */
        switch (this.currLvl) {
            case 9:
            case 10:
                this.depthTxt = getKEYS().Get("descent_depthBar");
                this.depthTxt2 = getKEYS().Get("descent_depthBarWarn1");
                break;
            case 11:
            case 12:
                this.depthTxt = getKEYS().Get("descent_depthBar");
                this.depthTxt2 = getKEYS().Get("descent_depthBarWarn2");
                break;
            case 13:
                this.depthTxt = getKEYS().Get("descent_depthBar");
                this.depthTxt2 = getKEYS().Get("descent_depthBarWarn3");
            // Fall-through intentional
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            default:
                this.depthTxt = getKEYS().Get("descent_depthBar");
                this.depthTxt2 = "";
        }
        const barWidth: number = 100 / this.maxDepth * level;
        (this.depthBar as any).mcBar.width = Math.max(barWidth, 1);
        this.DepthCheck();
    }

    // ----------- OLD IMPLEMENTATION ----------- //
    // Comment: March 2012 pre-patch 7 Descent base co-ordinates

    public Show(level: number = 0, posX: number = 0, posY: number = 0): void {
        this.setDepth(level);
        if (posX !== 0 || posY !== 0) {
            this.x = posX;
            this.y = posY;
        }
        const targetX: number = this.x;
        this.x -= 15;
        TweenLite.to(this, 0.6, {
            "x": targetX,
            "ease": Elastic.easeOut
        });
        this._t = new Timer(1000);
        this._t.start();
        this._t.addEventListener(TimerEvent.TIMER, this.DepthCheck.bind(this));
    }

    public Hide(): void {
        this._t!.stop();
        this._t!.removeEventListener(TimerEvent.TIMER, this.DepthCheck.bind(this));
        this._t = null;
    }

    public DepthCheck(event: TimerEvent | null = null): void {
        this.depthFlip = !this.depthFlip;
        this.tDepth.htmlText = this.depthTxt;
        this.tDepth2.htmlText = this.depthTxt2;
        if (this.depthFlip) {
            this.tDepth.visible = true;
            this.tDepth2.visible = false;
            if (this.currLvl <= 8) {
                this.tDepth.visible = true;
                this.tDepth2.visible = true;
            }
        } else {
            this.tDepth.visible = false;
            this.tDepth2.visible = true;
            if (this.currLvl <= 8) {
                this.tDepth.visible = true;
                this.tDepth2.visible = true;
            }
        }
    }
}
