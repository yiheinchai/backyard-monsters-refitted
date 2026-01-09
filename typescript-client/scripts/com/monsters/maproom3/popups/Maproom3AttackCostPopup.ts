import { Event } from "openfl/events/Event";
import { EventDispatcher } from "openfl/events/EventDispatcher";
import { MouseEvent } from "openfl/events/MouseEvent";

import { SecNum } from "../../../../cc/utils/SecNum";
import { MapRoom3Cell } from "../MapRoom3Cell";
import { attackCostPopup } from "../../../attackCostPopup";

import { GLOBAL } from "../../../../GLOBAL";
import { KEYS } from "../../../../KEYS";
import { BASE } from "../../../../BASE";
import { STORE } from "../../../../STORE";
import { POPUPS } from "../../../../POPUPS";

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
            const owned: number = GLOBAL._attackersResources["r" + i].Get();
            const needed: number = cost - owned;
            if (needed > 0) {
                this.m_totalNeededResources += needed;
            }
            totalCost += cost;
        }
        this.m_shinyCost = STORE.GetShinyCostFromTotalResources(totalCost);
        this.m_graphic.tBody.htmlText = KEYS.Get("msg_attackcost", { "v1": this.m_cell.name });
        this.m_graphic.mcInstant.tDescription.htmlText = KEYS.Get("msg_attackinstant");
        this.m_graphic.mcInstant.bAction.Setup(KEYS.Get("btn_useshiny", { "v1": this.m_shinyCost }));
        this.m_graphic.mcInstant.bAction.addEventListener(MouseEvent.CLICK, this.clickedShinyAttack.bind(this), false, 0, true);
        this.m_graphic.mcResources.bAction.Setup(KEYS.Get("btn_useresources"));
        for (let i = 1; i < 6; i++) {
            const icon = this.m_graphic.mcResources.getChildByName("mcR" + i) as any;
            const costValue: number = costs[i - 1];
            if (icon) {
                const color: string = GLOBAL._attackersResources["r" + i].Get() < costValue ? "FF0000" : "000000";
                if (!costValue) {
                    icon.alpha = 0.25;
                }
                icon.gotoAndStop(i);
                icon.tValue.htmlText = "<b><font color=\"#" + color + "\">" + GLOBAL.FormatNumber(costValue) + "</font></b>";
                icon.tTitle.htmlText = "<b>" + KEYS.Get(GLOBAL._resourceNames[i - 1]) + "</b>";
            }
        }
        this.m_graphic.mcResources.mcTime.visible = false;
        this.m_graphic.mcResources.bAction.addEventListener(MouseEvent.CLICK, this.clickedResourceAttack.bind(this), false, 0, true);
    }

    protected clickedShinyAttack(event: MouseEvent): void {
        if (BASE._pendingPurchase.length === 0) {
            if (Boolean(this.m_shinyCost) && this.m_shinyCost > BASE._credits.Get()) {
                POPUPS.Next();
                POPUPS.DisplayGetShiny();
            } else {
                this.addtionalLoadParameters = { "shiny": this.m_shinyCost };
                this.dispatchEvent(new Event(Maproom3AttackCostPopup.k_LOAD_ATTACK));
            }
        }
    }

    protected clickedResourceAttack(event: MouseEvent | null = null): void {
        if (this.m_totalNeededResources) {
            const shinyCost: number = STORE.GetShinyCostFromTotalResources(this.m_totalNeededResources);
            GLOBAL.Message(KEYS.Get("msg_needresourcesattack", {
                "v1": GLOBAL.FormatNumber(this.m_totalNeededResources),
                "v2": GLOBAL.FormatNumber(shinyCost)
            }), KEYS.Get("btn_getresources"), this.clickedResourceTopoff.bind(this));
        } else {
            const costs: Array<number> = this.m_cell.attackCost;
            for (let i = 0; i < costs.length; i++) {
                const resource: SecNum = GLOBAL._resources["r" + (i + 1)];
                GLOBAL._resources["r" + (i + 1)] = new SecNum(resource.Get() - costs[i]);
            }
            this.addtionalLoadParameters = { "resources": costs };
            this.dispatchEvent(new Event(Maproom3AttackCostPopup.k_LOAD_ATTACK));
        }
    }

    private clickedResourceTopoff(): void {
        const shinyCost: number = STORE.GetShinyCostFromTotalResources(this.m_totalNeededResources);
        if (BASE._pendingPurchase.length === 0) {
            if (Boolean(shinyCost) && shinyCost > BASE._credits.Get()) {
                POPUPS.DisplayGetShiny();
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
