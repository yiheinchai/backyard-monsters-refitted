import { EventDispatcher } from "openfl/events/EventDispatcher";
import { BitSwarmClient } from "./bitswarm/BitSwarmClient";
import { BitSwarmEvent } from "./bitswarm/BitSwarmEvent";
import { DefaultUDPManager } from "./bitswarm/DefaultUDPManager";
import { IMessage } from "./bitswarm/IMessage";
import { IUDPManager } from "./bitswarm/IUDPManager";
import { SFSEvent } from "./core/SFSEvent";
import { SFSIOHandler } from "./core/SFSIOHandler";
import { Room } from "./entities/Room";
import { User } from "./entities/User";
import { ISFSObject } from "./entities/data/ISFSObject";
import { IBuddyManager } from "./entities/managers/IBuddyManager";
import { IRoomManager } from "./entities/managers/IRoomManager";
import { IUserManager } from "./entities/managers/IUserManager";
import { SFSBuddyManager } from "./entities/managers/SFSBuddyManager";
import { SFSGlobalUserManager } from "./entities/managers/SFSGlobalUserManager";
import { SFSRoomManager } from "./entities/managers/SFSRoomManager";
import { SFSCodecError } from "./exceptions/SFSCodecError";
import { SFSError } from "./exceptions/SFSError";
import { SFSValidationError } from "./exceptions/SFSValidationError";
import { Logger } from "./logging/Logger";
import { BaseRequest } from "./requests/BaseRequest";
import { HandshakeRequest } from "./requests/HandshakeRequest";
import { IRequest } from "./requests/IRequest";
import { JoinRoomRequest } from "./requests/JoinRoomRequest";
import { ManualDisconnectionRequest } from "./requests/ManualDisconnectionRequest";
import { ClientDisconnectionReason } from "./util/ClientDisconnectionReason";
import { ConfigData } from "./util/ConfigData";
import { ConfigLoader } from "./util/ConfigLoader";
import { ConnectionMode } from "./util/ConnectionMode";
import { LagMonitor } from "./util/LagMonitor";
import { SFSErrorCodes } from "./util/SFSErrorCodes";

/**
 * SmartFox - Main SFS2X client class.
 */
export class SmartFox extends EventDispatcher {
    private readonly DEFAULT_HTTP_PORT: number = 8080;

    private _majVersion: number = 0;
    private _minVersion: number = 9;
    private _subVersion: number = 15;

    private _bitSwarm: BitSwarmClient;
    private _lagMonitor: LagMonitor | null = null;
    private _useBlueBox: boolean = true;
    private _isConnected: boolean = false;
    private _isJoining: boolean = false;
    private _mySelf: User | null = null;
    private _sessionToken: string | null = null;
    private _lastJoinedRoom: Room | null = null;
    private _log: Logger;
    private _inited: boolean = false;
    private _debug: boolean = false;
    private _isConnecting: boolean = false;
    private _userManager!: IUserManager;
    private _roomManager!: IRoomManager;
    private _buddyManager!: IBuddyManager;
    private _config: ConfigData | null = null;
    private _currentZone: string | null = null;
    private _autoConnectOnConfig: boolean = false;
    private _lastIpAddress: string = "";

    constructor(debug: boolean = false) {
        super();
        this._log = Logger.getInstance();
        this._log.enableEventDispatching = true;
        this._debug = debug;
        this._bitSwarm = new BitSwarmClient(this);
        this.initialize();
    }

    private initialize(): void {
        if (this._inited) {
            return;
        }
        this._bitSwarm = new BitSwarmClient(this);
        this._bitSwarm.ioHandler = new SFSIOHandler(this._bitSwarm);
        this._bitSwarm.init();
        this._bitSwarm.addEventListener(BitSwarmEvent.CONNECT, this.onSocketConnect.bind(this));
        this._bitSwarm.addEventListener(BitSwarmEvent.DISCONNECT, this.onSocketClose.bind(this));
        this._bitSwarm.addEventListener(BitSwarmEvent.RECONNECTION_TRY, this.onSocketReconnectionTry.bind(this));
        this._bitSwarm.addEventListener(BitSwarmEvent.IO_ERROR, this.onSocketIOError.bind(this));
        this._bitSwarm.addEventListener(BitSwarmEvent.SECURITY_ERROR, this.onSocketSecurityError.bind(this));
        this._bitSwarm.addEventListener(BitSwarmEvent.DATA_ERROR, this.onSocketDataError.bind(this));
        this.addEventListener(SFSEvent.HANDSHAKE, this.handleHandShake.bind(this));
        this.addEventListener(SFSEvent.LOGIN, this.handleLogin.bind(this));
        this._inited = true;
        this.reset();
    }

