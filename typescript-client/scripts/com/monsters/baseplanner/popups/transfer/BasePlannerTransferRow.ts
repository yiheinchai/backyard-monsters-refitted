import Event from "openfl/events/Event";
import KeyboardEvent from "openfl/events/KeyboardEvent";
import MouseEvent from "openfl/events/MouseEvent";
import ColorTransform from "openfl/geom/ColorTransform";
import TextFieldType from "openfl/text/TextFieldType";
import Keyboard from "openfl/ui/Keyboard";

import { BaseTemplate } from "../../../BaseTemplate";
import { SubscriptionHandler } from "../../../../subscriptions/SubscriptionHandler";
import { BasePlannerTransferPopup } from "./BasePlannerTransferPopup";
import { BasePlannerTransferRow_CLIP } from "./BasePlannerTransferRow_CLIP";

import { KEYS } from "../../../../../KEYS";

/**
 * Base planner transfer row - individual slot row in save/load popup.
 */
export class BasePlannerTransferRow extends BasePlannerTransferRow_CLIP {
    public slot: number;
    public template: BaseTemplate | null;
    private _isEditing: boolean = false;
    private readonly _DEFAULT_SLOT_NAME: string = "<Empty>";

    constructor(template: BaseTemplate | null, slotIndex: number) {
        super();
        this.template = template;
        this.slot = slotIndex;
        this.tSlotName.htmlText = KEYS.Get("basePlanner_slot_label", { "v1": String(slotIndex + 1) });
        this.tTemplateName.multiline = false;
        this.mcLock.visible = false;
        this.bTransfer.addEventListener(MouseEvent.CLICK, this.clickedTransfer.bind(this), false, 0, true);
        this.tTemplateName.maxChars = 15;
        this.tTemplateName.addEventListener(MouseEvent.CLICK, this.clickedEdit.bind(this), false, 0, true);
        this.tTemplateName.addEventListener(MouseEvent.MOUSE_OVER, this.rollOverName.bind(this), false, 0, true);
        this.tTemplateName.addEventListener(MouseEvent.MOUSE_OUT, this.rollOutName.bind(this), false, 0, true);
        this.tTemplateName.addEventListener(KeyboardEvent.KEY_DOWN, this.pressedEnterOnName.bind(this), false, 0, true);
        this.addEventListener(Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this), false, 0, true);
        if (template) {
            this.tTemplateName.htmlText = template.name;
        } else {
            this.tTemplateName.htmlText = KEYS.Get("basePlanner_layoutname", { "v1": (slotIndex + 1).toString() });
        }
        this.mcEdit.visible = false;
    }

    public set canEdit(value: boolean) {
        this.tTemplateName.removeEventListener(MouseEvent.CLICK, this.clickedEdit.bind(this));
        this.mcEdit.visible = false;
    }

    protected rollOutName(event: MouseEvent): void {
        this.mcEdit.gotoAndStop("disabled");
    }

    protected rollOverName(event: MouseEvent): void {
        this.mcEdit.gotoAndStop("enabled");
    }

    protected pressedEnterOnName(event: KeyboardEvent): void {
        if (event.keyCode === Keyboard.ENTER) {
            this.clickedTransfer(null);
        }
    }

    public set isEditing(value: boolean) {
        if (value === this._isEditing) {
            return;
        }
        if (value) {
            this.tTemplateName.type = TextFieldType.INPUT;
            this.tTemplateName.selectable = true;
            this.tTemplateName.setSelection(0, this.tTemplateName.text.length);
        } else {
            this.tTemplateName.type = TextFieldType.DYNAMIC;
            this.tTemplateName.selectable = false;
        }
        this._isEditing = value;
    }

    public disable(showLock: boolean = true): void {
        this.mouseChildren = false;
        this.bTransfer.visible = false;
        this.tTemplateName.htmlText = "<font color=\"#333333\">" + KEYS.Get("basePlanner_layoutname", { "v1": (this.slot + 1).toString() }) + "</font>";
        this.tSlotName.htmlText = "<font color=\"#AAAAAA\">" + KEYS.Get("basePlanner_slot_label", { "v1": String(this.slot + 1) }) + "</font>";
        this.mcBackground.transform.colorTransform = new ColorTransform(0.75, 0.75, 0.75);
        if (showLock) {
            this.mcLock.visible = true;
            this.addEventListener(MouseEvent.CLICK, this.clickedUnlock.bind(this), false, 0, true);
        }
    }

    protected clickedUnlock(event: MouseEvent): void {
        SubscriptionHandler.instance.showPromoPopup();
    }

    protected removedFromStage(event: Event): void {
        this.bTransfer.removeEventListener(MouseEvent.CLICK, this.clickedTransfer.bind(this));
        this.tTemplateName.removeEventListener(MouseEvent.CLICK, this.clickedEdit.bind(this));
        this.removeEventListener(Event.REMOVED_FROM_STAGE, this.removedFromStage.bind(this));
        this.tTemplateName.removeEventListener(MouseEvent.MOUSE_OVER, this.rollOverName.bind(this));
        this.tTemplateName.removeEventListener(MouseEvent.MOUSE_OUT, this.rollOutName.bind(this));
        this.tTemplateName.removeEventListener(KeyboardEvent.KEY_DOWN, this.pressedEnterOnName.bind(this));
    }

    protected clickedEdit(event: MouseEvent): void {
        this.isEditing = true;
    }

    protected clickedTransfer(event: MouseEvent | null): void {
        this.isEditing = false;
        this.dispatchEvent(new Event(BasePlannerTransferPopup.CLICKED_TRANSFER));
    }
}
