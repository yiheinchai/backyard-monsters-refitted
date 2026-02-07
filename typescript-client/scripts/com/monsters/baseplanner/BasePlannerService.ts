import EventDispatcher from "openfl/events/EventDispatcher";

import { BasePlannerServiceEvent } from "./events/BasePlannerServiceEvent";
import { BasePlanner } from "./BasePlanner";
import { BaseTemplate } from "./BaseTemplate";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getURLLoaderApi(): any { return require("../../../URLLoaderApi").URLLoaderApi; }



// Helper function
declare function print(msg: string): void;

// JSON encode/decode declarations
declare const JSON: { encode(obj: any): string; decode(str: string): any };

/**
 * Base planner service - handles server communication for yard planner.
 */
export class BasePlannerService extends EventDispatcher {
    constructor() {
        super();
    }

    public callServerMethod(url: string, keyValue: any[] | null, onComplete: Function | null = null): void {
        const urlLoader = new (getURLLoaderApi())();
        urlLoader.load(getGLOBAL()._apiURL + "bm/yardplanner/" + url, keyValue, onComplete);
    }

    public saveTemplate(baseTemplate: BaseTemplate, slotId: number): void {
        const data = JSON.encode(baseTemplate.exportData());
        this.callServerMethod("savetemplate", [["slotid", slotId], ["name", baseTemplate.name], ["data", data]], this.savedTemplate.bind(this));
        print("saving '" + baseTemplate.name + "' in slot " + slotId);
    }

    private savedTemplate(serverData: any): void {
        if (serverData.error) {
            print(serverData.error);
            return;
        }
        this.loadedTemplates(serverData);
    }

    public loadTemplates(): void {
        this.callServerMethod("gettemplates", null, this.loadedTemplates.bind(this));
        print("loading template list from the server");
    }

    private loadedTemplates(serverData: any): void {
        const baseTemplateList: Array<BaseTemplate | null> = new Array(BasePlanner.slots);
        
        // Initialize with null
        for (let i = 0; i < BasePlanner.slots; i++) {
            baseTemplateList[i] = null;
        }
        
        for (const key in serverData) {
            const template = serverData[key];
            if (!(typeof template === "number")) {
                const baseTemplate = new BaseTemplate();
                const slotId = Number(template.slotid);
                baseTemplate.name = template.name;
                baseTemplate.slot = slotId;
                baseTemplate.importData(JSON.decode(template.data));
                if (slotId < baseTemplateList.length) {
                    baseTemplateList[slotId] = baseTemplate;
                }
            }
        }
        
        // Fill empty slots with default templates
        for (let slotIndex = baseTemplateList.length - 1; slotIndex >= 0; slotIndex--) {
            if (!baseTemplateList[slotIndex]) {
                baseTemplateList[slotIndex] = new BaseTemplate("Slot" + (slotIndex + 1).toString());
            }
        }
        
        print("new template list is " + baseTemplateList);
        this.dispatchEvent(new BasePlannerServiceEvent(BasePlannerServiceEvent.LOADED_TEMPLATES_LIST, baseTemplateList as Array<BaseTemplate>));
    }

    public clearSlot(slotIndex: number): void {
        this.callServerMethod("deletetemplate", [["slotid", slotIndex]]);
        print("deleting 'blah' at slot index of " + slotIndex);
    }
}