    private reset(): void {
        this._userManager = new SFSGlobalUserManager(this);
        this._roomManager = new SFSRoomManager(this);
        this._buddyManager = new SFSBuddyManager(this);
        if (this._lagMonitor !== null) {
            this._lagMonitor.destroy();
        }
        this._lagMonitor = new LagMonitor(this);
        this._isConnected = false;
        this._isJoining = false;
        this._currentZone = null;
        this._lastJoinedRoom = null;
        this._sessionToken = null;
        this._mySelf = null;
    }

    public enableLagMonitor(enable: boolean): void {
        if (this._mySelf === null) {
            this.logger.warn("Lag Monitoring requires that you are logged in a Zone!");
            return;
        }
        if (enable) {
            this._lagMonitor!.start();
        } else {
            this._lagMonitor!.stop();
        }
    }

    // Kernel accessors (internal use)
    public get socketEngine(): BitSwarmClient {
        return this._bitSwarm;
    }

    public get lagMonitor(): LagMonitor | null {
        return this._lagMonitor;
    }

    public get isConnected(): boolean {
        let connected = false;
        if (this._bitSwarm !== null) {
            connected = this._bitSwarm.connected;
        }
        return connected;
    }

    public get connectionMode(): string {
        return this._bitSwarm.connectionMode;
    }

    public get version(): string {
        return "" + this._majVersion + "." + this._minVersion + "." + this._subVersion;
    }

    public get config(): ConfigData | null {
        return this._config;
    }

    public get compressionThreshold(): number {
        return this._bitSwarm.compressionThreshold;
    }

    public get maxMessageSize(): number {
        return this._bitSwarm.maxMessageSize;
    }

    public getRoomById(id: number): Room | null {
        return this.roomManager.getRoomById(id);
    }

    public getRoomByName(name: string): Room | null {
        return this.roomManager.getRoomByName(name);
    }

    public getRoomListFromGroup(groupId: string): Array<Room> {
        return this.roomManager.getRoomListFromGroup(groupId);
    }

    public killConnection(): void {
        this._bitSwarm.killConnection();
    }

    public connect(host: string | null = null, port: number = -1): void {
        if (this.isConnected) {
            this._log.warn("Already connected");
            return;
        }
        if (this._isConnecting) {
            this._log.warn("A connection attempt is already in progress");
            return;
        }
        if (this.config !== null) {
            if (host === null) {
                host = this.config.host;
            }
            if (port === -1) {
                port = this.config.port;
            }
        }
        if (host === null || host.length === 0) {
            throw new Error("Invalid connection host/address");
        }
        if (port < 0 || port > 65535) {
            throw new Error("Invalid connection port");
        }
        this._lastIpAddress = host;
        this._isConnecting = true;
        this._bitSwarm.connect(host, port);
    }

    public disconnect(): void {
        if (this.isConnected) {
            if (this._bitSwarm.reconnectionSeconds > 0) {
                this.send(new ManualDisconnectionRequest());
            }
            setTimeout(() => {
                this._bitSwarm.disconnect(ClientDisconnectionReason.MANUAL);
            }, 100);
        } else {
            this._log.info("You are not connected");
        }
    }

    public get debug(): boolean {
        return this._debug;
    }

    public set debug(value: boolean) {
        this._debug = value;
    }

    public get currentIp(): string {
        return this._bitSwarm.connectionIp;
    }

    public get currentPort(): number {
        return this._bitSwarm.connectionPort;
    }

    public get currentZone(): string | null {
        return this._currentZone;
    }

    public get mySelf(): User | null {
        return this._mySelf;
    }

    public set mySelf(value: User | null) {
        this._mySelf = value;
    }

    public get useBlueBox(): boolean {
        return this._useBlueBox;
    }

    public set useBlueBox(value: boolean) {
        this._useBlueBox = value;
    }

    public get logger(): Logger {
        return this._log;
    }

    public get lastJoinedRoom(): Room | null {
        return this._lastJoinedRoom;
    }

    public set lastJoinedRoom(value: Room | null) {
        this._lastJoinedRoom = value;
    }

    public get joinedRooms(): Array<Room> {
        return this.roomManager.getJoinedRooms();
    }

    public get roomList(): Array<Room> {
        return this._roomManager.getRoomList();
    }

    public get roomManager(): IRoomManager {
        return this._roomManager;
    }

    public get userManager(): IUserManager {
        return this._userManager;
    }

