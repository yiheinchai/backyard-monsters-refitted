import { SmartFox } from "../SmartFox";
import { BaseController } from "../bitswarm/BaseController";
import { BitSwarmClient } from "../bitswarm/BitSwarmClient";
import { IMessage } from "../bitswarm/IMessage";
import { SFSEvent } from "../core/SFSEvent";
import { ISFSObject } from "../entities/data/ISFSObject";

/**
 * ExtensionController - Controller for handling extension messages.
 */
export class ExtensionController extends BaseController {
    public static readonly KEY_CMD: string = "c";
    public static readonly KEY_PARAMS: string = "p";

    private sfs: SmartFox;
    private bitSwarm: BitSwarmClient;

    constructor(bitSwarm: BitSwarmClient) {
        super();
        this.bitSwarm = bitSwarm;
        this.sfs = bitSwarm.sfs;
    }

    public override handleMessage(message: IMessage): void {
        if (this.sfs.debug) {
            this.log.info(message);
        }
        const content: ISFSObject = message.content;
        const params: any = {};
        params.cmd = content.getUtfString(ExtensionController.KEY_CMD);
        params.params = content.getSFSObject(ExtensionController.KEY_PARAMS);
        if (message.isUDP) {
            params.packetId = message.packetId;
        }
        this.sfs.dispatchEvent(new SFSEvent(SFSEvent.EXTENSION_RESPONSE, params));
    }
}
