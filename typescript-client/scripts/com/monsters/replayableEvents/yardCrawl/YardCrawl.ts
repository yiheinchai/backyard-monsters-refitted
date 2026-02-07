import { AttackEvent } from "../../events/AttackEvent";
import { ReplayableEvent } from "../ReplayableEvent";
import { ReplayableEventHandler } from "../ReplayableEventHandler";

// Lazy imports to break circular dependency chains
function getMapRoomManager(): any { return require("../../maproom_manager/MapRoomManager").MapRoomManager; }
function getGLOBAL(): any { return require("../../../../GLOBAL").GLOBAL; }
function getKEYS(): any { return require("../../../../KEYS").KEYS; }
function getBASE(): any { return require("../../../../BASE").BASE; }
function getHOUSING(): any { return require("../../../../HOUSING").HOUSING; }
function getLOGGER(): any { return require("../../../../LOGGER").LOGGER; }



/**
 * Yard crawl - event where player destroys a series of bases.
 */
export class YardCrawl extends ReplayableEvent {
    protected _yardsToDestroy: number = 0;
    protected _yardsDestroyed: number = 0;
    protected _intactBaseList: Array<any> = [];

    constructor() {
        super();
        this._buttonCopy = getKEYS().Get("btn_attack");
    }

    public override set score(value: number) {
        super.score = value;
        this._yardsDestroyed = value;
        this.progress = this._yardsDestroyed / this._yardsToDestroy;
    }

    protected override onInitialize(): void {
        ReplayableEventHandler.callServerMethod("loadbases", [["eventid", this._id]], this.loadedBaseList.bind(this));
    }

    private loadedBaseList(data: Record<string, any>): void {
        this._intactBaseList = [];
        let totalBases: number = 0;
        for (const key in data) {
            const base = data[key];
            if (!(typeof base === "number")) {
                totalBases++;
                if (!base.destroyed) {
                    this._intactBaseList.push(base);
                }
            }
        }
        this._yardsToDestroy = totalBases;
        this.score = this._yardsToDestroy - this._intactBaseList.length;
        this._intactBaseList.sort(this.compareBaseID);
    }

    private compareBaseID(a: any, b: any): number {
        return a.id - b.id;
    }

    public override pressedActionButton(): void {
        if (!this._intactBaseList || this._intactBaseList.length === 0) {
            return;
        }
        const hasMonsters: boolean = getHOUSING()._housingUsed.Get() > 0;
        if (!getGLOBAL()._bMap || !getGLOBAL()._bFlinger || !getGLOBAL()._bHousing || !hasMonsters) {
            getGLOBAL().Message("You need a working Maproom, Flinger, Housing and some monsters to participate in this event");
            return;
        }
        let baseUrl: string | null = null;
        if (getMapRoomManager().instance.isInMapRoom2or3) {
            getMapRoomManager().instance.mapRoomVersion = getMapRoomManager().MAP_ROOM_VERSION_1;
            baseUrl = getGLOBAL()._infBaseURL;
        }
        const baseId: number = parseInt(this._intactBaseList[0].id);
        getLOGGER().StatB({
            "st1": "ERS",
            "st2": this._name,
            "st3": "Attack_Num_" + baseId,
            "value": baseId
        }, "Attack_Start");
        getGLOBAL().eventDispatcher.addEventListener(AttackEvent.ATTACK_OVER, this.finishedAttack.bind(this));
        getBASE().LoadBase(baseUrl, 0, baseId, "wmattack");
    }

    protected finishedAttack(event: AttackEvent): void {
        const baseId: number = parseInt(this._intactBaseList[0].id);
        getLOGGER().StatB({
            "st1": "ERS",
            "st2": this._name,
            "st3": "Attack_Num_" + baseId,
            "value": baseId
        }, event.wasBaseDestroyed ? "Attack_Success" : "Attack_Fail");
        getGLOBAL().eventDispatcher.removeEventListener(AttackEvent.ATTACK_OVER, this.finishedAttack.bind(this));
    }
}
