/**
 * ConnectionMode - Constants for SmartFoxServer connection modes.
 */
export class ConnectionMode {
    public static readonly SOCKET: string = "socket";
    public static readonly HTTP: string = "http";

    private constructor() {
        throw new Error("The ConnectionMode class has no constructor!");
    }
}