    public get buddyManager(): IBuddyManager {
        return this._buddyManager;
    }

    public get udpAvailable(): boolean {
        return this.isAirRuntime();
    }

    public get udpInited(): boolean {
        return this._bitSwarm.udpManager.inited;
    }

    public initUDP(manager: IUDPManager, host: string | null = null, port: number = -1): void {
        if (this.isAirRuntime()) {
            if (!this.isConnected) {
                this._log.warn("Cannot initialize UDP protocol until the client is connected to SFS2X.");
                return;
            }
            if (this.config !== null) {
                if (host === null) {
                    host = this.config.udpHost;
                }
                if (port === -1) {
                    port = this.config.udpPort;
                }
            }
            if (host === null || host.length === 0) {
                throw new Error("Invalid UDP host/address");
            }
            if (port < 0 || port > 65535) {
                throw new Error("Invalid UDP port range");
            }
            if (!this._bitSwarm.udpManager.inited && this._bitSwarm.udpManager instanceof DefaultUDPManager) {
                manager.sfs = this;
                this._bitSwarm.udpManager = manager;
            }
            this._bitSwarm.udpManager.initialize(host, port);
        } else {
            this._log.warn("UDP Failure: the protocol is available only for the AIR 2.0 runtime.");
        }
    }

    private isAirRuntime(): boolean {
        // In TypeScript/web context, we don't have AIR runtime
        return false;
    }

    public get isJoining(): boolean {
        return this._isJoining;
    }

    public set isJoining(value: boolean) {
        this._isJoining = value;
    }

    public get sessionToken(): string | null {
        return this._sessionToken;
    }

    public getReconnectionSeconds(): number {
        return this._bitSwarm.reconnectionSeconds;
    }

    public setReconnectionSeconds(value: number): void {
        this._bitSwarm.reconnectionSeconds = value;
    }

    public send(request: IRequest): void {
        if (!this.isConnected) {
            this._log.warn("You are not connected. Request cannot be sent: " + request);
            return;
        }
        try {
            if (request instanceof JoinRoomRequest) {
                if (this._isJoining) {
                    return;
                }
                this._isJoining = true;
            }
            request.validate(this);
            request.execute(this);
            this._bitSwarm.send(request.getMessage());
        } catch (problem: any) {
            if (problem instanceof SFSValidationError) {
                let errMsg = problem.message;
                for (const errorItem of problem.errors) {
                    errMsg += "\t" + errorItem + "\n";
                }
                this._log.warn(errMsg);
            } else if (problem instanceof SFSCodecError) {
                this._log.warn(problem.message);
            } else {
                throw problem;
            }
        }
    }

    public loadConfig(path: string = "sfs-config.xml", autoConnect: boolean = true): void {
        const loader = new ConfigLoader();
        loader.addEventListener(SFSEvent.CONFIG_LOAD_SUCCESS, this.onConfigLoadSuccess.bind(this));
        loader.addEventListener(SFSEvent.CONFIG_LOAD_FAILURE, this.onConfigLoadFailure.bind(this));
        this._autoConnectOnConfig = autoConnect;
        loader.loadConfig(path);
    }

    public addJoinedRoom(room: Room): void {
        if (!this.roomManager.containsRoom(room.id)) {
            this.roomManager.addRoom(room);
            this._lastJoinedRoom = room;
            return;
        }
        throw new SFSError("Unexpected: joined room already exists for this User: " + this.mySelf!.name + ", Room: " + room);
    }

    public removeJoinedRoom(room: Room): void {
        this.roomManager.removeRoom(room);
        if (this.joinedRooms.length > 0) {
            this._lastJoinedRoom = this.joinedRooms[this.joinedRooms.length - 1];
        }
    }

    private onSocketConnect(event: BitSwarmEvent): void {
        if (event.params.success) {
            this.sendHandshakeRequest(event.params._isReconnection);
        } else {
            this._log.warn("Connection attempt failed");
            this.handleConnectionProblem(event);
        }
    }

