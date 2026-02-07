import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import MouseEvent from "openfl/events/MouseEvent";
import Keyboard from "openfl/ui/Keyboard";

import { EnumYardType } from "../../enums/EnumYardType";
import { IMapRoomCell } from "../../maproom_manager/IMapRoomCell";
import { MapRoomPopupJump } from "../../../../MapRoomPopupJump";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }



/**
 * Maproom 3 jump popup - allows jumping to specific map coordinates.
 */
export class Maproom3JumpPopup extends MapRoomPopupJump {
    public static readonly k_clickedJump: string = "clickedJumpButton";

    public targetCell: IMapRoomCell | null = null;

    constructor() {
        super();
        this.addEventListener(Event.ADDED_TO_STAGE, this.addedToStage.bind(this));
    }

    protected addedToStage(event: Event): void {
        this.removeEventListener(Event.ADDED_TO_STAGE, this.addedToStage.bind(this));
        this.tMessage.htmlText = getKEYS().Get("label_jumptolocation");
        this.tX.htmlText = "";
        this.tX.addEventListener(KeyboardEvent.KEY_UP, this.keyUpOnX.bind(this));
        this.tY.htmlText = "";
        this.tY.addEventListener(KeyboardEvent.KEY_UP, this.keyUpOnY.bind(this));
        this.bJump.SetupKey("btn_jump");
        this.bJump.addEventListener(MouseEvent.CLICK, this.clickedJump.bind(this));
        this.mcFrame.Setup(true);
        this.stage.focus = this.tX;
    }

    protected keyUpOnY(event: KeyboardEvent): void {
        const keyCode: number = event.keyCode;
        if (keyCode === Keyboard.NUMPAD_ENTER || keyCode === Keyboard.ENTER) {
            this.clickedJump();
        }
    }

    protected keyUpOnX(event: KeyboardEvent): void {
        const keyCode: number = event.keyCode;
        // No action currently defined
    }

    protected clickedJump(event: MouseEvent | null = null): void {
        this.targetCell = getMapRoomManager().instance.FindCell(parseInt(this.tX.text), parseInt(this.tY.text));
        if (!this.targetCell || this.targetCell.baseType === EnumYardType.BORDER) {
            getGLOBAL().Message(getKEYS().Get("map_coordinateoffmap"));
            return;
        }
        this.dispatchEvent(new Event(Maproom3JumpPopup.k_clickedJump));
    }

    public Hide(): void {
        this.tX.removeEventListener(KeyboardEvent.KEY_UP, this.keyUpOnX.bind(this));
        this.tY.removeEventListener(KeyboardEvent.KEY_UP, this.keyUpOnY.bind(this));
        this.bJump.removeEventListener(MouseEvent.CLICK, this.clickedJump.bind(this));
        getPOPUPS().Next();
    }
}
