import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { SecNum } from './com/cc/utils/SecNum';
import { ImageCache } from './com/monsters/display/ImageCache';
import { InfernoTransferPopup_CLIP } from './InfernoTransferPopup_CLIP';
import { InfernoTransferMonster_CLIP } from './InfernoTransferMonster_CLIP';
import { CREATURELOCKER } from './CREATURELOCKER';
import { CREATURES } from './CREATURES';
import { GLOBAL } from './GLOBAL';
import { HOUSING } from './HOUSING';
import { INFERNOPORTAL } from './INFERNOPORTAL';
import { KEYS } from './KEYS';
import { POPUPSETTINGS } from './POPUPSETTINGS';

export class INFERNO_ASCENSION_POPUP extends InfernoTransferPopup_CLIP {
    private readonly NUM_MONSTER_ENTRIES: number = 15;
    public _queuedForAscension: any;
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
            this.SetupSection(this["m" + (i + 1)], i);
        }
        this._storageWidth = this.mcStorage.width / this.mcStorage.scaleX;
        this.Update();
    }

    private SetupSection(section: InfernoTransferMonster_CLIP, index: number): void {
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
        let id: string;
        let total: SecNum;
        let monsterSize: number;
        let queued: number;
        let index: number;
        const monsterOrder: string[] = [];
        this._newHousingUsed.Set(HOUSING._housingUsed.Get());
        for (id in INFERNOPORTAL._ascensionData) {
            total = INFERNOPORTAL._ascensionData[id];
            if (total.Get() > 0) {
                monsterSize = CREATURES.GetProperty(id, "cStorage", 0, true);
                queued = this._queuedForAscension[id] ? Number(this._queuedForAscension[id].Get()) : 0;
                this._newHousingUsed.Add(queued * monsterSize);
                monsterOrder.push(id);
            }
        }
        monsterOrder.sort((param1: string, param2: string): number => {
            return Number(param1.substring(2)) - Number(param2.substring(2));
        });
        index = 0;
        while (index < this.NUM_MONSTER_ENTRIES && index < monsterOrder.length) {
            id = String(monsterOrder[index]);
            queued = this._queuedForAscension[id] ? Number(this._queuedForAscension[id].Get()) : 0;
            total = INFERNOPORTAL._ascensionData[id];
            if (this._monsterUiIds[index] != id) {
                this._monsterUi[index].tName.text = KEYS.Get(CREATURELOCKER._creatures[id].name);
                this._monsterUiIds[index] = id;
                ImageCache.GetImageWithCallBack("monsters/" + id + "-medium.jpg", this.IconLoaded.bind(this), true, 1, "", [this._monsterUi[index].mcIcon]);
            }
            monsterSize = CREATURES.GetProperty(id, "cStorage", 0, true);
            this._monsterUi[index].visible = true;
            this._monsterUi[index].tAvailable.text = KEYS.Get("ascdlg_monsters_available", {
                "v1": queued,
                "v2": total.Get()
            });
            this._monsterUi[index].tAvailable.text = queued + " / " + total.Get();
            this._monsterUi[index].bAdd.Enabled = queued < total.Get() && this._newHousingUsed.Get() + monsterSize <= HOUSING._housingCapacity.Get();
            this._monsterUi[index].bRemove.Enabled = queued > 0;
            index++;
        }
        while (index < this.NUM_MONSTER_ENTRIES) {
            this._monsterUi[index].visible = false;
            index++;
        }
        const storedRatio = HOUSING._housingUsed.Get() / HOUSING._housingCapacity.Get();
        const queuedRatio = this._newHousingUsed.Get() / HOUSING._housingCapacity.Get();
        (this.mcStorage as any).mcBar.width = this._storageWidth * storedRatio;
        (this.mcStorage as any).mcBarB.x = this._storageWidth * storedRatio;
        (this.mcStorage as any).mcBarB.width = this._storageWidth * (queuedRatio - storedRatio);
        this.tStorage.htmlText = "<b>" + GLOBAL.FormatNumber(this._newHousingUsed.Get()) + " / " + GLOBAL.FormatNumber(HOUSING._housingCapacity.Get()) + " (" + Math.floor(queuedRatio * 100) + "%)</b>";
    }

    public IconLoaded(param1: string, param2: BitmapData, param3: any[] = null): void {
        const _loc4_ = new Bitmap(param2);
        _loc4_.smoothing = true;
        param3[0].mcImage.addChild(_loc4_);
    }

    public QueueMonster(param1: string): boolean {
        const _loc2_ = CREATURES.GetProperty(param1, "cStorage", 0, true);
        if (!this._queuedForAscension[param1]) {
            this._queuedForAscension[param1] = new SecNum(0);
        }
        if (this._newHousingUsed.Get() + _loc2_ > HOUSING._housingCapacity.Get()) {
            return false;
        }
        if (this._queuedForAscension[param1].Get() < INFERNOPORTAL._ascensionData[param1].Get()) {
            this._queuedForAscension[param1].Add(1);
            this.Update();
            return true;
        }
        return false;
    }

    public UnqueueMonster(param1: string): boolean {
        if (!this._queuedForAscension[param1] || this._queuedForAscension[param1].Get() <= 0) {
            return false;
        }
        this._queuedForAscension[param1].Add(-1);
        this.Update();
        return true;
    }

    public AscendQueuedMonsters(): void {
        let _loc1_: SecNum;
        const _loc2_ = 1;
        const _loc3_ = INFERNOPORTAL.building.x + 100;
        const _loc4_ = INFERNOPORTAL.building.y + 100;
        const _loc5_ = new Point();
        let counter = 1;
        for (const _loc6_ in this._queuedForAscension) {
            _loc1_ = this._queuedForAscension[_loc6_];
            while (_loc1_.Get() > 0) {
                _loc1_.Add(-1);
                INFERNOPORTAL._ascensionData[_loc6_].Add(-1);
                _loc5_.x = _loc3_ + Math.log(counter) * 16 * Math.cos(counter);
                _loc5_.y = _loc4_ - Math.log(counter) * 16 * Math.sin(Math.log(counter) * 4);
                HOUSING.HousingStore(_loc6_, _loc5_);
                counter++;
            }
        }
        INFERNOPORTAL.PageAscensionData();
        this.Hide();
    }

    public Hide(): void {
        INFERNOPORTAL.HideAscendMonstersDialog();
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
