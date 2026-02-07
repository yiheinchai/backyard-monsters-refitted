import { WMBASE } from './com/monsters/ai/WMBASE';
import { ICoreBuilding } from './com/monsters/interfaces/ICoreBuilding';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Rectangle from 'openfl/geom/Rectangle';
import { BSTORAGE } from './BSTORAGE';

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("./com/monsters/maproom_manager/MapRoomManager").MapRoomManager; }
function getBASE(): any { return require("./BASE").BASE; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getMAP(): any { return require("./MAP").MAP; }


/**
 * BUILDING112 - Outpost Town Hall (Inferno)
 * Extends BSTORAGE for the outpost core building
 */
export class BUILDING112 extends BSTORAGE implements ICoreBuilding {
    constructor() {
        super();
        this._type = 112;
        this._footprint = [new Rectangle(0, 0, 130, 130)];
        this._gridCost = [[new Rectangle(0, 0, 130, 130), 10], [new Rectangle(10, 10, 110, 110), 200]];
        this._spoutPoint = new Point(0, -55);
        this._spoutHeight = 115;
        this.SetProps();
    }

    public override Repair(): void {
        super.Repair();
    }

    public override Place(event: MouseEvent | null = null): void {
        if (!getMAP()._dragged) {
            super.Place(event);
            this._hasResources = true;
        }
    }

    public override Cancel(): void {
        getGLOBAL().setTownHall(null);
        super.Cancel();
    }

    public override Recycle(): void {
        getGLOBAL().Message(getKEYS().Get("msg_recycleoutpost"));
    }

    public override RecycleB(event: MouseEvent | null = null): void {
        getGLOBAL().Message(getKEYS().Get("msg_recycleoutpost"));
    }

    public override RecycleC(): void {
        getGLOBAL().Message(getKEYS().Get("msg_recycleoutpost"));
    }

    public override Destroyed(byAttacker: boolean = true): void {
        super.Destroyed(byAttacker);
        if ((!getMapRoomManager().instance.isInMapRoom2or3 || getBASE().isInfernoMainYardOrOutpost) && getGLOBAL().mode === "wmattack") {
            WMBASE._destroyed = true;
        }
    }

    public override Description(): void {
        super.Description();
        this._buildingDescription = getKEYS().Get("outpost_upgradedesc");
        this._recycleDescription = getKEYS().Get("th_recycledesc");
    }

    public override Update(force: boolean = false): void {
        super.Update(force);
    }

    public override Constructed(): void {
        super.Constructed();
        getGLOBAL().setTownHall(this);
    }

    public override Setup(building: any): void {
        super.Setup(building);
        getGLOBAL().setTownHall(this);
    }
}
