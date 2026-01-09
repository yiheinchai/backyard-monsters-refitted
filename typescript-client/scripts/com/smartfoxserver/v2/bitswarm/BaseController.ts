import { SFSError } from "../exceptions/SFSError";
import { Logger } from "../logging/Logger";
import { IController } from "./IController";
import { IMessage } from "./IMessage";

/**
 * BaseController - Base class for message controllers.
 */
export class BaseController implements IController {
    protected _id: number = -1;
    protected log: Logger;

    constructor() {
        this.log = Logger.getInstance();
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        if (this._id === -1) {
            this._id = value;
            return;
        }
        throw new SFSError("Controller ID is already set: " + this._id + ". Can't be changed at runtime!");
    }

    public handleMessage(message: IMessage): void {
        console.log("System controller got request: " + message);
    }
}
