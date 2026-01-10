import Event from "openfl/events/Event";
import EventDispatcher from "openfl/events/EventDispatcher";
import IOErrorEvent from "openfl/events/IOErrorEvent";
import ProgressEvent from "openfl/events/ProgressEvent";
import SecurityErrorEvent from "openfl/events/SecurityErrorEvent";
import Socket from "openfl/net/Socket";
import ByteArray from "openfl/utils/ByteArray";
import { SmartFox } from "../SmartFox";
import { ExtensionController } from "../controllers/ExtensionController";
import { SystemController } from "../controllers/SystemController";
import { SFSError } from "../exceptions/SFSError";
import { Logger } from "../logging/Logger";
import { ClientDisconnectionReason } from "../util/ClientDisconnectionReason";
import { ConnectionMode } from "../util/ConnectionMode";
import { BitSwarmEvent } from "./BitSwarmEvent";
import { IController } from "./IController";
import { IMessage } from "./IMessage";
import { IoHandler } from "./IoHandler";
import { IUDPManager } from "./IUDPManager";
import { DefaultUDPManager } from "./DefaultUDPManager";
import { BBClient } from "./bbox/BBClient";
import { BBEvent } from "./bbox/BBEvent";

/**
 * BitSwarmClient - Core networking client for SmartFoxServer connections.
 */
export class BitSwarmClient extends EventDispatcher {
    private _socket: Socket;
    private _bbClient: BBClient;
    private _ioHandler: IoHandler | null = null;
    private _controllers: { [key: number]: IController };
    private _compressionThreshold: number = 2000000;
    private _maxMessageSize: number = 10000;
    private _sfs: SmartFox;
    private _connected: boolean = false;
    private _lastIpAddress: string = "";
    private _lastTcpPort: number = 0;
    private _reconnectionDelayMillis: number = 1000;
    private _reconnectionSeconds: number = 0;
    private _attemptingReconnection: boolean = false;
    private _log: Logger;
    private _sysController: SystemController | null = null;
    private _extController: ExtensionController | null = null;
    private _udpManager: IUDPManager;
    private _controllersInited: boolean = false;
    private _useBlueBox: boolean = false;
    private _connectionMode: string = "";

    constructor(sfs: SmartFox | null = null) {
        super();
        this._controllers = {};
        this._sfs = sfs!;
        this._connected = false;
        this._log = Logger.getInstance();
        this._udpManager = new DefaultUDPManager(sfs!);
        this._socket = new Socket();
        this._bbClient = new BBClient();
    }

    public get sfs(): SmartFox {
        return this._sfs;
    }

    public get connected(): boolean {
        return this._connected;
    }

    public get connectionMode(): string {
        return this._connectionMode;
    }

    public get ioHandler(): IoHandler | null {
        return this._ioHandler;
    }

    public set ioHandler(value: IoHandler) {
        if (this._ioHandler !== null) {
            throw new SFSError("IOHandler is already set!");
        }
        this._ioHandler = value;
    }

    public get maxMessageSize(): number {
        return this._maxMessageSize;
    }

    public set maxMessageSize(value: number) {
        this._maxMessageSize = value;
    }

    public get compressionThreshold(): number {
        return this._compressionThreshold;
    }

    public set compressionThreshold(value: number) {
        if (value > 100) {
            this._compressionThreshold = value;
            return;
        }
        throw new Error("Compression threshold cannot be < 100 bytes.");
    }

    public get reconnectionDelayMillis(): number {
        return this._reconnectionDelayMillis;
    }

    public get useBlueBox(): boolean {
        return this._useBlueBox;
    }

    public forceBlueBox(value: boolean): void {
        if (!this.connected) {
            this._useBlueBox = value;
            return;
        }
        throw new Error("You can't change the BlueBox mode while the connection is running");
    }

    public set reconnectionDelayMillis(value: number) {
        this._reconnectionDelayMillis = value;
    }

    public enableBBoxDebug(value: boolean): void {
        this._bbClient.isDebug = value;
    }

