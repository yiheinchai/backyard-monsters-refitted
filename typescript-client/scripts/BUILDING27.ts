import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BFOUNDATION } from './BFOUNDATION';
import { CUSTOMATTACKS } from './CUSTOMATTACKS';
import { INFERNO_EMERGENCE_EVENT } from './INFERNO_EMERGENCE_EVENT';

// Lazy imports to break circular dependency chains
function getBASE(): any { return require("./BASE").BASE; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGIN(): any { return require("./LOGIN").LOGIN; }
function getMAP(): any { return require("./MAP").MAP; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }
function getSPECIALEVENT(): any { return require("./SPECIALEVENT").SPECIALEVENT; }
function getUI2(): any { return require("./UI2").UI2; }
function getWMATTACK(): any { return require("./WMATTACK").WMATTACK; }


/**
 * BUILDING27 - Trojan Horse
 * Extends BFOUNDATION for the special trojan horse attack building
 */
export class BUILDING27 extends BFOUNDATION {
    public static _exists: boolean = false;
    
    public _spewNumber: number = 0;
    public _stage: number = 0;
    public _spewed: boolean = false;
    public _clicked: boolean = false;

    constructor() {
        super();
        this._type = 27;
        this._footprint = [new Rectangle(0, 0, 140, 140)];
        this._gridCost = [[new Rectangle(0, 0, 140, 140), 200]];
        BUILDING27._exists = true;
        this.SetProps();
        if (getGLOBAL().mode !== "wmattack" && getGLOBAL().mode !== "wmview") {
            this.Render();
        }
    }

    protected popupRemoveFromStage(event: Event): void {
        if (this._spewed === true) {
            return;
        }
        this._clicked = false;
    }

    public Spew(event: Event | null = null): void {
        ++this._spewNumber;
        const baseValue: number = getBASE()._basePoints + getBASE()._baseValue;
        let scale: number = 0.4;
        if (baseValue > 3000000) {
            scale = 0.6;
        }
        if (baseValue > 5000000) {
            scale = 0.8;
        }
        if (baseValue > 8000000) {
            scale = 1;
        }
        if (this._spewNumber === 1 || this._spewNumber % 20 === 0) {
            const creatureLevel: number = Math.ceil(this._spewNumber / 100);
            if (creatureLevel === 5 || creatureLevel > 11) {
                return;
            }
            this._animTick = 1;
            this.AnimFrame();
            getSOUNDS().Play("bankland");
            getCREEPS().Spawn("C" + creatureLevel, getMAP()._BUILDINGTOPS, "bounce", new Point(this._mc!.x - 80, this._mc!.y + 108), Math.random() * 360, scale);
        } else if (this._spewNumber % 10 === 0) {
            this._animTick = 0;
            this.AnimFrame();
        }
        if (this._spewNumber >= 1110) {
            this._mc!.removeEventListener(Event.ENTER_FRAME, this.Spew);
        }
    }

    public StartAttack(event: MouseEvent | null = null): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            if (!this._spewed) {
                if (getBASE().isInfernoMainYardOrOutpost) {
                    getSOUNDS().PlayMusic("musicipanic");
                } else {
                    getSOUNDS().PlayMusic("musicpanic");
                }
                this._spewed = true;
                getPOPUPS().Next();
                getUI2().Show("warning");
                getUI2()._warning.Update(getKEYS().Get("ai_trojan_trap"));
                this._mc!.addEventListener(Event.ENTER_FRAME, this.Spew.bind(this));
                this.Spew();
                CUSTOMATTACKS._started = true;
                getWMATTACK()._isAI = false;
                getWMATTACK()._inProgress = true;
                getWMATTACK().AttackB();
                getWMATTACK().AttackC();
                getWMATTACK().ResetWait();
            }
        }
    }

    public override Click(event: MouseEvent | null = null): void {
        if (getGLOBAL().mode === getGLOBAL().e_BASE_MODE.BUILD) {
            const activeEvent: any = getSPECIALEVENT().getActiveSpecialEvent();
            if (activeEvent.active) {
                return;
            }
            if (INFERNO_EMERGENCE_EVENT.isAttackActive) {
                return;
            }
            if (!this._clicked) {
                CUSTOMATTACKS._started = true;
                this._clicked = true;
                const mc: any = new (GLOBAL as any).popup_horse();
                mc.tA.htmlText = `<b>${getKEYS().Get("ai_trojan_headline")}</b>`;
                mc.tName.htmlText = getKEYS().Get("ai_trojan_letter", { v1: getLOGIN()._playerName });
                mc.bA.SetupKey("ai_trojan_sendback_btn");
                mc.bA.addEventListener(MouseEvent.CLICK, this.StartAttack.bind(this), false, 0, true);
                mc.bB.SetupKey("ai_trojan_accept_btn");
                mc.bB.addEventListener(MouseEvent.CLICK, this.StartAttack.bind(this), false, 0, true);
                mc.addEventListener(Event.REMOVED_FROM_STAGE, this.popupRemoveFromStage.bind(this), false, 0, true);
                getPOPUPS().Push(mc);
            }
        }
    }

    public override get tickLimit(): number {
        return Number.MAX_SAFE_INTEGER;
    }

    public override Tick(seconds: number): void {
        // Empty override - trojan horse doesn't tick
    }

    public override Update(force: boolean = false): void {
        // Empty override - trojan horse doesn't update normally
    }

    public override Export(): any {
        const data: any = super.Export();
        if (!this._spewed) {
            return data;
        }
        return false;
    }
}
