import { ISFSArray } from "./data/ISFSArray";
import { IRoomManager } from "./managers/IRoomManager";
import { IUserManager } from "./managers/IUserManager";
import { SFSUserManager } from "./managers/SFSUserManager";
import { RoomVariable } from "./variables/RoomVariable";
import { SFSRoomVariable } from "./variables/SFSRoomVariable";
import { SFSError } from "../exceptions/SFSError";
import { ArrayUtil } from "../util/ArrayUtil";
import { Room } from "./Room";
import { User } from "./User";

/**
 * SFSRoom - Implementation of the Room interface.
 */
export class SFSRoom implements Room {
    protected _id: number;
    protected _name: string;
    protected _groupId: string;
    protected _isGame: boolean = false;
    protected _isHidden: boolean = false;
    protected _isJoined: boolean = false;
    protected _isPasswordProtected: boolean = false;
    protected _isManaged: boolean = true;
    protected _variables: { [key: string]: RoomVariable };
    protected _properties: { [key: string]: any };
    protected _userManager: IUserManager;
    protected _maxUsers: number = 0;
    protected _maxSpectators: number = 0;
    protected _userCount: number = 0;
    protected _specCount: number = 0;
    protected _roomManager: IRoomManager | null = null;

    constructor(id: number, name: string, groupId: string = "default") {
        this._id = id;
        this._name = name;
        this._groupId = groupId;
        this._isJoined = this._isGame = this._isHidden = false;
        this._isManaged = true;
        this._userCount = this._specCount = 0;
        this._variables = {};
        this._properties = {};
        this._userManager = new SFSUserManager(null);
    }

    public static fromSFSArray(arr: ISFSArray): Room {
        const room: Room = new SFSRoom(arr.getInt(0), arr.getUtfString(1), arr.getUtfString(2));
        room.isGame = arr.getBool(3);
        room.isHidden = arr.getBool(4);
        room.isPasswordProtected = arr.getBool(5);
        room.userCount = arr.getShort(6);
        room.maxUsers = arr.getShort(7);
        
        const varsArray: ISFSArray = arr.getSFSArray(8);
        if (varsArray.size() > 0) {
            const variables: Array<RoomVariable> = [];
            for (let i = 0; i < varsArray.size(); i++) {
                const roomVar = SFSRoomVariable.fromSFSArray(varsArray.getSFSArray(i));
                variables.push(roomVar);
            }
            room.setVariables(variables);
        }
        
        if (room.isGame) {
            room.spectatorCount = arr.getShort(9);
            room.maxSpectators = arr.getShort(10);
        }
        return room;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get groupId(): string {
        return this._groupId;
    }

    public get isGame(): boolean {
        return this._isGame;
    }

    public get isHidden(): boolean {
        return this._isHidden;
    }

    public get isJoined(): boolean {
        return this._isJoined;
    }

    public get isPasswordProtected(): boolean {
        return this._isPasswordProtected;
    }

    public set isPasswordProtected(value: boolean) {
        this._isPasswordProtected = value;
    }

    public set isJoined(value: boolean) {
        this._isJoined = value;
    }

    public set isGame(value: boolean) {
        this._isGame = value;
    }

    public set isHidden(value: boolean) {
        this._isHidden = value;
    }

    public get isManaged(): boolean {
        return this._isManaged;
    }

    public set isManaged(value: boolean) {
        this._isManaged = value;
    }

    public getVariables(): Array<RoomVariable> {
        return ArrayUtil.objToArray(this._variables);
    }

    public getVariable(name: string): RoomVariable | null {
        return this._variables[name] || null;
    }

    public get userCount(): number {
        if (this._isJoined) {
            return this._userManager.userCount;
        }
        return this._userCount;
    }

    public get maxUsers(): number {
        return this._maxUsers;
    }

    public get capacity(): number {
        return this._maxUsers + this._maxSpectators;
    }

    public get spectatorCount(): number {
        if (this._isJoined) {
            let count = 0;
            for (const user of this._userManager.getUserList()) {
                if (user.isSpectatorInRoom(this)) {
                    count++;
                }
            }
            return count;
        }
        return this._specCount;
    }

    public get maxSpectators(): number {
        return this._maxSpectators;
    }

    public set userCount(value: number) {
        this._userCount = value;
    }

    public set maxUsers(value: number) {
        this._maxUsers = value;
    }

    public set spectatorCount(value: number) {
        this._specCount = value;
    }

    public set maxSpectators(value: number) {
        this._maxSpectators = value;
    }

    public getUserByName(name: string): User | null {
        return this._userManager.getUserByName(name);
    }

    public getUserById(id: number): User | null {
        return this._userManager.getUserById(id);
    }

    public get userList(): Array<User> {
        return this._userManager.getUserList();
    }

    public get playerList(): Array<User> {
        const result: Array<User> = [];
        for (const user of this._userManager.getUserList()) {
            if (user.isPlayerInRoom(this)) {
                result.push(user);
            }
        }
        return result;
    }

    public get spectatorList(): Array<User> {
        const result: Array<User> = [];
        for (const user of this._userManager.getUserList()) {
            if (user.isSpectatorInRoom(this)) {
                result.push(user);
            }
        }
        return result;
    }

    public removeUser(user: User): void {
        this._userManager.removeUser(user);
    }

    public setVariable(variable: RoomVariable): void {
        if (variable.isNull()) {
            delete this._variables[variable.name];
        } else {
            this._variables[variable.name] = variable;
        }
    }

    public setVariables(variables: Array<RoomVariable>): void {
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

    public addUser(user: User): void {
        this._userManager.addUser(user);
    }

    public containsUser(user: User): boolean {
        return this._userManager.containsUser(user);
    }

    public get roomManager(): IRoomManager | null {
        return this._roomManager;
    }

    public set roomManager(value: IRoomManager) {
        if (this._roomManager !== null) {
            throw new SFSError("Room manager already assigned. Room: " + this);
        }
        this._roomManager = value;
    }

    public setPasswordProtected(value: boolean): void {
        this._isPasswordProtected = value;
    }

    public toString(): string {
        return "[Room: " + this._name + ", Id: " + this._id + ", GroupId: " + this._groupId + "]";
    }

    public merge(room: Room): void {
        for (const variable of room.getVariables()) {
            this._variables[variable.name] = variable;
        }
        (this._userManager as SFSUserManager).clearAll();
        for (const user of room.userList) {
            this._userManager.addUser(user);
        }
    }
}
