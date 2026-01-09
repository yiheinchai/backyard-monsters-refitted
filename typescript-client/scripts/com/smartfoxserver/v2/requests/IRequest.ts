import { SmartFox } from "../SmartFox";
import { IMessage } from "../bitswarm/IMessage";

/**
 * IRequest - Interface for SmartFoxServer requests.
 */
export interface IRequest {
    targetController: number;
    isEncrypted: boolean;
    validate(sfs: SmartFox): void;
    execute(sfs: SmartFox): void;
    getMessage(): IMessage;
}
