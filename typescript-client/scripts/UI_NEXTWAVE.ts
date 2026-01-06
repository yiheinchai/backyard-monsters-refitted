import { MovieClip } from 'openfl/display/MovieClip';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { UI_BOTTOM } from './com/monsters/ui/UI_BOTTOM';
import { bubblepopupDownBuff } from './bubblepopupDownBuff';
import { NEXTWAVEBAR_CLIP } from './NEXTWAVEBAR_CLIP';
import { BASE } from './BASE';
import { GLOBAL } from './GLOBAL';
import { KEYS } from './KEYS';
import { SPECIALEVENT } from './SPECIALEVENT';
import { TUTORIAL } from './TUTORIAL';

export class UI_NEXTWAVE extends NEXTWAVEBAR_CLIP {
    private _popupWaveInfo: bubblepopupDownBuff;

    constructor() {
        super();
    }

    public static ShouldDisplay(): boolean {
        if (GLOBAL.mode !== GLOBAL.e_BASE_MODE.BUILD) {
            return false;
        }
        if (!BASE.isMainYard) {
            return false;
        }
        if (TUTORIAL._stage < TUTORIAL._endstage) {
            return false;
        }
        if (!SPECIALEVENT.EventActive()) {
            return false;
        }
        if (SPECIALEVENT.wave > SPECIALEVENT.numWaves) {
            return false;
        }
        if (SPECIALEVENT.active) {
            return false;
        }
        return true;
    }

    private static OnBarClicked(param1: MouseEvent): void {
        SPECIALEVENT.StartRound();
    }

    public Setup(): void {
        SPECIALEVENT.Setup();
        this.mcHit.addEventListener(MouseEvent.CLICK, UI_NEXTWAVE.OnBarClicked);
        this.mcHit.addEventListener(MouseEvent.ROLL_OVER, this.WaveShow.bind(this));
        this.mcHit.addEventListener(MouseEvent.ROLL_OUT, this.WaveHide.bind(this));
        this.mcHit.buttonMode = true;
        this.mcHit.mouseChildren = false;
        this.SetWave(SPECIALEVENT.wave);
        this.Resize();
    }

    public Resize(): void {
        if (UI_BOTTOM._mc) {
            this.x = UI_BOTTOM._mc.x + UI_BOTTOM._mc.width - this.mcHit.width;
            this.y = UI_BOTTOM._mc.y - this.mcHit.height;
        }
    }

    public WaveShow(param1: MouseEvent): void {
        if (SPECIALEVENT.wave >= SPECIALEVENT.EVENTEND) {
            return;
        }
        const _loc2_ = param1.currentTarget as MovieClip;
        const _loc3_ = String(SPECIALEVENT.WAVES_DESC[SPECIALEVENT.wave - 1]);
        const _loc4_ = "";
        if (!this._popupWaveInfo) {
            const _loc7_ = new bubblepopupDownBuff();
            this._popupWaveInfo = this.addChild(_loc7_) as bubblepopupDownBuff;
            _loc7_.Setup(_loc2_.x + _loc2_.width / 2, _loc2_.y + _loc2_.height + 4, _loc3_, _loc4_);
            _loc7_.x = 20;
            _loc7_.y = -20;
            _loc7_.mcArrow.x = 30;
        } else {
            (this._popupWaveInfo as bubblepopupDownBuff).Update(_loc3_, _loc4_);
        }
    }

    public WaveHide(param1: MouseEvent): void {
        if (this._popupWaveInfo) {
            this.removeChild(this._popupWaveInfo);
            this._popupWaveInfo = null;
        }
    }

    public SetWave(param1: number): void {
        if (param1 > SPECIALEVENT.numWaves) {
            this.visible = false;
            return;
        }
        if (this.visible == false && UI_NEXTWAVE.ShouldDisplay()) {
            this.visible = true;
        }
        if (param1 == 31) {
            this.tR.htmlText = KEYS.Get("wmi_bonuswave");
        } else if (param1 == 32) {
            this.tR.htmlText = KEYS.Get("wmi_bonuswave2");
        } else {
            this.tR.htmlText = KEYS.Get("wmi_nextwave", { "v1": param1 });
        }
    }
}
