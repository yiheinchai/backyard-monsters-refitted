import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import MouseEvent from "openfl/events/MouseEvent";

import { ScrollSet } from "../display/ScrollSet";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";
import { PopupInfoMonster } from "./PopupInfoMonster";

import { KEYS } from "../../../KEYS";
import { SecNum } from "../../cc/utils/SecNum";
import { PopupMonstersB_CLIP } from "../../../PopupMonstersB_CLIP";

/**
 * Monster transfer confirmation popup (step B in transfer flow).
 */
export class PopupMonstersB extends PopupMonstersB_CLIP {
    private _cell: MapRoomCell | null = null;
    private _transfer: { [key: string]: SecNum } | null = null;
    private _mcMonsters: MovieClip | null = null;
    private _scroller: ScrollSet;

    constructor() {
        super();
        this.x = 760 / 2 + 75;
        this.y = 520 / 2 - 10;
        
        this.mMonsters.mask = this.mMonstersMask;
        
        this._scroller = new ScrollSet();
        this._scroller.isHiddenWhileUnnecessary = true;
        this._scroller.AutoHideEnabled = false;
        this._scroller.width = this.scroll.width;
        this._scroller.x = this.scroll.x;
        this._scroller.y = this.scroll.y;
        this.addChild(this._scroller);
        this._scroller.Init(this.mMonsters, this.mMonstersMask, 0, this.scroll.y, this.scroll.height);
        
        this.bTransfer.SetupKey("bunker_btn_transfer");
        this.bTransfer.addEventListener(MouseEvent.CLICK, (e: MouseEvent) => {
            if (this._cell) {
                MapRoom.TransferMonstersC(this._cell);
            }
        });
        
        this.bCancel.SetupKey("btn_cancel");
        this.bCancel.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
    }

    public Setup(transfer: { [key: string]: SecNum }, cell: MapRoomCell): void {
        this.tDesc.htmlText = KEYS.Get("popup_desc_monstertransferb");
        
        if (this._mcMonsters) {
            while (this._mcMonsters.numChildren > 0) {
                this._mcMonsters.removeChildAt(0);
            }
            this._mcMonsters = null;
        }
        
        this._cell = cell;
        this._transfer = transfer;
        
        if (this._transfer) {
            this._mcMonsters = new MovieClip();
            this._mcMonsters.x = -190;
            this._mcMonsters.y = -115;
            
            let xPos = 0;
            let yPos = 0;
            
            for (const monsterID in this._transfer) {
                if (this._transfer[monsterID].Get() > 0) {
                    const infoMonster = new PopupInfoMonster();
                    infoMonster.Setup(xPos * 130, yPos * 35, monsterID, this._transfer[monsterID].Get());
                    xPos++;
                    if (xPos === 3) {
                        xPos = 0;
                        yPos++;
                    }
                    this._mcMonsters.addChild(infoMonster);
                }
            }
            this.addChild(this._mcMonsters);
        }
        
        this._scroller.Update();
    }

    public Cleanup(): void {
        if (this._mcMonsters) {
            while (this._mcMonsters.numChildren > 0) {
                this._mcMonsters.removeChildAt(0);
            }
            this._mcMonsters = null;
        }
    }

    public Hide(event: MouseEvent | null = null): void {
        if (MapRoom._mc) {
            MapRoom._mc.HideMonstersB();
        }
    }
}
