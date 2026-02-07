import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import { UI_BAITERSCAREAWAY_CLIP } from './UI_BAITERSCAREAWAY_CLIP';

// Lazy imports to break circular dependency chains
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }


export class UI_BAITERSCAREAWAY extends UI_BAITERSCAREAWAY_CLIP {
    constructor(param1: boolean = true) {
        super();
        if (param1) {
            this.bReturn.SetupKey("bait_scareaway");
        } else {
            this.bReturn.SetupKey("wmi_surrenderbtn");
        }
        const activeEvent = getSPECIALEVENT().getActiveSpecialEvent();
        if (activeEvent.active) {
            this.bReturn.SetupKey("wmi_surrenderbtn");
        }
        this.bReturn.addEventListener(MouseEvent.CLICK, this.onReturnDown.bind(this));
    }

    private onReturnDown(param1: MouseEvent): void {
        const activeEvent = getSPECIALEVENT().getActiveSpecialEvent();
        const _loc2_ = activeEvent.active;
        if (_loc2_) {
            activeEvent.Surrender();
            return;
        }
        this.dispatchEvent(new Event("scareAway"));
    }

    public Resize(): void {
        getGLOBAL().RefreshScreen();
        this.x = getGLOBAL()._SCREEN.x + getGLOBAL()._SCREEN.width - this.mcBG.width - 10;
        this.y = getGLOBAL()._SCREENHUD.y - (this.mcBG.height + 10);
    }
}
