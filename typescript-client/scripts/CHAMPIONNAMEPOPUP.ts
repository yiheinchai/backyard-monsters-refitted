import MouseEvent from 'openfl/events/MouseEvent';
import { GUARDIANNAMEPOPUP_CLIP } from './GUARDIANNAMEPOPUP_CLIP';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { POPUPS } from './POPUPS';
import { SOUNDS } from './SOUNDS';
import { BASE } from './BASE';

/**
 * CHAMPIONNAMEPOPUP - Popup for naming a champion
 * Converted from ActionScript to TypeScript
 */
export class CHAMPIONNAMEPOPUP extends GUARDIANNAMEPOPUP_CLIP {
    constructor() {
        super();
        let _loc2_: string = "";
        this.tTitle.htmlText = "<b>" + "CONGRATULATIONS!" + "</b>";
        this.tDescription.htmlText = "<b>" + "You can now start raising your Champion. What will you name him?" + "<b>";
        const _loc1_: number = CREATURES._guardian._type;
        this.mcGuard.gotoAndStop((_loc1_ - 1) * 6 + 1);
        this.tInput.text = CHAMPIONCAGE._guardians[_loc1_].description;
        this.bAction.SetupKey("btn_accept");
        this.bAction.addEventListener(MouseEvent.CLICK, this.Accept.bind(this));
        this.bAction.Highlight = false;
        SOUNDS.Play("levelup");
        if (CREATURES._guardian) {
            if (!CREATURES._guardian._name) {
                _loc2_ = String(CHAMPIONCAGE._guardians["G" + CREATURES._guardian._type].name);
                CREATURES._guardian._name = _loc2_;
            }
        }
    }

    public Accept(param1: MouseEvent): void {
        if (this.tInput.text.length > 12) {
            GLOBAL.Message("The name needs to be 12 characters or less.");
            return;
        }
        let _loc2_: string = this.tInput.text;
        if (_loc2_.length < 1) {
            _loc2_ = String(CHAMPIONCAGE._guardians["G" + CREATURES._guardian._type].name);
            this.tInput.text = _loc2_;
        }
        CREATURES._guardian._name = _loc2_;
        POPUPS.Next();
        CHAMPIONCAGE.Hide(null);
        BASE.Save();
    }

    public Hide(): void {
        const _loc1_: string = String(CHAMPIONCAGE._guardians["G" + CREATURES._guardian._type].name);
        CREATURES._guardian._name = _loc1_;
        CHAMPIONCAGE.Hide();
    }
}
