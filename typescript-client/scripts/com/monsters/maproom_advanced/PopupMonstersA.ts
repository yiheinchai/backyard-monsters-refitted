import MovieClip from "openfl/display/MovieClip";
import Sprite from "openfl/display/Sprite";
import Event from "openfl/events/Event";
import MouseEvent from "openfl/events/MouseEvent";

import { SecNum } from "../../cc/utils/SecNum";
import { ScrollSet } from "../display/ScrollSet";
import { MapRoom } from "./MapRoom";
import { MapRoomCell } from "./MapRoomCell";
import { PopupInfoMonster } from "./PopupInfoMonster";

import { PopupMonstersA_CLIP } from "../../../PopupMonstersA_CLIP";
import { MonsterTransferBar } from "../../../MonsterTransferBar";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../KEYS").KEYS; }


/**
 * Monster transfer selection popup (step A in transfer flow).
 */
export class PopupMonstersA extends PopupMonstersA_CLIP {
    private _cell: MapRoomCell | null = null;
    private _transfer: { [key: string]: SecNum } = {};
    private _mc: PopupMonstersA;
    private _mcMonsters: MovieClip | null = null;
    private _tempMonsterID: string = "";
    private _tickDelay: number = 0;
    private _transferMonsters: { [key: string]: SecNum } = {};
    private _monstersLeft: { [key: string]: SecNum } = {};
    private _transferBars: Array<{ bar: MonsterTransferBar; monster: string }> = [];
    private _scroller: ScrollSet;

    constructor() {
        super();
        this._transferMonsters = {};
        this._monstersLeft = {};
        this._transferBars = [];
        
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
        
        this._mc = this;
        
        this.bCancel.SetupKey("btn_cancel");
        this.bCancel.addEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        
        this.bTransfer.SetupKey("btn_transfer");
        this.bTransfer.addEventListener(MouseEvent.CLICK, this.Transfer.bind(this));
    }

    public Setup(cell: MapRoomCell, useExisting: boolean = false): void {
        this._cell = cell;
        this._transfer = {};
        this._transferMonsters = {};
        this._monstersLeft = {};
        this._transferBars = [];
        
        this.tDesc.htmlText = getKEYS().Get("popup_desc_monstertransfera");
        
        if (useExisting) {
            for (const monsterID in MapRoom._monsterTransfer) {
                this._transfer[monsterID] = new SecNum(MapRoom._monsterTransfer[monsterID].Get());
            }
        }
        
        if (this._cell._monsters) {
            let row = 0;
            let idx = 0;
            
            for (const monsterID in this._cell._monsters) {
                const bar = new MonsterTransferBar();
                const infoMonster = new PopupInfoMonster();
                infoMonster.Setup(0, 0, monsterID, 0);
                bar.addChild(infoMonster);
                bar.y = row * bar.height;
                
                bar.b1a.Setup("-");
                bar.b1a.addEventListener(MouseEvent.MOUSE_DOWN, this.createSubtractHandler(idx));
                bar.b1a.buttonMode = true;
                bar.b1a.enabled = true;
                
                bar.b1b.Setup("+");
                bar.b1b.addEventListener(MouseEvent.MOUSE_DOWN, this.createAddHandler(idx));
                bar.b1b.buttonMode = true;
                bar.b1b.enabled = true;
                
                idx++;
                
                if (useExisting) {
                    if (this._monstersLeft[monsterID]) {
                        this._monstersLeft[monsterID].Set(this._cell._monsters[monsterID].Get() - this._transfer[monsterID].Get());
                    } else {
                        this._monstersLeft[monsterID] = new SecNum(this._cell._monsters[monsterID].Get() - this._transfer[monsterID].Get());
                    }
                    bar.r1.text = String(this._monstersLeft[monsterID].Get());
                    this._transferMonsters[monsterID] = new SecNum(this._transfer[monsterID].Get());
                    bar.t1.text = String(this._transferMonsters[monsterID].Get());
                } else {
                    bar.r1.text = this._cell._monsters[monsterID].Get();
                    bar.t1.text = "0";
                    this._monstersLeft[monsterID] = new SecNum(this._cell._monsters[monsterID].Get());
                    this._transferMonsters[monsterID] = new SecNum(0);
                }
                
                this._transferBars.push({ bar: bar, monster: monsterID });
                this.mMonsters.addChild(bar);
                row++;
            }
        }
        
        this.Update();
    }