    private onSocketClose(event: BitSwarmEvent): void {
        this.reset();
        this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION_LOST, { reason: event.params.reason }));
    }

    private onSocketReconnectionTry(event: BitSwarmEvent): void {
        this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION_RETRY, {}));
    }

    private onSocketDataError(event: BitSwarmEvent): void {
        this.dispatchEvent(new SFSEvent(SFSEvent.SOCKET_ERROR, { errorMessage: event.params.message }));
    }

    private onSocketIOError(event: BitSwarmEvent): void {
        if (this._isConnecting) {
            this.handleConnectionProblem(event);
        }
    }

    private onSocketSecurityError(event: BitSwarmEvent): void {
        if (this._isConnecting) {
            this.handleConnectionProblem(event);
        }
    }

    private onConfigLoadSuccess(event: SFSEvent): void {
        const loader = event.target as ConfigLoader;
        const cfg = event.params.cfg as ConfigData;
        loader.removeEventListener(SFSEvent.CONFIG_LOAD_SUCCESS, this.onConfigLoadSuccess.bind(this));
        loader.removeEventListener(SFSEvent.CONFIG_LOAD_FAILURE, this.onConfigLoadFailure.bind(this));
        if (cfg.host === null || cfg.host.length === 0) {
            throw new Error("Invalid Host/IpAddress in external config file");
        }
        if (cfg.port < 0 || cfg.port > 65535) {
            throw new Error("Invalid TCP port in external config file");
        }
        if (cfg.zone === null || cfg.zone.length === 0) {
            throw new Error("Invalid Zone name in external config file");
        }
        this._debug = cfg.debug;
        this._useBlueBox = cfg.useBlueBox;
        this._config = cfg;
        const sfsEvent = new SFSEvent(SFSEvent.CONFIG_LOAD_SUCCESS, { config: cfg });
        this.dispatchEvent(sfsEvent);
        if (this._autoConnectOnConfig) {
            this.connect(this._config.host, this._config.port);
        }
    }

    private onConfigLoadFailure(event: SFSEvent): void {
        const loader = event.target as ConfigLoader;
        loader.removeEventListener(SFSEvent.CONFIG_LOAD_SUCCESS, this.onConfigLoadSuccess.bind(this));
        loader.removeEventListener(SFSEvent.CONFIG_LOAD_FAILURE, this.onConfigLoadFailure.bind(this));
        const sfsEvent = new SFSEvent(SFSEvent.CONFIG_LOAD_FAILURE, {});
        this.dispatchEvent(sfsEvent);
    }

    private handleHandShake(event: SFSEvent): void {
        const message = event.params.message as IMessage;
        const content = message.content;
        if (content.isNull(BaseRequest.KEY_ERROR_CODE)) {
            this._sessionToken = content.getUtfString(HandshakeRequest.KEY_SESSION_TOKEN);
            this._bitSwarm.compressionThreshold = content.getInt(HandshakeRequest.KEY_COMPRESSION_THRESHOLD);
            this._bitSwarm.maxMessageSize = content.getInt(HandshakeRequest.KEY_MAX_MESSAGE_SIZE);
            if (this._bitSwarm.isReconnecting) {
                this._bitSwarm.isReconnecting = false;
                this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION_RESUME, {}));
            } else {
                this._isConnecting = false;
                this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION, { success: true }));
            }
        } else {
            const errorCode = content.getShort(BaseRequest.KEY_ERROR_CODE);
            const errorMsg = SFSErrorCodes.getErrorMessage(errorCode, content.getUtfStringArray(BaseRequest.KEY_ERROR_PARAMS));
            const params = {
                success: false,
                errorMessage: errorMsg,
                errorCode: errorCode
            };
            this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION, params));
        }
    }

    private handleLogin(event: SFSEvent): void {
        this._currentZone = event.params.zone;
    }

    public handleClientDisconnection(reason: string): void {
        this._bitSwarm.reconnectionSeconds = 0;
        this._bitSwarm.disconnect(reason);
        this.reset();
    }

    public handleLogout(): void {
        this._userManager = new SFSGlobalUserManager(this);
        this._roomManager = new SFSRoomManager(this);
        this._isJoining = false;
        this._lastJoinedRoom = null;
        this._currentZone = null;
        this._mySelf = null;
    }

    private handleConnectionProblem(event: BitSwarmEvent): void {
        if (this._bitSwarm.connectionMode === ConnectionMode.SOCKET && this._useBlueBox) {
            this._bitSwarm.forceBlueBox(true);
            const httpPort = this.config !== null ? this.config.httpPort : this.DEFAULT_HTTP_PORT;
            this._bitSwarm.connect(this._lastIpAddress, httpPort);
            this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION_ATTEMPT_HTTP, {}));
        } else {
            const params = {
                success: false,
                errorMessage: event.params.message
            };
            this.dispatchEvent(new SFSEvent(SFSEvent.CONNECTION, params));
            this._isConnecting = this._isConnected = false;
        }
    }

    private sendHandshakeRequest(isReconnection: boolean = false): void {
        const request = new HandshakeRequest(this.version, isReconnection ? this._sessionToken : null);
        this.send(request);
    }
}
