
import { HousingPersistentPopup_CLIP } from './HousingPersistentPopup_CLIP';
import { HousingPersistentMonsterBar } from './HousingPersistentMonsterBar';
import { BASE } from './BASE';
import { KEYS } from './KEYS';
import { GLOBAL } from './GLOBAL';
import { HOUSING } from './HOUSING';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { CREATURELOCKER } from './CREATURELOCKER';
import { CREATURES } from './CREATURES';
import { ImageCache } from './ImageCache';
import { Building } from './Building'; // Assuming exists
import { PersistantJuiceAllPopup } from './PersistantJuiceAllPopup'; // Stub needed
import { InstanceManager } from './InstanceManager'; // Stub needed
import { MonsterBase } from './MonsterBase'; // Stub needed
import { CreepInfo } from './CreepInfo'; // Stub needed
import { Player } from './Player'; // Stub needed

import MovieClip from 'openfl/display/MovieClip';
import Sprite from 'openfl/display/Sprite';
import MouseEvent from 'openfl/events/MouseEvent';
import TextField from 'openfl/text/TextField';

// Stubs
const ScrollSet: any = { BROWN: 0 }; 

export class HousingPersistentPopup extends HousingPersistentPopup_CLIP {
    public _juiceList: any;
    public m_monsterBarList: any;
    private m_bunkerIDList: any[];
    public _scroller: any;
    private m_strLastSelectedJuiced: string = "";
    private m_nJuiceAmount: number = 0;
    private m_bShownPopup: boolean = false;
    private m_JuiceAllPopup: any;
    private k_juiceAllPopupLimit: number = 5;
    private k_offsetY: number = 51;
    private k_offsetTextY: number = 25;
    private k_titlesX: number = 15;
    private k_aBit: number = 8;

    constructor() {
        super();
        this._juiceList = {};
        this.m_monsterBarList = {};
        this.m_bunkerIDList = [];

        if (!BASE.isInfernoMainYardOrOutpost) {
            this.bTransfer.SetupKey("btn_ascendmonsters");
            this.bTransfer.addEventListener(MouseEvent.CLICK, this.ascend.bind(this));
        } else {
            this.bTransfer.visible = false;
        }

        this.bJuice.SetupKey("mh_nomonsters_btn");
        this.bJuice.addEventListener(MouseEvent.CLICK, this.juiceCheck.bind(this));
        this.bClear.SetupKey("btn_clear");
        this.bClear.addEventListener(MouseEvent.CLICK, this.selectNone.bind(this));
        this.bHealAll.SetupKey("btn_housing_heal_all");
        // this.bHealAll.Highlight = true;
        this.bHealAll.addEventListener(MouseEvent.CLICK, this.healInstantAllShinyCheck.bind(this));

        this.tHealthText.htmlText = "<b>" + KEYS.Get("mh_health_column_label") + "</b>";
        this.tCapacityText.htmlText = "<b>" + KEYS.Get("mh_capacity_column_label") + "</b>";

        if (GLOBAL._bJuicer) {
            this.tJuicingText.htmlText = KEYS.Get("mh_juicing_txt");
        } else {
            this.tJuicingText.htmlText = "";
            this.bJuice.visible = false;
            this.bClear.visible = false;
        }

        this.tTitleHealing.htmlText = KEYS.Get("mh_healing_section_label");
        this.tTitleHealing.visible = false;
        this.tTitleHousing.htmlText = KEYS.Get("mh_housing_section_label");
        this.tTitleBunkers.htmlText = KEYS.Get("mh_bunkers_section_label");
        this.tTitleBunkers.visible = false;
        
        this.m_bgWhite.x = this.m_bgWhite.y = 0;
        this.m_bgWhite.height = 0;
        this.monsterContainer.addChild(this.m_bgWhite);
        this.gotoAndStop(1);
        
        this.Update();
        this.reorganize();
    }

    private ascend(e: MouseEvent): void {
        // ascend stub
    }

    private selectNone(e: MouseEvent = null): void {
        this._juiceList = {};
        this.Update();
    }

    private healInstantAllShinyCheck(e: MouseEvent): void {
        // heal all check stub
    }

    private juiceCheck(e: MouseEvent): void {
        // juice check stub
    }

    private updateCapacityBars(): void {
        // stub
    }

    private tickVisualHeal(): void {
        // stub
    }

    private reorganize(): void {
        // stub
    }

    public Update(): void {
        this.getHousableCreatures();
        this.tickVisualHeal();
        // this.updateHealAllButton();
        HOUSING.HousingSpace();
        
        // Logic to update storage bars based on housing used
        if (HOUSING._housingCapacity) {
             // ...
        }
        
        if (this._scroller && this._scroller.Update) {
            this._scroller.Update();
        }
    }

    private getHousableCreatures(): any[] {
        return [];
    }

    public Hide(param1: MouseEvent = null): void {
        HOUSING.Hide(param1);
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }

    // iconLoaded stub...
    public iconLoaded(param1: string, param2: any, param3: any[]): void {
        // ...
    }
}
