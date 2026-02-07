import MovieClip from 'openfl/display/MovieClip';
import MouseEvent from 'openfl/events/MouseEvent';
import Rectangle from 'openfl/geom/Rectangle';
import { CreepBase } from './com/monsters/monsters/creeps/CreepBase';
import { BFOUNDATION } from './BFOUNDATION';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getHOUSING(): any { return require("./HOUSING").HOUSING; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getPOPUPS(): any { return require("./POPUPS").POPUPS; }


/**
 * BUILDING15 - Monster Housing
 * Extends BFOUNDATION for creature storage building
 */
export class BUILDING15 extends BFOUNDATION {
    public _capacity: number = 0;
    public _space: number = 0;
    public _housing: Record<string, any> = {};

    constructor() {
        super();
        this._type = 15;
        this._capacity = 0;
        this._housing = {};
        this._footprint = [new Rectangle(0, 0, 160, 160)];
        this._gridCost = [
            [new Rectangle(10, 10, 140, 20), 400],
            [new Rectangle(130, 30, 20, 120), 400],
            [new Rectangle(10, 30, 20, 120), 400],
            [new Rectangle(30, 130, 30, 20), 400],
            [new Rectangle(100, 130, 30, 20), 400]
        ];
        this.SetProps();
    }

    public override StopMoveB(): void {
        super.StopMoveB();
        this.UpdateHousedCreatureTargets();
    }

    public override Description(): void {
        super.Description();
        this._upgradeDescription = getKEYS().Get("bdg_housing_capacitydesc", {
            v1: getGLOBAL().FormatNumber(this._buildingProps.capacity[this._lvl.Get() - 1]),
            v2: getGLOBAL().FormatNumber(this._buildingProps.capacity[this._lvl.Get()])
        });
        if (this._recycleCosts !== null) {
            this._recycleDescription = `<b>${getKEYS().Get("bdg_housing_recycledesc")}</b><br>${this._recycleCosts}`;
        }
        getHOUSING().HousingSpace();
        if (getBASE().isMainYardOrInfernoMainYard) {
            this._blockRecycle = false;
        }
        if (getHOUSING()._housingSpace.Get() - this._buildingProps.capacity[this._lvl.Get() - 1] < 0) {
            this._recycleDescription = `<font color="#CC0000">${getKEYS().Get("bdg_housing_recyclewarning")}</font>`;
            this._blockRecycle = true;
        }
    }

    public override Constructed(): void {
        super.Constructed();
        getHOUSING().AddHouse(this);
    }

    public override Upgraded(): void {
        super.Upgraded();
        getHOUSING().HousingSpace();
    }

    public override Tick(seconds: number): void {
        super.Tick(seconds);
    }

    public override Update(force: boolean = false): void {
        super.Update(force);
    }

    public override RecycleC(): void {
        super.RecycleC();
        getHOUSING().HousingSpace();
        getHOUSING().RemoveHouse(this);
        this.RelocateHousedCreatures();
    }

    public override Destroyed(byAttacker: boolean = true): void {
        super.Destroyed(byAttacker);
        const isMapRoom3: boolean = getMapRoomManager().instance.isInMapRoom3;
        for (const creature of this._creatures) {
            (creature as CreepBase).setHealth(isMapRoom3 ? (creature as CreepBase).health * 0.5 : 0);
        }
        if (!getMapRoomManager().instance.isInMapRoom3) {
            getHOUSING().Cull();
            getHOUSING().RemoveHouse(this);
        }
    }

    public override Setup(building: any): void {
        super.Setup(building);
        if (this.m_isCleared) return;
        if (this.health > 10 && this.health < this.maxHealth && this.health % 1000 === 0) {
            this.setHealth(this.maxHealth);
        }
        if (this._countdownBuild.Get() === 0) {
            getHOUSING().AddHouse(this);
        }
    }
}
