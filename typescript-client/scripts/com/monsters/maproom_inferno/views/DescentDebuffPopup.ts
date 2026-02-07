import MovieClip from "openfl/display/MovieClip";
import MouseEvent from "openfl/events/MouseEvent";
import TimerEvent from "openfl/events/TimerEvent";
import Timer from "openfl/utils/Timer";

import { descentDebuff_info_CLIP } from "../../../../descentDebuff_info_CLIP";
import { bubblepopupUpBuff_CLIP } from "../../../../bubblepopupUpBuff_CLIP";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getUI2(): any { return require("../../../../UI2").UI2; }



/**
 * DescentDebuffPopup - displays descent/inferno toxicity level and debuff information.
 */
export class DescentDebuffPopup extends descentDebuff_info_CLIP {
    public maxDepth: number = 7;
    public _t: Timer | null = null;
    public currLvl: number = 0;
    public depthTxt: string = "";
    public depthTxt2: string = "";
    public depthFlip: boolean = false;
    public debuffTip: MovieClip | null = null;
    public depthDesc: string = "";
    public depthDesc2: string = "";

    constructor() {
        super();
    }

    public initWithTitleAndButtons(title: string, buttonLabels: Array<string>, buttonCallbacks: Array<Function>): void {
    }

    public setHeightForButtons(height: number): void {
    }

    public setDepth(level: number): void {
        this.currLvl = level;
        switch (this.currLvl) {
            case 7:
                this.depthTxt = getKEYS().Get("descent_depthBar");
                this.depthTxt2 = getKEYS().Get("descent_depthBarWarn1");
                this.depthDesc = getKEYS().Get("inf_descent_toxicity_desc");
                this.depthDesc2 = getKEYS().Get("inf_descent_toxicity_desc_low");
                break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 8:
            default:
                this.depthTxt = getKEYS().Get("descent_depthBar");
                this.depthTxt2 = "";
                this.depthDesc = "";
                this.depthDesc2 = "";
        }
        const pct = 100 / this.maxDepth * level;
        (this.depthBar as any).mcBar.width = Math.max(pct, 1);
        this.DepthCheck();
    }

    public Show(level: number = 0): void {
        this.setDepth(level);
        this.Resize();
        this._t = new Timer(1000);
        this._t.start();
        this._t.addEventListener(TimerEvent.TIMER, this.DepthCheck.bind(this));
        this.addEventListener(MouseEvent.ROLL_OVER, this.DescentDebuffInfoShow.bind(this));
        this.addEventListener(MouseEvent.ROLL_OUT, this.DescentDebuffInfoHide.bind(this));
        getUI2()._top.addChild(this);
    }

    public Hide(): void {
        this._t!.stop();
        this._t!.removeEventListener(TimerEvent.TIMER, this.DepthCheck.bind(this));
        this._t = null;
        if (this.debuffTip) {
            this.DescentDebuffInfoHide(null);
        }
        if (this.parent) {
            this.parent.removeChild(this);
            getUI2()._top._descentDebuff = null;
        }
    }

    public DescentDebuffInfoShow(event: MouseEvent | null = null): void {
        this.debuffTip = new bubblepopupUpBuff_CLIP();
        this.debuffTip.x = -10;
        this.debuffTip.y = this.debuffTip.height + 5;
        (this.debuffTip as any).mcArrow.x = this.debuffTip.width / 2 - 20;
        (this.debuffTip as any).mcText.htmlText = getKEYS().Get("inf_descent_toxicity_help");
        (this.debuffTip as any).mcTextDuration.htmlText = "";
        this.addChild(this.debuffTip);
    }

    public DescentDebuffInfoHide(event: MouseEvent | null = null): void {
        if (Boolean(this.debuffTip) && Boolean(this.debuffTip!.parent)) {
            this.debuffTip!.parent.removeChild(this.debuffTip!);
            this.debuffTip = null;
        }
    }

    public DepthCheck(event: TimerEvent | null = null): void {
        this.depthFlip = !this.depthFlip;
        this.tDepth.htmlText = this.depthTxt;
        this.tDepth2.htmlText = this.depthTxt2;
        this.tDesc.htmlText = "<b>" + this.depthDesc + "<br>" + this.depthDesc2 + "</b>";
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

    public Resize(): void {
        this.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - 160;
        let offset = 0;
        if (getUI2()._top && getUI2()._top.mcSound && getUI2()._top.mcSound.visible) {
            offset = getUI2()._top.mcSound.y + getUI2()._top.mcSound.height;
        }
        this.y = getGLOBAL()._SCREEN.y + offset + 20;
    }
}
