import { ISFSArray } from "./data/ISFSArray";
import { Buddy } from "./Buddy";
import { BuddyVariable } from "./variables/BuddyVariable";
import { ReservedBuddyVariables } from "./variables/ReservedBuddyVariables";
import { SFSBuddyVariable } from "./variables/SFSBuddyVariable";
import { ArrayUtil } from "../util/ArrayUtil";

/**
 * SFSBuddy - Implementation of the Buddy interface.
 */
export class SFSBuddy implements Buddy {
    protected _name: string;
    protected _id: number;
    protected _isBlocked: boolean;
    protected _variables: { [key: string]: BuddyVariable };
    protected _isTemp: boolean;

    constructor(id: number, name: string, isBlocked: boolean = false, isTemp: boolean = false) {
        this._id = id;
        this._name = name;
        this._isBlocked = isBlocked;
        this._variables = {};
        this._isTemp = isTemp;
    }

    public static fromSFSArray(arr: ISFSArray): Buddy {
        const buddy = new SFSBuddy(
            arr.getInt(0),
            arr.getUtfString(1),
            arr.getBool(2),
            arr.size() > 3 ? arr.getBool(4) : false
        );
        const varsArray = arr.getSFSArray(3);
        for (let i = 0; i < varsArray.size(); i++) {
            buddy.setVariable(SFSBuddyVariable.fromSFSArray(varsArray.getSFSArray(i)));
        }
        return buddy;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get isBlocked(): boolean {
        return this._isBlocked;
    }

    public get isTemp(): boolean {
        return this._isTemp;
    }

    public get isOnline(): boolean {
        const bVar = this.getVariable(ReservedBuddyVariables.BV_ONLINE);
        const online = bVar === null ? true : bVar.getBoolValue();
        return online && this._id > -1;
    }

    public get state(): string {
        const bVar = this.getVariable(ReservedBuddyVariables.BV_STATE);
        return bVar === null ? "" : bVar.getStringValue();
    }

    public get nickName(): string {
        const bVar = this.getVariable(ReservedBuddyVariables.BV_NICKNAME);
        return bVar === null ? "" : bVar.getStringValue();
    }

    public get variables(): Array<BuddyVariable> {
        return ArrayUtil.objToArray(this._variables);
    }

    public getVariable(name: string): BuddyVariable | null {
        return this._variables[name] || null;
    }

    public getOfflineVariables(): Array<BuddyVariable> {
        const result: Array<BuddyVariable> = [];
        for (const key in this._variables) {
            const bVar = this._variables[key];
            if (bVar.name.charAt(0) === SFSBuddyVariable.OFFLINE_PREFIX) {
                result.push(bVar);
            }
        }
        return result;
    }

    public getOnlineVariables(): Array<BuddyVariable> {
        const result: Array<BuddyVariable> = [];
        for (const key in this._variables) {
            const bVar = this._variables[key];
            if (bVar.name.charAt(0) !== SFSBuddyVariable.OFFLINE_PREFIX) {
                result.push(bVar);
            }
        }
        return result;
    }

    public containsVariable(name: string): boolean {
        return this._variables[name] !== undefined;
    }

    public setVariable(variable: BuddyVariable): void {
        this._variables[variable.name] = variable;
    }

    public setVariables(variables: Array<BuddyVariable>): void {
        for (const bVar of variables) {
            this.setVariable(bVar);
        }
    }

    public setId(id: number): void {
        this._id = id;
    }

    public setBlocked(blocked: boolean): void {
        this._isBlocked = blocked;
    }

    public removeVariable(name: string): void {
        delete this._variables[name];
    }

    public clearVolatileVariables(): void {
        for (const bVar of this.variables) {
            if (bVar.name.charAt(0) !== SFSBuddyVariable.OFFLINE_PREFIX) {
                this.removeVariable(bVar.name);
            }
        }
    }

    public toString(): string {
        return "[Buddy: " + this.name + ", id: " + this.id + "]";
    }
}
