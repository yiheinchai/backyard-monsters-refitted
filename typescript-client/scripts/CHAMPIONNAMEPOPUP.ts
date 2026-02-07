import MouseEvent from 'openfl/events/MouseEvent';
import { GUARDIANNAMEPOPUP_CLIP } from './GUARDIANNAMEPOPUP_CLIP';

// Lazy imports to break circular dependency chains
function getCHAMPIONCAGE(): any { return require("./CHAMPIONCAGE").CHAMPIONCAGE; }
function getCREATURES(): any { return require("./CREATURES").CREATURES; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getBASE(): any { return require("./BASE").BASE; }


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
        const _loc1_: number = getCREATURES()._guardian._type;
        this.mcGuard.gotoAndStop((_loc1_ - 1) * 6 + 1);
        this.tInput.text = getCHAMPIONCAGE()._guardians[_loc1_].description;
        this.bAction.SetupKey("btn_accept");
        this.bAction.addEventListener(MouseEvent.CLICK, this.Accept.bind(this));
        this.bAction.Highlight = false;
        getSOUNDS().Play("levelup");
        if (getCREATURES()._guardian) {
            if (!getCREATURES()._guardian._name) {
                _loc2_ = String(getCHAMPIONCAGE()._guardians["G" + getCREATURES()._guardian._type].name);
                getCREATURES()._guardian._name = _loc2_;
            }
        }
    }

    public Accept(param1: MouseEvent): void {
        if (this.tInput.text.length > 12) {
            getGLOBAL().Message("The name needs to be 12 characters or less.");
            return;
        }
        let _loc2_: string = this.tInput.text;
        if (_loc2_.length < 1) {
            _loc2_ = String(getCHAMPIONCAGE()._guardians["G" + getCREATURES()._guardian._type].name);
            this.tInput.text = _loc2_;
        }
        getCREATURES()._guardian._name = _loc2_;
        getPOPUPS().Next();
        getCHAMPIONCAGE().Hide(null);
        getBASE().Save();
    }

    public Hide(): void {
        const _loc1_: string = String(getCHAMPIONCAGE()._guardians["G" + getCREATURES()._guardian._type].name);
        getCREATURES()._guardian._name = _loc1_;
        getCHAMPIONCAGE().Hide();
    }
}
