import Event from "openfl/events/Event";
import EventDispatcher from "openfl/events/EventDispatcher";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import URLLoader from "openfl/net/URLLoader";
import URLLoaderDataFormat from "openfl/net/URLLoaderDataFormat";
import URLRequest from "openfl/net/URLRequest";
import URLRequestMethod from "openfl/net/URLRequestMethod";
import URLVariables from "openfl/net/URLVariables";
import ByteArray from "openfl/utils/ByteArray";
import { Base64 } from "../../../../hurlant/util/Base64";
import { BBEvent } from "./BBEvent";

/**
 * BBClient - BlueBox HTTP polling client for SFS connection fallback.
 */
export class BBClient extends EventDispatcher {
    private readonly BB_DEFAULT_HOST: string = "localhost";
    private readonly BB_DEFAULT_PORT: number = 8080;
    private readonly BB_SERVLET: string = "BlueBox/BlueBox.do";
    private readonly BB_NULL: string = "null";
    private readonly CMD_CONNECT: string = "connect";
    private readonly CMD_POLL: string = "poll";
    private readonly CMD_DATA: string = "data";
    private readonly CMD_DISCONNECT: string = "disconnect";
    private readonly ERR_INVALID_SESSION: string = "err01";
    private readonly SFS_HTTP: string = "sfsHttp";
    private readonly SEP: string = "|";
    private readonly MIN_POLL_SPEED: number = 20;
    private readonly MAX_POLL_SPEED: number = 10000;
    private readonly DEFAULT_POLL_SPEED: number = 100;

    private _isConnected: boolean = false;
    private _host: string = "localhost";
    private _port: number = 8080;
    private _bbUrl: string = "";
    private _debug: boolean = false;
    private _sessId: string | null = null;
    private _loader: URLLoader | null = null;
    private _urlRequest: URLRequest | null = null;
    private _pollSpeed: number = 100;

    constructor(host: string = "localhost", port: number = 8080, debug: boolean = false) {
        super();
        this._host = host;
        this._port = port;
        this._debug = debug;
    }

    public get isConnected(): boolean {
        return this._sessId !== null;
    }

    public get isDebug(): boolean {
        return this._debug;
    }

    public get host(): string {
        return this._host;
    }

    public get port(): number {
        return this._port;
    }

    public get sessionId(): string | null {
        return this._sessId;
    }

    public get pollSpeed(): number {
        return this._pollSpeed;
    }

    public set pollSpeed(value: number) {
        this._pollSpeed = value;
    }

    public set isDebug(value: boolean) {
        this._debug = value;
    }

    public connect(host: string = "127.0.0.1", port: number = 8080): void {
        if (this.isConnected) {
            throw new Error("BlueBox session is already connected");
        }
        this._host = host;
        this._port = port;
        this._bbUrl = "http://" + this._host + ":" + port + "/" + this.BB_SERVLET;
        this.sendRequest(this.CMD_CONNECT);
    }

    public send(data: ByteArray): void {
        if (!this.isConnected) {
            throw new Error("Can't send data, BlueBox connection is not active");
        }
        this.sendRequest(this.CMD_DATA, data);
    }

    public disconnect(): void {
        this.sendRequest(this.CMD_DISCONNECT);
    }

    public close(): void {
        this.handleConnectionLost(false);
    }

    private onHttpResponse(event: Event): void {
        const loader = event.target as URLLoader;
        const responseData = loader.data as string;
        
        if (this._debug) {
            console.log("[ BB-Receive ]: " + responseData);
        }
        
        const parts = responseData.split(this.SEP);
        const command = parts[0];
        const payload = parts[1];
        
        if (command === this.CMD_CONNECT) {
            this._sessId = payload;
            this._isConnected = true;
            this.dispatchEvent(new BBEvent(BBEvent.CONNECT, {}));
            this.poll();
        } else if (command === this.CMD_POLL) {
            let decodedData: ByteArray | null = null;
            if (payload !== this.BB_NULL) {
                decodedData = this.decodeResponse(payload);
            }
            if (this._isConnected) {
                setTimeout(() => this.poll(), this._pollSpeed);
            }
            this.dispatchEvent(new BBEvent(BBEvent.DATA, { data: decodedData }));
        } else if (command === this.ERR_INVALID_SESSION) {
            this.handleConnectionLost();
        }
    }

    private onHttpIOError(event: IOErrorEvent): void {
        const bbEvent = new BBEvent(BBEvent.IO_ERROR, { message: event.text });
        this.dispatchEvent(bbEvent);
    }

    private poll(): void {
        this.sendRequest(this.CMD_POLL);
    }

    private sendRequest(command: string, data: any = null): void {
        this._urlRequest = new URLRequest(this._bbUrl);
        this._urlRequest.method = URLRequestMethod.POST;
        
        const urlVars = new URLVariables();
        urlVars[this.SFS_HTTP] = this.encodeRequest(command, data);
        this._urlRequest.data = urlVars;
        
        if (this._debug) {
            console.log("[ BB-Send ]: " + urlVars[this.SFS_HTTP]);
        }
        
        const loader = this.getLoader();
        loader.data = urlVars;
        loader.load(this._urlRequest);
    }

    private getLoader(): URLLoader {
        const loader = new URLLoader();
        loader.dataFormat = URLLoaderDataFormat.TEXT;
        loader.addEventListener(Event.COMPLETE, this.onHttpResponse.bind(this));
        loader.addEventListener(IOErrorEvent.IO_ERROR, this.onHttpIOError.bind(this));
        loader.addEventListener(IOErrorEvent.NETWORK_ERROR, this.onHttpIOError.bind(this));
        return loader;
    }

    private handleConnectionLost(dispatchDisconnect: boolean = true): void {
        if (this._isConnected) {
            this._isConnected = false;
            this._sessId = null;
            if (dispatchDisconnect) {
                this.dispatchEvent(new BBEvent(BBEvent.DISCONNECT, {}));
            }
        }
    }

    private encodeRequest(command: string, data: any = null): string {
        let result = "";
        const cmdStr = command === null ? this.BB_NULL : command;
        
        let dataStr: string;
        if (data === null) {
            dataStr = this.BB_NULL;
        } else if (data instanceof ByteArray) {
            dataStr = Base64.encodeByteArray(data);
        } else {
            dataStr = String(data);
        }
        
        const sessIdStr = this._sessId === null ? this.BB_NULL : this._sessId;
        return result + sessIdStr + this.SEP + cmdStr + this.SEP + dataStr;
    }

    private decodeResponse(data: string): ByteArray {
        return Base64.decodeToByteArray(data);
    }
}
