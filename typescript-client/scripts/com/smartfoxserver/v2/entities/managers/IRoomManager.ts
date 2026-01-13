import { SmartFox } from "../../SmartFox";
import { Room } from "../Room";
import { User } from "../User";

/**
 * IRoomManager - Interface for room management.
 */
export interface IRoomManager {
    readonly ownerZone: string;
    readonly smartFox: SmartFox;
    addRoom(room: Room, addToGroup?: boolean): void;
    addGroup(groupId: string): void;
    replaceRoom(room: Room, addToGroup?: boolean): Room;
    removeGroup(groupId: string): void;
    containsGroup(groupId: string): boolean;
    containsRoom(idOrName: any): boolean;
    containsRoomInGroup(idOrName: any, groupId: string): boolean;
    changeRoomName(room: Room, newName: string): void;
    changeRoomPasswordState(room: Room, isPasswordProtected: boolean): void;
    changeRoomCapacity(room: Room, maxUsers: number, maxSpectators: number): void;
    getRoomById(id: number): Room | null;
    getRoomByName(name: string): Room | null;
    getRoomList(): Array<Room>;
    getRoomCount(): number;
    getRoomGroups(): Array<string>;
    getRoomListFromGroup(groupId: string): Array<Room>;
    getJoinedRooms(): Array<Room>;
    getUserRooms(user: User): Array<Room>;
    removeRoom(room: Room): void;
    removeRoomById(id: number): void;
    removeRoomByName(name: string): void;
    removeUser(user: User): void;
}
