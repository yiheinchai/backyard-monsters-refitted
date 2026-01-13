import { ISFSObject } from "../entities/data/ISFSObject";
import { IMessage } from "./IMessage";

/**
 * Message - Implementation of IMessage interface.
 */
export class Message implements IMessage {
    private _id: number = 0;
    private _content!: ISFSObject;
    private _targetController: number = 0;
    private _isEncrypted: boolean = false;
    private _isUDP: boolean = false;
    private _packetId: number = NaN;

    constructor() {
        this._isEncrypted = false;
        this._isUDP = false;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get content(): ISFSObject {
        return this._content;
    }

    public set content(value: ISFSObject) {
        this._content = value;
    }

    public get targetController(): number {
        return this._targetController;
    }

    public set targetController(value: number) {
        this._targetController = value;
    }

    public get isEncrypted(): boolean {
        return this._isEncrypted;
    }

    public set isEncrypted(value: boolean) {
        this._isEncrypted = value;
    }

    public get isUDP(): boolean {
        return this._isUDP;
    }

    public set isUDP(value: boolean) {
        this._isUDP = value;
    }

    public get packetId(): number {
        return this._packetId;
    }

    public set packetId(value: number) {
        this._packetId = value;
    }

    public toString(): string {
        let result = "{ Message id: " + this._id + " }\n";
        result += "{ Dump: }\n";
        return result + this._content.getDump();
    }
}
