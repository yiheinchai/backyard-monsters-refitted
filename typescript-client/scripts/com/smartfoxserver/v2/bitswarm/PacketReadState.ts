/**
 * PacketReadState - Constants for packet reading states.
 */
export class PacketReadState {
    public static readonly WAIT_NEW_PACKET: number = 0;
    public static readonly WAIT_DATA_SIZE: number = 1;
    public static readonly WAIT_DATA_SIZE_FRAGMENT: number = 2;
    public static readonly WAIT_DATA: number = 3;

    constructor() { }
}