    public Hide(event: MouseEvent | null = null): void {
        const count = this._transferBars.length;
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                if (this._transferBars[i] && this._transferBars[i].bar && this._transferBars[i].bar.parent) {
                    this._transferBars[i].bar.parent.removeChild(this._transferBars[i].bar);
                }
            }
        }
        
        MapRoom._mc.HideMonstersA();
        if (this._cell) {
            MapRoom._mc.ShowInfoMine(this._cell);
        }
        MapRoom._monsterTransferInProgress = false;
        
        this._mc.removeEventListener(Event.ENTER_FRAME, this.AddTick.bind(this));
        this._mc.removeEventListener(Event.ENTER_FRAME, this.SubtractTick.bind(this));
        this._mc.removeEventListener(MouseEvent.MOUSE_UP, this.TickRemove.bind(this));
    }

    public Cleanup(): void {
        this.removeEventListener(Event.ENTER_FRAME, this.AddTick.bind(this));
        this.removeEventListener(Event.ENTER_FRAME, this.SubtractTick.bind(this));
        this.removeEventListener(MouseEvent.MOUSE_UP, this.TickRemove.bind(this));
        this.bCancel.removeEventListener(MouseEvent.CLICK, this.Hide.bind(this));
        this.bTransfer.removeEventListener(MouseEvent.CLICK, this.Transfer.bind(this));
    }

    private Update(): void {
        for (let i = 0; i < this._transferBars.length; i++) {
            const bar = this._transferBars[i].bar;
            if (bar && bar.r1 && bar.t1) {
                const monsterID = this._transferBars[i].monster;
                bar.r1.htmlText = "<b>" + getGLOBAL().FormatNumber(this._monstersLeft[monsterID].Get()) + "</b>";
                bar.t1.htmlText = "<b>" + getGLOBAL().FormatNumber(this._transferMonsters[monsterID].Get()) + "</b>";
            }
        }
        
        if (this._scroller) {
            this._scroller.Update();
        }
    }

    private createAddHandler(index: number): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            if (this._cell && this._cell._monsters[this._transferBars[index].monster].Get() > 0) {
                this._tempMonsterID = this._transferBars[index].monster;
                this._tickDelay = 0;
                this.AddTick();
                this._tickDelay = 10;
                this._mc.addEventListener(Event.ENTER_FRAME, this.AddTick.bind(this));
                this._mc.addEventListener(MouseEvent.MOUSE_UP, this.TickRemove.bind(this));
            }
        };
    }

    private AddTick(event: Event | null = null): void {
        if (this._monstersLeft[this._tempMonsterID].Get() > 0 && 
            this._cell && 
            this._cell._monsters[this._tempMonsterID].Get() - this._transferMonsters[this._tempMonsterID].Get() > 0 && 
            this._tickDelay <= 0) {
            this._transferMonsters[this._tempMonsterID].Add(1);
            this._monstersLeft[this._tempMonsterID].Add(-1);
            this.Update();
        }
        this._tickDelay--;
    }

    private createSubtractHandler(index: number): (e: MouseEvent) => void {
        return (e: MouseEvent): void => {
            if (this._transferMonsters && this._transferMonsters[this._transferBars[index].monster].Get() >= 1) {
                this._tempMonsterID = this._transferBars[index].monster;
                this._tickDelay = 0;
                this.SubtractTick();
                this._tickDelay = 10;
                this._mc.addEventListener(Event.ENTER_FRAME, this.SubtractTick.bind(this));
                this._mc.addEventListener(MouseEvent.MOUSE_UP, this.TickRemove.bind(this));
            }
        };
    }

    private SubtractTick(event: Event | null = null): void {
        if (this._transferMonsters[this._tempMonsterID].Get() >= 1 && this._tickDelay <= 0) {
            this._transferMonsters[this._tempMonsterID].Add(-1);
            this._monstersLeft[this._tempMonsterID].Add(1);
            this.Update();
        }
        this._tickDelay--;
    }

    private TickRemove(event: MouseEvent): void {
        this._mc.removeEventListener(Event.ENTER_FRAME, this.AddTick.bind(this));
        this._mc.removeEventListener(Event.ENTER_FRAME, this.SubtractTick.bind(this));
        this._mc.removeEventListener(MouseEvent.MOUSE_UP, this.TickRemove.bind(this));
    }

    private Transfer(event: MouseEvent): void {
        if (this._cell) {
            MapRoom.TransferMonstersA(this._cell, this._transferMonsters);
        }
        
        const count = this._transferBars.length;
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                if (this._transferBars[i] && this._transferBars[i].bar && this._transferBars[i].bar.parent) {
                    this._transferBars[i].bar.parent.removeChild(this._transferBars[i].bar);
                }
            }
        }
        
        MapRoom._mc.HideMonstersA();
        this._mc.removeEventListener(Event.ENTER_FRAME, this.AddTick.bind(this));
        this._mc.removeEventListener(Event.ENTER_FRAME, this.SubtractTick.bind(this));
        this._mc.removeEventListener(MouseEvent.MOUSE_UP, this.TickRemove.bind(this));
    }
}
