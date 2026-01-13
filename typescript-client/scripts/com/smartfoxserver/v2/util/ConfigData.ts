/**
 * ConfigData - Configuration data for SmartFoxServer connection.
 */
export class ConfigData {
    public host: string = "127.0.0.1";
    public port: number = 9933;
    public udpHost: string = "127.0.0.1";
    public udpPort: number = 9933;
    public zone: string | null = null;
    public debug: boolean = false;
    public httpPort: number = 8080;
    public useBlueBox: boolean = true;
    public blueBoxPollingRate: number = 750;

    constructor() { }
}
