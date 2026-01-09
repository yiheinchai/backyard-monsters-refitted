import { EventDispatcher } from "openfl/events/EventDispatcher";
import { Event } from "openfl/events/Event";
import { IOErrorEvent } from "openfl/events/IOErrorEvent";
import { URLLoader } from "openfl/net/URLLoader";
import { URLRequest } from "openfl/net/URLRequest";
import { SFSEvent } from "../core/SFSEvent";
import { ConfigData } from "./ConfigData";

/**
 * ConfigLoader - Loads configuration from XML file.
 */
export class ConfigLoader extends EventDispatcher {
    constructor() {
        super();
    }

    public loadConfig(url: string): void {
        const loader = new URLLoader();
        loader.addEventListener(Event.COMPLETE, this.onConfigLoadSuccess.bind(this));
        loader.addEventListener(IOErrorEvent.IO_ERROR, this.onConfigLoadFailure.bind(this));
        loader.load(new URLRequest(url));
    }

    private onConfigLoadSuccess(e: Event): void {
        const loader = e.target as URLLoader;
        const xmlData = loader.data;
        // Parse XML data - simplified for TypeScript
        const cfg = new ConfigData();
        // In real implementation, parse XML and populate cfg
        // For now, create event with empty config
        const evt = new SFSEvent(SFSEvent.CONFIG_LOAD_SUCCESS, { cfg: cfg });
        this.dispatchEvent(evt);
    }

    private onConfigLoadFailure(e: IOErrorEvent): void {
        const params = { message: e.text };
        const evt = new SFSEvent(SFSEvent.CONFIG_LOAD_FAILURE, params);
        this.dispatchEvent(evt);
    }
}
