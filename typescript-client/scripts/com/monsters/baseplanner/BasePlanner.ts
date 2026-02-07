import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { BasePlannerEvent } from "./events/BasePlannerEvent";
import { BasePlannerServiceEvent } from "./events/BasePlannerServiceEvent";
import { BasePlannerTransferEvent } from "./events/BasePlannerTransferEvent";
import { BasePlannerPopup } from "./popups/BasePlannerPopup";
import { BasePlannerLoadPopup } from "./popups/transfer/BasePlannerLoadPopup";
import { BasePlannerSavePopup } from "./popups/transfer/BasePlannerSavePopup";
import { BasePlannerTransferPopup } from "./popups/transfer/BasePlannerTransferPopup";
import { BasePlannerService } from "./BasePlannerService";
import { BaseTemplate } from "./BaseTemplate";
import { BuildingItem } from "./components/BuildingItem";
import { PlannerNode } from "./PlannerNode";
import { PlannerTemplate } from "./PlannerTemplate";

// Lazy imports to break circular dependency chains
function getInstanceManager(): any { return require("../managers/InstanceManager").InstanceManager; }
function getBASE(): any { return require("../../../BASE").BASE; }
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getPLANNER(): any { return require("../../../PLANNER").PLANNER; }
function getPOPUPS(): any { return require("../../../POPUPS").POPUPS; }
function getSOUNDS(): any { return require("../../../SOUNDS").SOUNDS; }



/**
 * BasePlanner - main controller for the base layout planner.
 */
export class BasePlanner {
    public static readonly TYPE: number = 10;
    public static canSave: boolean = true;
    public static readonly DEFAULT_NUMBER_OF_SLOTS: number = 2;
    public static slots: number = BasePlanner.DEFAULT_NUMBER_OF_SLOTS;
    public static maxNumberOfSlots: number = BasePlanner.DEFAULT_NUMBER_OF_SLOTS;

    public popup: BasePlannerPopup | null = null;
    public service: BasePlannerService | null = null;
    private _templates: Array<BaseTemplate> = [];
    private _activeTemplate: PlannerTemplate | null = null;
    private _transferPopup: BasePlannerTransferPopup | null = null;

    constructor() {
    }

    public setup(showPopup: boolean = true): void {
        BasePlanner.canSave = !getBASE().isOutpost;
        this.service = new BasePlannerService();
        this.service.loadTemplates();
        this.service.addEventListener(BasePlannerServiceEvent.LOADED_TEMPLATES_LIST, this.loadedTemplateList.bind(this));
        this._activeTemplate = new PlannerTemplate();
        this.setActiveTemplate(getBASE().getTemplate());
        this.show();
    }

    private loadedTemplateList(event: BasePlannerServiceEvent): void {
        this._templates = event.templatesList;
        if (this._transferPopup) {
            this._transferPopup.updateList(this._templates);
        }
    }

    private loadTemplateAtSlot(slot: number): void {
        this.setActiveTemplate(this._templates[slot]);
    }

    private setActiveTemplate(template: BaseTemplate): void {
        this._activeTemplate!.importData(template);
        if (this.popup) {
            this.popup.redraw();
            this.popup.hasBeenSaved = true;
            this.popup.changedPlannerData();
        }
    }

    public show(event: MouseEvent | null = null): void {
        getBASE().BuildingDeselect();
        if (!this.popup) {
            this.popup = new BasePlannerPopup(this._activeTemplate!);
            this.popup.addEventListener(BasePlannerEvent.APPLY, this.clickedApply.bind(this));
            this.popup.addEventListener(BasePlannerEvent.SAVE, this.clickedSave.bind(this));
            this.popup.addEventListener(BasePlannerEvent.LOAD, this.clickedLoad.bind(this));
            getGLOBAL()._layerWindows.addChild(this.popup);
            this.popup.hasBeenSaved = true;
        }
    }

    private clickedSave(event: Event): void {
        this.popup!.removeSelection();
        if (this._transferPopup) {
            getPOPUPS().Remove(this._transferPopup);
        }
        this.service!.loadTemplates();
        this._transferPopup = new BasePlannerSavePopup();
        if (this._templates) {
            this._transferPopup.updateList(this._templates);
        }
        this._transferPopup.addEventListener(BasePlannerEvent.SAVE, this.saveTemplate.bind(this), false, 0, true);
        this._transferPopup.addEventListener(Event.CLOSE, this.closedTransferPopup.bind(this));
        getPOPUPS().Add(this._transferPopup, 1);
    }

    private clickedLoad(event: Event): void {
        this.popup!.removeSelection();
        if (this._transferPopup) {
            getPOPUPS().Remove(this._transferPopup);
        }
        this.service!.loadTemplates();
        this._transferPopup = new BasePlannerLoadPopup();
        if (this._templates) {
            this._transferPopup.updateList(this._templates);
        }
        this._transferPopup.addEventListener(BasePlannerEvent.LOAD, this.loadTemplate.bind(this), false, 0, true);
        this._transferPopup.addEventListener(Event.CLOSE, this.closedTransferPopup.bind(this));
        getPOPUPS().Add(this._transferPopup, 1);
    }

    private clickedApply(event: Event): void {
        for (let i = 0; i < this._activeTemplate!.inventoryData.length; i++) {
            const node = this._activeTemplate!.inventoryData[i];
            if (node.building._id !== PlannerTemplate._DECORATION_ID && node.category === BuildingItem.TYPE_DECORATION) {
                node.building.RecycleC();
                getInstanceManager().removeInstance(node.building);
            }
        }
        getBASE().applyTemplate(this._activeTemplate!.exportData());
        getPLANNER().Hide();
        getBASE().Save();
    }

    protected loadTemplate(event: BasePlannerTransferEvent): void {
        this.loadTemplateAtSlot(event.slot);
        this.closedTransferPopup(null);
    }

    protected saveTemplate(event: BasePlannerTransferEvent): void {
        this._activeTemplate!.name = event.name;
        this._activeTemplate!.slot = event.slot;
        this.service!.saveTemplate(this._activeTemplate!.exportData(), event.slot);
        if (this.popup) {
            this.popup.hasBeenSaved = true;
        }
        this.closedTransferPopup(null);
    }

    protected closedTransferPopup(event: Event | null = null): void {
        getPOPUPS().Remove(this._transferPopup!);
        this._transferPopup!.clear();
        this._transferPopup!.removeEventListener(Event.CLOSE, this.closedTransferPopup.bind(this));
        this._transferPopup = null;
    }

    public hide(event: MouseEvent | null = null): void {
        if (this.popup) {
            this.popup.removeEventListener(BasePlannerEvent.APPLY, this.clickedApply.bind(this));
            this.popup.removeEventListener(BasePlannerEvent.SAVE, this.clickedSave.bind(this));
            this.popup.removeEventListener(BasePlannerEvent.LOAD, this.clickedLoad.bind(this));
            this.popup.Remove();
            getSOUNDS().Play("close");
            getGLOBAL()._layerWindows.removeChild(this.popup);
            this.popup = null;
        }
        if (this._transferPopup) {
            this.closedTransferPopup();
        }
    }
}
