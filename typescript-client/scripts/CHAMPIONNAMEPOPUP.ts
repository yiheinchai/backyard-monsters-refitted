import { GUARDIANNAMEPOPUP_CLIP } from './GUARDIANNAMEPOPUP_CLIP';
import { CHAMPIONCAGE } from './CHAMPIONCAGE';
import { POPUPS } from './POPUPS'; // Stub needed or imported
import { BASE } from './BASE';
import { SOUNDS } from './SOUNDS';
import { GLOBAL } from './GLOBAL';
import MouseEvent from 'openfl/events/MouseEvent';

// Local stubs
class CREATURES {
    public static _guardian: any = { _type: 1, _name: "" };
}

export class CHAMPIONNAMEPOPUP extends GUARDIANNAMEPOPUP_CLIP {
    constructor() {
        super();
        // Setup logic stubbed
        this.bAction.addEventListener(MouseEvent.CLICK, this.Accept);
    }

    public Accept(param1: MouseEvent): void {
        if (this.tInput.text.length > 12) {
            // GLOBAL.Message("Name too long");
            return;
        }
        let name = this.tInput.text;
        if (name.length < 1) {
            name = "Default"; // Stub
        }
        if (CREATURES._guardian) {
            CREATURES._guardian._name = name;
        }
        // POPUPS.Next();
        CHAMPIONCAGE.Hide(null);
        BASE.Save();
    }

    public Hide(): void {
        CHAMPIONCAGE.Hide();
    }
}
