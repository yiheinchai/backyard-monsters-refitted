import { SmartFox } from "../../SmartFox";
import { Buddy } from "../Buddy";
import { BuddyVariable } from "../variables/BuddyVariable";
import { ReservedBuddyVariables } from "../variables/ReservedBuddyVariables";
import { SFSBuddyVariable } from "../variables/SFSBuddyVariable";
import { ArrayUtil } from "../../util/ArrayUtil";
import { IBuddyManager } from "./IBuddyManager";

/**
 * SFSBuddyManager - Implementation of the IBuddyManager interface.
 */
export class SFSBuddyManager implements IBuddyManager {
    protected _buddiesByName: { [key: string]: Buddy };
    protected _myVariables: { [key: string]: BuddyVariable };
    protected _myOnlineState: boolean = false;
    protected _inited: boolean = false;
    private _buddyStates: Array<string> = [];
    private _sfs: SmartFox;

    constructor(sfs: SmartFox) {
        this._sfs = sfs;
        this._buddiesByName = {};
        this._myVariables = {};
        this._inited = false;
    }

    public get isInited(): boolean {
        return this._inited;
    }

    public setInited(): void {
        this._inited = true;
    }

    public addBuddy(buddy: Buddy): void {
        this._buddiesByName[buddy.name] = buddy;
    }

    public clearAll(): void {
        this._buddiesByName = {};
    }

    public removeBuddyById(id: number): Buddy | null {
        const buddy = this.getBuddyById(id);
        if (buddy !== null) {
            delete this._buddiesByName[buddy.name];
        }
        return buddy;
    }

    public removeBuddyByName(name: string): Buddy | null {
        const buddy = this.getBuddyByName(name);
        if (buddy !== null) {
            delete this._buddiesByName[name];
        }
        return buddy;
    }

    public getBuddyById(id: number): Buddy | null {
        if (id > -1) {
            for (const name in this._buddiesByName) {
                const buddy = this._buddiesByName[name];
                if (buddy.id === id) {
                    return buddy;
                }
            }
        }
        return null;
    }

    public containsBuddy(name: string): boolean {
        return this.getBuddyByName(name) !== null;
    }

    public getBuddyByName(name: string): Buddy | null {
        return this._buddiesByName[name] || null;
    }

    public getBuddyByNickName(nickName: string): Buddy | null {
        for (const name in this._buddiesByName) {
            const buddy = this._buddiesByName[name];
            if (buddy.nickName === nickName) {
                return buddy;
            }
        }
        return null;
    }

    public get offlineBuddies(): Array<Buddy> {
        const result: Array<Buddy> = [];
        for (const name in this._buddiesByName) {
            const buddy = this._buddiesByName[name];
            if (!buddy.isOnline) {
                result.push(buddy);
            }
        }
        return result;
    }

    public get onlineBuddies(): Array<Buddy> {
        const result: Array<Buddy> = [];
        for (const name in this._buddiesByName) {
            const buddy = this._buddiesByName[name];
            if (buddy.isOnline) {
                result.push(buddy);
            }
        }
        return result;
    }

    public get buddyList(): Array<Buddy> {
        return ArrayUtil.objToArray(this._buddiesByName);
    }

    public getMyVariable(name: string): BuddyVariable | null {
        return this._myVariables[name] || null;
    }

    public get myVariables(): Array<BuddyVariable> {
        return ArrayUtil.objToArray(this._myVariables);
    }

    public get myOnlineState(): boolean {
        if (!this._inited) {
            return false;
        }
        let online = true;
        const bVar = this.getMyVariable(ReservedBuddyVariables.BV_ONLINE);
        if (bVar !== null) {
            online = bVar.getBoolValue();
        }
        return online;
    }

    public get myNickName(): string | null {
        const bVar = this.getMyVariable(ReservedBuddyVariables.BV_NICKNAME);
        return bVar !== null ? bVar.getStringValue() : null;
    }

    public get myState(): string | null {
        const bVar = this.getMyVariable(ReservedBuddyVariables.BV_STATE);
        return bVar !== null ? bVar.getStringValue() : null;
    }

    public get buddyStates(): Array<string> {
        return this._buddyStates;
    }

    public setMyVariable(variable: BuddyVariable): void {
        this._myVariables[variable.name] = variable;
    }

    public setMyVariables(variables: Array<BuddyVariable>): void {
        for (const variable of variables) {
            this.setMyVariable(variable);
        }
    }

    public setMyOnlineState(online: boolean): void {
        this.setMyVariable(new SFSBuddyVariable(ReservedBuddyVariables.BV_ONLINE, online));
    }

    public setMyNickName(nickName: string): void {
        this.setMyVariable(new SFSBuddyVariable(ReservedBuddyVariables.BV_NICKNAME, nickName));
    }

    public setMyState(state: string): void {
        this.setMyVariable(new SFSBuddyVariable(ReservedBuddyVariables.BV_STATE, state));
    }

    public setBuddyStates(states: Array<string>): void {
        this._buddyStates = states;
    }
}
