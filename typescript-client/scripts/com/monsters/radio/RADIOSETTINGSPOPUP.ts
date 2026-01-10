import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { RADIO } from "./RADIO";

import { GLOBAL } from "../../../GLOBAL";
import { KEYS } from "../../../KEYS";
import { LOGIN } from "../../../LOGIN";
import { POPUPSETTINGS } from "../../../POPUPSETTINGS";

// Declare external clip and component classes
declare class RADIOSETTINGSPOPUP_CLIP extends Sprite {
    cbNews: any;
    cbAttack: any;
    cbProxy: any;
    bSave: any;
    tTitle: any;
    tNews: any;
    tAttack: any;
    tEmail: any;
    tEmailInput: any;
    tDesc: any;
    tProxy: any;
}

declare class Checkbox extends Sprite {
    static Replace(cb: any): Checkbox;
    selected: boolean;
    fromInt(val: number): void;
    toInt(): number;
    deselect(): void;
    select(): void;
    Update(): void;
    onClick(event: MouseEvent): void;
    onUp(event: MouseEvent): void;
}

/**
 * Radio settings popup for email notification preferences.
 */
export class RADIOSETTINGSPOPUP extends RADIOSETTINGSPOPUP_CLIP {
    public _changed: boolean = false;
    private _notifyNews: boolean = false;
    private _notifyAttack: boolean = false;
    private _emailAddress: string = "";
    private _emailSettings: { [key: string]: any } = {};
    private _isSaving: boolean = false;

    constructor() {
        super();
        this._emailAddress = KEYS.Get("radio_insertemail");
        this.addEventListener(Event.ADDED_TO_STAGE, this.onAdded.bind(this));
        
        if (RADIO._settings) {
            this._emailSettings = RADIO._settings;
        } else {
            this._emailSettings = {};
        }
    }

    private onAdded(event: Event): void {
        this.removeEventListener(event.type, this.onAdded.bind(this));
        
        this.cbNews = (Checkbox as any).Replace(this.cbNews);
        this.cbAttack = (Checkbox as any).Replace(this.cbAttack);
        
        this.bSave.addEventListener(MouseEvent.CLICK, this.onButtonClick.bind(this));
        this.bSave.SetupKey("radio_bSave");
        
        this.tTitle.htmlText = KEYS.Get("radio_tTitle");
        this.tNews.htmlText = KEYS.Get("radio_cbNews");
        this.tAttack.htmlText = KEYS.Get("radio_cbAttack");
        this.tEmail.htmlText = KEYS.Get("radio_tEmail");
        this.tEmailInput.htmlText = '<font color="#444444">' + KEYS.Get("radio_tfEmail") + '</font>';
        this.tDesc.htmlText = KEYS.Get("radio_desc");
        
        this.tEmailInput.addEventListener(Event.CHANGE, this.onEmailChange.bind(this));
        this.tEmailInput.addEventListener(MouseEvent.CLICK, this.onEmailClear.bind(this));
        
        this.cbProxy.visible = false;
        this.tProxy.visible = false;
        
        this.init();
    }

    private init(): void {
        const settings = RADIO.getProp("o1");
        
        if (settings) {
            (this.cbNews as Checkbox).fromInt(settings[RADIO.NEWS_KEY]);
            (this.cbAttack as Checkbox).fromInt(settings[RADIO.ATTACK_KEY]);
            
            if (settings[RADIO.ADDRESS_KEY]) {
                this.tEmailInput.htmlText = String(settings[RADIO.ADDRESS_KEY]);
            } else if (LOGIN._email && LOGIN._email !== LOGIN._proxymail) {
                this.tEmailInput.htmlText = LOGIN._email;
            } else {
                this.tEmailInput.htmlText = '<font color="#444444">' + KEYS.Get("radio_tfEmail") + '</font>';
            }
        } else {
            (this.cbNews as Checkbox).deselect();
            (this.cbAttack as Checkbox).deselect();
            
            if (LOGIN._email && LOGIN._email !== LOGIN._proxymail) {
                this.tEmailInput.htmlText = LOGIN._email;
            } else {
                this.tEmailInput.htmlText = '<font color="#444444">' + KEYS.Get("radio_tfEmail") + '</font>';
            }
        }
        
        const cbNewsTyped = this.cbNews as Checkbox;
        const cbAttackTyped = this.cbAttack as Checkbox;
        
        cbNewsTyped.removeEventListener(MouseEvent.MOUSE_UP, cbNewsTyped.onUp);
        cbNewsTyped.addEventListener(MouseEvent.MOUSE_UP, this.onCBUp.bind(this));
        
        cbAttackTyped.removeEventListener(MouseEvent.MOUSE_UP, cbAttackTyped.onUp);
        cbAttackTyped.addEventListener(MouseEvent.MOUSE_UP, this.onCBUp.bind(this));
        
        cbNewsTyped.Update();
        cbAttackTyped.Update();
    }

