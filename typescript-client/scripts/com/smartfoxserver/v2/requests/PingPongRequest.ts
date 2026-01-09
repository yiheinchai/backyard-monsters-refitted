import { SmartFox } from "../SmartFox";
import { BaseRequest } from "./BaseRequest";

/**
 * PingPongRequest - Request for ping/pong keepalive.
 */
export class PingPongRequest extends BaseRequest {
    constructor() {
        super(BaseRequest.PingPong);
    }

    public override execute(sfs: SmartFox): void {
        // No execution logic
    }

    public override validate(sfs: SmartFox): void {
        // No validation needed
    }
}
