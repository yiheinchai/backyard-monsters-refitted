import { IMessage } from "./IMessage";

/**
 * IController - Interface for SmartFoxServer message controllers.
 */
export interface IController {
    id: number;
    handleMessage(message: IMessage): void;
}
