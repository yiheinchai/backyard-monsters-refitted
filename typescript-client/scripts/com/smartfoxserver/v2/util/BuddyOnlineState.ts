/**
 * BuddyOnlineState - Constants for buddy online states.
 */
export class BuddyOnlineState {
    public static readonly ONLINE: number = 0;
    public static readonly OFFLINE: number = 1;
    public static readonly LEFT_THE_SERVER: number = 2;

    private constructor() {
        throw new Error("This class should not be instantiated");
    }
}
