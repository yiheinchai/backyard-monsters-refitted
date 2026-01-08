import { Sprite } from "openfl/display/Sprite";

import { ScrollSetV } from "../display/ScrollSetV";
import { EventStorePrize } from "./EventStorePrize";
import { EventStorePrizeData } from "./EventStorePrizeData";

/**
 * Event store display grid - grid layout for event store prizes.
 */
export class EventStoreDisplayGrid extends Sprite {
    private static readonly MAX_ITEMS_PER_ROW: number = 5;
    private static readonly X_BUFFER: number = 10;
    private static readonly Y_BUFFER: number = 10;

    private m_ScrollContents: Sprite;
    private m_ScrollSpacer: Sprite;
    private m_ScrollMask: Sprite;
    private m_ScrollBar: ScrollSetV;
    private m_DisplayItems: Array<EventStorePrize> = [];
    private m_AvailablePrizes: any[] | null = null;

    constructor(container: Sprite) {
        super();
        
        this.m_DisplayItems = [];
        
        this.m_ScrollContents = new Sprite();
        this.addChild(this.m_ScrollContents);
        
        this.m_ScrollSpacer = new Sprite();
        this.m_ScrollSpacer.graphics.beginFill(0xFFFFFF, 0.01);
        this.m_ScrollSpacer.graphics.drawRect(0, 0, 2, 2);
        this.m_ScrollSpacer.graphics.endFill();
        this.m_ScrollContents.addChild(this.m_ScrollSpacer);
        
        this.m_ScrollMask = new Sprite();
        this.m_ScrollMask.graphics.beginFill(0xFFFFFF, 0.01);
        this.m_ScrollMask.graphics.drawRect(0, 0, container.width, container.height);
        this.m_ScrollMask.graphics.endFill();
        this.m_ScrollMask.mouseEnabled = false;
        this.m_ScrollMask.mouseChildren = false;
        this.m_ScrollContents.mask = this.m_ScrollMask;
        this.addChild(this.m_ScrollMask);
        
        this.m_ScrollBar = new ScrollSetV(this.m_ScrollContents, this.m_ScrollMask, true);
        this.m_ScrollBar.x = container.width - this.m_ScrollBar.width;
        this.addChild(this.m_ScrollBar);
    }

    public Populate(): void {
        if (this.m_AvailablePrizes === null) {
            const sampleData = [
                { id: "prize_rezghul", xpcost: 999 },
                { id: "prize_gold_totem", xpcost: 9999 },
                { id: "prize_black_totem", xpcost: 999 },
                { id: "prize_spurtz_cannon_1", xpcost: 9999 },
                { id: "prize_spurtz_cannon_2", xpcost: 999 },
                { id: "prize_spurtz_cannon_bd", xpcost: 9999 },
                { id: "prize_unlock_vorg", xpcost: 999 },
                { id: "prize_unlock_slimeattikus", xpcost: 9999 },
                { id: "prize_korath", xpcost: 999 },
                { id: "prize_korath_ability_1", xpcost: 9999 },
                { id: "prize_korath_ability_2", xpcost: 999 }
            ];
            this.OnAvailableItemsLoaded(sampleData);
        } else {
            this._Populate();
        }
    }

    private OnAvailableItemsLoaded(items: any[]): void {
        this.m_AvailablePrizes = [];
        const length = items.length;
        
        for (let i = 0; i < length; i++) {
            const item = items[i];
            const prizeData = EventStorePrizeData.FindEventStorePrizeData(item.id);
            if (prizeData !== null) {
                prizeData.xpcost = item.xpcost;
                this.m_AvailablePrizes.push(prizeData);
            }
        }
        
        this._Populate();
    }

    private _Populate(): void {
        if (this.m_AvailablePrizes === null) {
            return;
        }
        
        let posX = EventStoreDisplayGrid.X_BUFFER;
        let posY = EventStoreDisplayGrid.Y_BUFFER;
        const length = this.m_AvailablePrizes.length;
        
        for (let i = 0; i < length; i++) {
            const prizeData = this.m_AvailablePrizes[i];
            const prize = new EventStorePrize(prizeData);
            this.m_DisplayItems.push(prize);
            this.m_ScrollContents.addChild(prize);
            
            prize.x = posX;
            prize.y = posY;
            
            if ((i + 1) % EventStoreDisplayGrid.MAX_ITEMS_PER_ROW === 0) {
                posX = EventStoreDisplayGrid.X_BUFFER;
                posY += prize.height + EventStoreDisplayGrid.Y_BUFFER;
            } else {
                posX += prize.width + EventStoreDisplayGrid.X_BUFFER;
            }
        }
        
        this.m_ScrollSpacer.width = 1;
        this.m_ScrollSpacer.height = this.m_ScrollContents.height + EventStoreDisplayGrid.Y_BUFFER;
        this.m_ScrollBar.checkResize();
    }

    public Clear(): void {
        const length = this.m_DisplayItems.length;
        
        for (let i = 0; i < length; i++) {
            const prize = this.m_DisplayItems[i];
            this.m_ScrollContents.removeChild(prize);
            prize.Destroy();
        }
        
        this.m_DisplayItems.length = 0;
    }
}