    public init(): void {
        if (!this._controllersInited) {
            this.initControllers();
            this._controllersInited = true;
        }
        this._socket = new Socket();
        this._socket.addEventListener(Event.CONNECT, this.onSocketConnect.bind(this));
        this._socket.addEventListener(Event.CLOSE, this.onSocketClose.bind(this));
        this._socket.addEventListener(ProgressEvent.SOCKET_DATA, this.onSocketData.bind(this));
        this._socket.addEventListener(IOErrorEvent.IO_ERROR, this.onSocketIOError.bind(this));
        this._socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, this.onSocketSecurityError.bind(this));
        
        this._bbClient = new BBClient();
        this._bbClient.addEventListener(BBEvent.CONNECT, this.onBBConnect.bind(this));
        this._bbClient.addEventListener(BBEvent.DATA, this.onBBData.bind(this));
        this._bbClient.addEventListener(BBEvent.DISCONNECT, this.onBBDisconnect.bind(this));
        this._bbClient.addEventListener(BBEvent.IO_ERROR, this.onBBError.bind(this));
        this._bbClient.addEventListener(BBEvent.SECURITY_ERROR, this.onBBError.bind(this));
    }

    public destroy(): void {
        this._socket.removeEventListener(Event.CONNECT, this.onSocketConnect.bind(this));
        this._socket.removeEventListener(Event.CLOSE, this.onSocketClose.bind(this));
        this._socket.removeEventListener(ProgressEvent.SOCKET_DATA, this.onSocketData.bind(this));
        this._socket.removeEventListener(IOErrorEvent.IO_ERROR, this.onSocketIOError.bind(this));
        this._socket.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, this.onSocketSecurityError.bind(this));
        if (this._socket.connected) {
            this._socket.close();
        }
    }

    public getController(id: number): IController | null {
        return this._controllers[id] || null;
    }

    public get systemController(): SystemController | null {
        return this._sysController;
    }

    public get extensionController(): ExtensionController | null {
        return this._extController;
    }

    public get isReconnecting(): boolean {
        return this._attemptingReconnection;
    }

    public set isReconnecting(value: boolean) {
        this._attemptingReconnection = value;
    }

    public getControllerById(id: number): IController | null {
        return this._controllers[id] || null;
    }

    public get connectionIp(): string {
        if (!this.connected) {
            return "Not Connected";
        }
        return this._lastIpAddress;
    }

    public get connectionPort(): number {
        if (!this.connected) {
            return -1;
        }
        return this._lastTcpPort;
    }

    private addController(id: number, controller: IController): void {
        if (controller === null) {
            throw new Error("Controller is null, it can't be added.");
        }
        if (this._controllers[id] !== undefined) {
            throw new Error("A controller with id: " + id + " already exists! Controller can't be added: " + controller);
        }
        this._controllers[id] = controller;
    }

    public addCustomController(id: number, controllerClass: any): void {
        const controller = new controllerClass(this);
        this.addController(id, controller);
    }

    public connect(host: string = "127.0.0.1", port: number = 9933): void {
        this._lastIpAddress = host;
        this._lastTcpPort = port;
        if (this._useBlueBox) {
            this._bbClient.connect(host, port);
            this._connectionMode = ConnectionMode.HTTP;
        } else {
            this._socket.connect(host, port);
            this._connectionMode = ConnectionMode.SOCKET;
        }
    }

    public send(message: IMessage): void {
        this._ioHandler!.codec.onPacketWrite(message);
    }

    public get socket(): Socket {
        return this._socket;
    }

    public get httpSocket(): BBClient {
        return this._bbClient;
    }

    public disconnect(reason: string | null = null): void {
        if (this._useBlueBox) {
            this._bbClient.close();
        } else {
            this._socket.close();
        }
        this.onSocketClose(new BitSwarmEvent(BitSwarmEvent.DISCONNECT, { reason: reason }));
    }

    public nextUdpPacketId(): number {
        return this._udpManager.nextUdpPacketId();
    }

    public killConnection(): void {
        this._socket.close();
        this.onSocketClose(new Event(Event.CLOSE));
    }

    public get udpManager(): IUDPManager {
        return this._udpManager;
    }

    public set udpManager(value: IUDPManager) {
        this._udpManager = value;
    }

    private initControllers(): void {
        this._sysController = new SystemController(this);
        this._extController = new ExtensionController(this);
        this.addController(0, this._sysController);
        this.addController(1, this._extController);
    }

    public get reconnectionSeconds(): number {
        return this._reconnectionSeconds;
    }

    public set reconnectionSeconds(value: number) {
        if (value < 0) {
            this._reconnectionSeconds = 0;
        } else {
            this._reconnectionSeconds = value;
        }
    }

    private onSocketConnect(event: Event): void {
        this._connected = true;
        const bsEvent = new BitSwarmEvent(BitSwarmEvent.CONNECT);
        bsEvent.params = {
            success: true,
            _isReconnection: this._attemptingReconnection
        };
        this.dispatchEvent(bsEvent);
    }

    private onSocketClose(event: Event): void {
        this._connected = false;
        const isRegularDisconnection = !this._attemptingReconnection && this.sfs.getReconnectionSeconds() === 0;
        const isManualDisconnection = event instanceof BitSwarmEvent && 
            (event as BitSwarmEvent).params.reason === ClientDisconnectionReason.MANUAL;
        
        if (this._attemptingReconnection || isRegularDisconnection || isManualDisconnection) {
            this._udpManager.reset();
            if (event instanceof BitSwarmEvent) {
                this.dispatchEvent(event);
            } else {
                this.dispatchEvent(new BitSwarmEvent(BitSwarmEvent.DISCONNECT, { reason: ClientDisconnectionReason.UNKNOWN }));
            }
            return;
        }
        
        this._attemptingReconnection = true;
        this.dispatchEvent(new BitSwarmEvent(BitSwarmEvent.RECONNECTION_TRY));
        setTimeout(() => {
            this.connect(this._lastIpAddress, this._lastTcpPort);
        }, this._reconnectionDelayMillis);
    }

    private onSocketData(event: ProgressEvent): void {
        try {
            const buffer = new ByteArray();
            this._socket.readBytes(buffer);
            this._ioHandler!.onDataRead(buffer);
        } catch (error: any) {
            console.log("## SocketDataError: " + event.toString());
            const bsEvent = new BitSwarmEvent(BitSwarmEvent.DATA_ERROR);
            bsEvent.params = { message: event.toString() };
            this.dispatchEvent(bsEvent);
        }
    }

    private onSocketIOError(event: IOErrorEvent): void {
        if (this._attemptingReconnection) {
            this.dispatchEvent(new BitSwarmEvent(BitSwarmEvent.DISCONNECT, { reason: ClientDisconnectionReason.UNKNOWN }));
            return;
        }
        console.log("## SocketError: " + event.toString());
        const bsEvent = new BitSwarmEvent(BitSwarmEvent.IO_ERROR);
        bsEvent.params = { message: event.toString() };
        this.dispatchEvent(bsEvent);
    }

    private onSocketSecurityError(event: SecurityErrorEvent): void {
        console.log("## SecurityError: " + event.toString());
        const bsEvent = new BitSwarmEvent(BitSwarmEvent.SECURITY_ERROR);
        bsEvent.params = { message: event.text };
        this.dispatchEvent(bsEvent);
    }

    private onBBConnect(event: BBEvent): void {
        this._connected = true;
        const bsEvent = new BitSwarmEvent(BitSwarmEvent.CONNECT);
        bsEvent.params = { success: true };
        this.dispatchEvent(bsEvent);
    }

    private onBBData(event: BBEvent): void {
        const data = event.params.data;
        if (data !== null) {
            this._ioHandler!.onDataRead(data);
        }
    }

    private onBBDisconnect(event: BBEvent): void {
        this._connected = false;
        this.dispatchEvent(new BitSwarmEvent(BitSwarmEvent.DISCONNECT, { reason: ClientDisconnectionReason.UNKNOWN }));
    }

    private onBBError(event: BBEvent): void {
        console.log("## BlueBox Error: " + event.params.message);
        const bsEvent = new BitSwarmEvent(BitSwarmEvent.IO_ERROR);
        bsEvent.params = { message: event.params.message };
        this.dispatchEvent(bsEvent);
    }
}
