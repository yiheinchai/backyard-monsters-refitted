
import { InfernoTransferPopup_CLIP } from './InfernoTransferPopup_CLIP'; // Stub needed
import { InfernoTransferMonster_CLIP } from './InfernoTransferMonster_CLIP'; // Stub needed
import { SecNum } from './com/cc/utils/SecNum'; 
import { ImageCache } from './ImageCache';
import { INFERNOPORTAL } from './INFERNOPORTAL';
import { HOUSING } from './HOUSING';
import { CREATURELOCKER } from './CREATURELOCKER';
import { CREATURES } from './CREATURES';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { POPUPSETTINGS } from './POPUPSETTINGS';

import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';

export class INFERNO_ASCENSION_POPUP extends InfernoTransferPopup_CLIP {
    private readonly NUM_MONSTER_ENTRIES: number = 15;
    public _queuedForAscension: { [key: string]: SecNum };
    private _monsterUi: InfernoTransferMonster_CLIP[];
    private _monsterUiIds: string[];
    private _storageWidth: number;
    private _newHousingUsed: SecNum;

    constructor() {
        super();
        this._queuedForAscension = {};
        this._monsterUi = new Array(this.NUM_MONSTER_ENTRIES);
        this._monsterUiIds = new Array(this.NUM_MONSTER_ENTRIES);
        this._newHousingUsed = new SecNum(0);
        
        this.title_txt.text = KEYS.Get("ascdlg_title");
        this.capacity_desc_txt.text = KEYS.Get("ascdlg_capacity_desc");
        this.transfer_action_txt.text = KEYS.Get("ascdlg_transfer_action");
        this.transfer_desc_txt.text = KEYS.Get("ascdlg_transfer_desc");
        this.bTransfer.SetupKey("ascdlg_transfer_btn");
        this.bTransfer.addEventListener(MouseEvent.CLICK, () => {
            this.AscendQueuedMonsters();
        });

        for (let i = 0; i < this.NUM_MONSTER_ENTRIES; i++) {
            this.SetupSection((this as any)["m" + (i + 1)], i);
        }
        
        this._storageWidth = this.mcStorage.width / this.mcStorage.scaleX;
        this.Update();
    }

    private SetupSection(param1: InfernoTransferMonster_CLIP, param2: number): void {
        let section: InfernoTransferMonster_CLIP = param1;
        let index: number = param2;
        this._monsterUi[index] = section;
        section.bRemove.SetupKey("ascdlg_unqueue_btn");
        section.bRemove.addEventListener(MouseEvent.CLICK, () => {
             this.UnqueueMonster(this._monsterUiIds[index]);
        });
        section.bAdd.SetupKey("ascdlg_queue_btn");
        section.bAdd.addEventListener(MouseEvent.CLICK, () => {
             this.QueueMonster(this._monsterUiIds[index]);
        });
    }

    public Update(): void {
        this._newHousingUsed.Set(HOUSING._housingUsed.Get());
        let monsterOrder: string[] = [];
        
        for (let id in INFERNOPORTAL._ascensionData) {
            let total: SecNum = INFERNOPORTAL._ascensionData[id];
            if (total.Get() > 0) {
                let monsterSize: number = CREATURES.GetProperty(id, "cStorage", 0, true);
                let queued: number = this._queuedForAscension[id] ? this._queuedForAscension[id].Get() : 0;
                this._newHousingUsed.Add(queued * monsterSize);
                monsterOrder.push(id);
            }
        }
        
        monsterOrder.sort((param1, param2) => {
            return parseInt(param1.substring(2)) - parseInt(param2.substring(2));
        });

        let index: number = 0;
        while (index < this.NUM_MONSTER_ENTRIES && index < monsterOrder.length) {
            let id: string = monsterOrder[index];
            let queued: number = this._queuedForAscension[id] ? this._queuedForAscension[id].Get() : 0;
            let total: SecNum = INFERNOPORTAL._ascensionData[id];
            
            if (this._monsterUiIds[index] != id) {
                this._monsterUi[index].tName.text = KEYS.Get(CREATURELOCKER._creatures[id].name);
                this._monsterUiIds[index] = id;
                ImageCache.GetImageWithCallBack("monsters/" + id + "-medium.jpg", this.IconLoaded, true, 1, "", [this._monsterUi[index].mcIcon]);
            }
            
            let monsterSize: number = CREATURES.GetProperty(id, "cStorage", 0, true);
            this._monsterUi[index].visible = true;
            this._monsterUi[index].tAvailable.text = queued + " / " + total.Get(); // Simple concatenation replacement for Key params
            this._monsterUi[index].bAdd.Enabled = queued < total.Get() && this._newHousingUsed.Get() + monsterSize <= HOUSING._housingCapacity.Get();
            this._monsterUi[index].bRemove.Enabled = queued > 0;
            index++;
        }
        
        while (index < this.NUM_MONSTER_ENTRIES) {
            if (this._monsterUi[index]) this._monsterUi[index].visible = false;
            index++;
        }

        let storedRatio: number = HOUSING._housingUsed.Get() / HOUSING._housingCapacity.Get();
        let queuedRatio: number = this._newHousingUsed.Get() / HOUSING._housingCapacity.Get();
        this.mcStorage.mcBar.width = this._storageWidth * storedRatio;
        this.mcStorage.mcBarB.x = this._storageWidth * storedRatio;
        this.mcStorage.mcBarB.width = this._storageWidth * (queuedRatio - storedRatio);
        this.tStorage.htmlText = "<b>" + GLOBAL.FormatNumber(this._newHousingUsed.Get()) + " / " + GLOBAL.FormatNumber(HOUSING._housingCapacity.Get()) + " (" + Math.floor(queuedRatio * 100) + "%)</b>";
    }
    
    // ... IconLoaded, QueueMonster, UnqueueMonster, AscendQueuedMonsters, Hide, Center, ScaleUp stubs/logic ...
    public IconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        // stub
    }

    public QueueMonster(param1: string): boolean {
        // implementation stub
        return false;
    }

    public UnqueueMonster(param1: string): boolean {
        // implementation stub
        return false;
    }

    public AscendQueuedMonsters(): void {
        // implementation stub
        this.Hide();
    }
    
    public Hide(param1: MouseEvent = null): void {
        INFERNOPORTAL.HideAscendMonstersDialog();
    }
    
    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }
    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
