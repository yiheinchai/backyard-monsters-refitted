import { SFSConstants } from "../entities/SFSConstants";
import { RoomEvents } from "./RoomEvents";
import { RoomExtension } from "./RoomExtension";
import { RoomPermissions } from "./RoomPermissions";

/**
 * RoomSettings - Configuration settings for room creation.
 */
export class RoomSettings {
    private _name: string;
    private _password: string;
    private _groupId: string;
    private _isGame: boolean;
    private _maxUsers: number;
    private _maxSpectators: number;
    private _maxVariables: number;
    private _variables: Array<any> | null = null;
    private _permissions: RoomPermissions | null = null;
    private _events: RoomEvents | null = null;
    private _extension: RoomExtension | null = null;

    constructor(name: string) {
        this._name = name;
        this._password = "";
        this._isGame = false;
        this._maxUsers = 10;
        this._maxSpectators = 0;
        this._maxVariables = 5;
        this._groupId = SFSConstants.DEFAULT_GROUP_ID;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this._password = value;
    }

    public get isGame(): boolean {
        return this._isGame;
    }

    public set isGame(value: boolean) {
        this._isGame = value;
    }

    public get maxUsers(): number {
        return this._maxUsers;
    }

    public set maxUsers(value: number) {
        this._maxUsers = value;
    }

    public get maxVariables(): number {
        return this._maxVariables;
    }

    public set maxVariables(value: number) {
        this._maxVariables = value;
    }

    public get maxSpectators(): number {
        return this._maxSpectators;
    }

    public set maxSpectators(value: number) {
        this._maxSpectators = value;
    }

    public get variables(): Array<any> | null {
        return this._variables;
    }

    public set variables(value: Array<any> | null) {
        this._variables = value;
    }

    public get permissions(): RoomPermissions | null {
        return this._permissions;
    }

    public set permissions(value: RoomPermissions | null) {
        this._permissions = value;
    }

    public get events(): RoomEvents | null {
        return this._events;
    }

    public set events(value: RoomEvents | null) {
        this._events = value;
    }

    public get extension(): RoomExtension | null {
        return this._extension;
    }

    public set extension(value: RoomExtension | null) {
        this._extension = value;
    }

    public get groupId(): string {
        return this._groupId;
    }

    public set groupId(value: string) {
        this._groupId = value;
    }
}
