import Event from "openfl/events/Event";
import EventDispatcher from "openfl/events/EventDispatcher";
import MouseEvent from "openfl/events/MouseEvent";

import { SecNum } from "../../../cc/utils/SecNum";
import { MapRoom3Cell } from "../MapRoom3Cell";
import { attackCostPopup } from "../../../../attackCostPopup";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getSTORE(): any { return require("../../../../STORE").STORE; }
function getPOPUPS(): any { return require("../../../../POPUPS").POPUPS; }



/**
 * Map room 3 attack cost popup - displays attack cost options.
 */
export class Maproom3AttackCostPopup extends EventDispatcher {
    public static readonly k_LOAD_ATTACK: string = "loadAttack";

    public addtionalLoadParameters: Record<string, any> | null = null;
    private m_graphic: attackCostPopup;
    private m_cell: MapRoom3Cell;
    private m_shinyCost: number = 0;
    private m_totalNeededResources: number = 0;

    constructor(cell: MapRoom3Cell) {
        super();
        this.m_graphic = new attackCostPopup();
        this.m_cell = cell;
        this.setup();
    }

    private setup(): void {
        let totalCost: number = 0;
        const costs: Array<number> = this.m_cell.attackCost;
        for (let i = 1; i < 5; i++) {
            const cost: number = costs[i - 1];
            const owned: number = getGLOBAL()._attackersResources["r" + i].Get();
            const needed: number = cost - owned;
            if (needed > 0) {
                this.m_totalNeededResources += needed;
            }
            totalCost += cost;
        }
        this.m_shinyCost = getSTORE().GetShinyCostFromTotalResources(totalCost);
        this.m_graphic.tBody.htmlText = getKEYS().Get("msg_attackcost", { "v1": this.m_cell.name });
        (this.m_graphic.mcInstant as any).tDescription.htmlText = getKEYS().Get("msg_attackinstant");
        (this.m_graphic.mcInstant as any).bAction.Setup(getKEYS().Get("btn_useshiny", { "v1": this.m_shinyCost }));
        (this.m_graphic.mcInstant as any).bAction.addEventListener(MouseEvent.CLICK, this.clickedShinyAttack.bind(this), false, 0, true);
        (this.m_graphic.mcResources as any).bAction.Setup(getKEYS().Get("btn_useresources"));
        for (let i = 1; i < 6; i++) {
            const icon = this.m_graphic.mcResources.getChildByName("mcR" + i) as any;
            const costValue: number = costs[i - 1];
            if (icon) {
                const color: string = getGLOBAL()._attackersResources["r" + i].Get() < costValue ? "FF0000" : "000000";
                if (!costValue) {
                    icon.alpha = 0.25;
                }
                icon.gotoAndStop(i);
                icon.tValue.htmlText = "<b><font color=\"#" + color + "\">" + getGLOBAL().FormatNumber(costValue) + "</font></b>";
                icon.tTitle.htmlText = "<b>" + getKEYS().Get(getGLOBAL()._resourceNames[i - 1]) + "</b>";
            }
        }
        (this.m_graphic.mcResources as any).mcTime.visible = false;
        (this.m_graphic.mcResources as any).bAction.addEventListener(MouseEvent.CLICK, this.clickedResourceAttack.bind(this), false, 0, true);
    }

    protected clickedShinyAttack(event: MouseEvent): void {
        if (getBASE()._pendingPurchase.length === 0) {
            if (Boolean(this.m_shinyCost) && this.m_shinyCost > getBASE()._credits.Get()) {
                getPOPUPS().Next();
                getPOPUPS().DisplayGetShiny();
            } else {
                this.addtionalLoadParameters = { "shiny": this.m_shinyCost };
                this.dispatchEvent(new Event(Maproom3AttackCostPopup.k_LOAD_ATTACK));
            }
        }
    }

    protected clickedResourceAttack(event: MouseEvent | null = null): void {
        if (this.m_totalNeededResources) {
            const shinyCost: number = getSTORE().GetShinyCostFromTotalResources(this.m_totalNeededResources);
            getGLOBAL().Message(getKEYS().Get("msg_needresourcesattack", {
                "v1": getGLOBAL().FormatNumber(this.m_totalNeededResources),
                "v2": getGLOBAL().FormatNumber(shinyCost)
            }), getKEYS().Get("btn_getresources"), this.clickedResourceTopoff.bind(this));
        } else {
            const costs: Array<number> = this.m_cell.attackCost;
            for (let i = 0; i < costs.length; i++) {
                const resource: SecNum = getGLOBAL()._resources["r" + (i + 1)];
                getGLOBAL()._resources["r" + (i + 1)] = new SecNum(resource.Get() - costs[i]);
            }
            this.addtionalLoadParameters = { "resources": costs };
            this.dispatchEvent(new Event(Maproom3AttackCostPopup.k_LOAD_ATTACK));
        }
    }

    private clickedResourceTopoff(): void {
        const shinyCost: number = getSTORE().GetShinyCostFromTotalResources(this.m_totalNeededResources);
        if (getBASE()._pendingPurchase.length === 0) {
            if (Boolean(shinyCost) && shinyCost > getBASE()._credits.Get()) {
                getPOPUPS().DisplayGetShiny();
            } else {
                this.addtionalLoadParameters = { "shiny": shinyCost };
                this.dispatchEvent(new Event(Maproom3AttackCostPopup.k_LOAD_ATTACK));
            }
        }
    }

    public get graphic(): attackCostPopup {
        return this.m_graphic;
    }
}
