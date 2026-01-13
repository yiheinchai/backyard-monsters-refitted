import { popup_prefab } from "../../../popup_prefab";

/**
 * Kit - represents a building kit with resource and shiny costs.
 */
export class Kit {
    public build: any;
    public resourceWorth: number;
    public shinyWorth: number;

    constructor(buildData: any) {
        this.build = buildData;
        this.resourceWorth = popup_prefab.getResourceCostFromBuild(buildData);
        this.shinyWorth = popup_prefab.getShinyWorthFromResources(this.resourceWorth);
    }
}
