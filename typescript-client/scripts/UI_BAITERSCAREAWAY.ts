import { Event } from 'openfl/events/Event';
import { MouseEvent } from 'openfl/events/MouseEvent';
import { UI_BAITERSCAREAWAY_CLIP } from './UI_BAITERSCAREAWAY_CLIP';
import { SPECIALEVENT } from './SPECIALEVENT';
import { GLOBAL } from './GLOBAL';

export class UI_BAITERSCAREAWAY extends UI_BAITERSCAREAWAY_CLIP {
    constructor(param1: boolean = true) {
        super();
        if (param1) {
            this.bReturn.SetupKey("bait_scareaway");
        } else {
            this.bReturn.SetupKey("wmi_surrenderbtn");
        }
        const activeEvent = SPECIALEVENT.getActiveSpecialEvent();
        if (activeEvent.active) {
            this.bReturn.SetupKey("wmi_surrenderbtn");
        }
        this.bReturn.addEventListener(MouseEvent.CLICK, this.onReturnDown.bind(this));
    }

    private onReturnDown(param1: MouseEvent): void {
        const activeEvent = SPECIALEVENT.getActiveSpecialEvent();
        const _loc2_ = activeEvent.active;
        if (_loc2_) {
            activeEvent.Surrender();
            return;
        }
        this.dispatchEvent(new Event("scareAway"));
    }

    public Resize(): void {
        GLOBAL.RefreshScreen();
        this.x = GLOBAL._SCREEN.x + GLOBAL._SCREEN.width - this.mcBG.width - 10;
        this.y = GLOBAL._SCREENHUD.y - (this.mcBG.height + 10);
    }
}
