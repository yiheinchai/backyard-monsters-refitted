import { SmartFox } from "../SmartFox";
import { BaseRequest } from "./BaseRequest";

/**
 * ManualDisconnectionRequest - Request for manual disconnection from server.
 */
export class ManualDisconnectionRequest extends BaseRequest {
    constructor() {
        super(BaseRequest.ManualDisconnection);
    }

    public override validate(sfs: SmartFox): void {
        // No validation needed
    }

    public override execute(sfs: SmartFox): void {
        // No execution logic
    }
}