    private onButtonClick(event: MouseEvent): void {
        const buttonName = String((event.currentTarget as any).name);
        
        switch (buttonName) {
            case "bSave":
                let valid = true;
                const cbNewsTyped = this.cbNews as Checkbox;
                const cbAttackTyped = this.cbAttack as Checkbox;
                
                if (cbNewsTyped.selected || cbAttackTyped.selected) {
                    valid = valid && this.tEmailInput.text.lastIndexOf("@") !== -1;
                    valid = valid && this.tEmailInput.text.lastIndexOf(".") !== -1;
                }
                
                if (valid) {
                    const obj: { [key: string]: any } = {};
                    obj[RADIO.ATTACK_KEY] = cbAttackTyped.toInt();
                    obj[RADIO.NEWS_KEY] = cbNewsTyped.toInt();
                    obj[RADIO.ADDRESS_KEY] = this.tEmailInput.text;
                    
                    if (!cbNewsTyped.selected && !cbAttackTyped.selected) {
                        GLOBAL.Message(
                            KEYS.Get("radio_noSubscribe"),
                            KEYS.Get("radio_noSubscribeY"),
                            this.SaveConfirmCB.bind(this),
                            ["o1", obj],
                            KEYS.Get("radio_noSubscribeN"),
                            null,
                            null
                        );
                    } else if (!RADIO._isSaving) {
                        RADIO.setProp("o1", obj);
                        this._changed = false;
                    }
                } else {
                    GLOBAL.Message(KEYS.Get("radio_enterValidEmail"));
                }
                break;
        }
    }

    private SaveConfirmCB(key: string, obj: any): void {
        if (!RADIO._isSaving) {
            RADIO.setProp(key, obj);
            this._changed = false;
        }
    }

    public bSaveToggle(reset: boolean = false): void {
        if (reset) {
            RADIO._isSaving = false;
        }
        
        if (!RADIO._isSaving) {
            this.bSave.SetupKey("radio_bSave");
            this.bSave.enabled = true;
            this.bSave.mouseEnabled = true;
        } else {
            this.bSave.SetupKey("radio_bSaving");
            this.bSave.enabled = false;
            this.bSave.mouseEnabled = false;
        }
    }

    private onCBClick(event: MouseEvent): void {
        (event.currentTarget as Checkbox).onClick(event);
        this.stage.focus = null;
        this._changed = true;
    }

    private onCBUp(event: MouseEvent): void {
        (event.currentTarget as Checkbox).onUp(event);
        this.stage.focus = null;
        this._changed = true;
    }

    private onEmailChange(event: Event): void {
        this._changed = true;
    }

    private onEmailClear(event: Event): void {
        this.tEmailInput.htmlText = "";
        this.stage.focus = this.tEmailInput;
        this.tEmailInput.removeEventListener(MouseEvent.CLICK, this.onEmailClear.bind(this));
    }

    public Hide(): void {
        const cbNewsTyped = this.cbNews as Checkbox;
        const cbAttackTyped = this.cbAttack as Checkbox;
        
        if (this._changed) {
            GLOBAL.Message(KEYS.Get("radio_unsavedChanges"), KEYS.Get("radio_abandonChanges"), RADIO.Hide);
        } else if (!cbNewsTyped.selected && !cbAttackTyped.selected) {
            GLOBAL.Message(
                KEYS.Get("radio_noSubscribe"),
                KEYS.Get("radio_noSubscribeY"),
                RADIO.Hide,
                null,
                KEYS.Get("radio_noSubscribeN"),
                null,
                null
            );
        } else {
            RADIO.Hide();
        }
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
