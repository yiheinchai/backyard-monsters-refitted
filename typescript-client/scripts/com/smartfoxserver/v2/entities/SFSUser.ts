import { ISFSArray } from "./data/ISFSArray";
import { IUserManager } from "./managers/IUserManager";
import { SFSUserVariable } from "./variables/SFSUserVariable";
import { UserVariable } from "./variables/UserVariable";
import { SFSError } from "../exceptions/SFSError";
import { User } from "./User";
import { Room } from "./Room";
import { UserPrivileges } from "./UserPrivileges";

/**
 * SFSUser - Implementation of the User interface.
 */
export class SFSUser implements User {
    protected _id: number = -1;
    protected _privilegeId: number = 0;
    protected _name: string;
    protected _isItMe: boolean;
    protected _variables: { [key: string]: UserVariable };
    protected _properties: { [key: string]: any };
    protected _isModerator: boolean;
    protected _playerIdByRoomId: { [key: number]: number };
    protected _userManager: IUserManager | null = null;

    constructor(id: number, name: string, isItMe: boolean = false) {
        this._id = id;
        this._name = name;
        this._isItMe = isItMe;
        this._variables = {};
        this._properties = {};
        this._isModerator = false;
        this._playerIdByRoomId = {};
    }

    public static fromSFSArray(arr: ISFSArray, room: Room | null = null): User {
        const user: User = new SFSUser(arr.getInt(0), arr.getUtfString(1));
        user.privilegeId = arr.getShort(2);
        if (room !== null) {
            user.setPlayerId(arr.getShort(3), room);
        }
        const varsArray: ISFSArray = arr.getSFSArray(4);
        for (let i = 0; i < varsArray.size(); i++) {
            user.setVariable(SFSUserVariable.fromSFSArray(varsArray.getSFSArray(i)));
        }
        return user;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get playerId(): number {
        return this.getPlayerId(this.userManager!.smartFox.lastJoinedRoom!);
    }

    public isJoinedInRoom(room: Room): boolean {
        return room.containsUser(this);
    }

    public get privilegeId(): number {
        return this._privilegeId;
    }

    public set privilegeId(value: number) {
        this._privilegeId = value;
    }

    public isGuest(): boolean {
        return this._privilegeId === UserPrivileges.GUEST;
    }

    public isStandardUser(): boolean {
        return this._privilegeId === UserPrivileges.STANDARD;
    }

    public isModerator(): boolean {
        return this._privilegeId === UserPrivileges.MODERATOR;
    }

    public isAdmin(): boolean {
        return this._privilegeId === UserPrivileges.ADMINISTRATOR;
    }

    public get isPlayer(): boolean {
        return this.playerId > 0;
    }

    public get isSpectator(): boolean {
        return !this.isPlayer;
    }

    public getPlayerId(room: Room): number {
        let playerId = 0;
        if (this._playerIdByRoomId[room.id] !== undefined) {
            playerId = this._playerIdByRoomId[room.id];
        }
        return playerId;
    }

    public setPlayerId(playerId: number, room: Room): void {
        this._playerIdByRoomId[room.id] = playerId;
    }

    public removePlayerId(room: Room): void {
        delete this._playerIdByRoomId[room.id];
    }

    public isPlayerInRoom(room: Room): boolean {
        return this._playerIdByRoomId[room.id] > 0;
    }

    public isSpectatorInRoom(room: Room): boolean {
        return this._playerIdByRoomId[room.id] < 0;
    }

    public get isItMe(): boolean {
        return this._isItMe;
    }

    public get userManager(): IUserManager | null {
        return this._userManager;
    }

    public set userManager(value: IUserManager) {
        if (this._userManager !== null) {
            throw new SFSError("Cannot re-assign the User Manager. Already set. User: " + this);
        }
        this._userManager = value;
    }

    public getVariables(): Array<UserVariable> {
        const result: Array<UserVariable> = [];
        for (const key in this._variables) {
            result.push(this._variables[key]);
        }
        return result;
    }

    public getVariable(name: string): UserVariable | null {
        return this._variables[name] || null;
    }

    public setVariable(variable: UserVariable): void {
        if (variable !== null) {
            if (variable.isNull()) {
                delete this._variables[variable.name];
            } else {
                this._variables[variable.name] = variable;
            }
        }
    }

    public setVariables(variables: Array<UserVariable>): void {
        for (const variable of variables) {
            this.setVariable(variable);
        }
    }

    public containsVariable(name: string): boolean {
        return this._variables[name] !== undefined;
    }

    private removeUserVariable(name: string): void {
        delete this._variables[name];
    }

    public get properties(): { [key: string]: any } {
        return this._properties;
    }

    public set properties(value: { [key: string]: any }) {
        this._properties = value;
    }

    public toString(): string {
        return "[User: " + this._name + ", Id: " + this._id + ", isMe: " + this._isItMe + "]";
    }
}
