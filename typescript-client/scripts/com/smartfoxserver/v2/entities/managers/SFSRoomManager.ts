import { SmartFox } from "../../SmartFox";
import { Room } from "../Room";
import { User } from "../User";
import { ArrayUtil } from "../../util/ArrayUtil";
import { IRoomManager } from "./IRoomManager";

/**
 * SFSRoomManager - Implementation of the IRoomManager interface.
 * Uses native Map instead of HashMap from de.polygonal.ds
 */
export class SFSRoomManager implements IRoomManager {
    private _ownerZone: string = "";
    private _groups: Array<string>;
    private _roomsById: Map<number, Room>;
    private _roomsByName: Map<string, Room>;
    protected _smartFox: SmartFox;

    constructor(sfs: SmartFox) {
        this._smartFox = sfs;
        this._groups = [];
        this._roomsById = new Map<number, Room>();
        this._roomsByName = new Map<string, Room>();
    }

    public get ownerZone(): string {
        return this._ownerZone;
    }

    public set ownerZone(value: string) {
        this._ownerZone = value;
    }

    public get smartFox(): SmartFox {
        return this._smartFox;
    }

    public addRoom(room: Room, addToGroup: boolean = true): void {
        this._roomsById.set(room.id, room);
        this._roomsByName.set(room.name, room);
        if (addToGroup) {
            if (!this.containsGroup(room.groupId)) {
                this.addGroup(room.groupId);
            }
        } else {
            room.isManaged = false;
        }
    }

    public replaceRoom(room: Room, addToGroup: boolean = true): Room {
        const existingRoom = this.getRoomById(room.id);
        if (existingRoom !== null) {
            existingRoom.merge(room);
            return existingRoom;
        }
        this.addRoom(room, addToGroup);
        return room;
    }

    public changeRoomName(room: Room, newName: string): void {
        const oldName = room.name;
        room.name = newName;
        this._roomsByName.set(newName, room);
        this._roomsByName.delete(oldName);
    }

    public changeRoomPasswordState(room: Room, isProtected: boolean): void {
        room.setPasswordProtected(isProtected);
    }

    public changeRoomCapacity(room: Room, maxUsers: number, maxSpectators: number): void {
        room.maxUsers = maxUsers;
        room.maxSpectators = maxSpectators;
    }

    public getRoomGroups(): Array<string> {
        return this._groups;
    }

    public addGroup(groupId: string): void {
        this._groups.push(groupId);
    }

    public removeGroup(groupId: string): void {
        ArrayUtil.removeElement(this._groups, groupId);
        const rooms = this.getRoomListFromGroup(groupId);
        for (const room of rooms) {
            if (!room.isJoined) {
                this.removeRoom(room);
            } else {
                room.isManaged = false;
            }
        }
    }

    public containsGroup(groupId: string): boolean {
        return this._groups.indexOf(groupId) > -1;
    }

    public containsRoom(idOrName: number | string): boolean {
        if (typeof idOrName === "number") {
            return this._roomsById.has(idOrName);
        }
        return this._roomsByName.has(idOrName);
    }

    public containsRoomInGroup(idOrName: number | string, groupId: string): boolean {
        const rooms = this.getRoomListFromGroup(groupId);
        const isId = typeof idOrName === "number";
        for (const room of rooms) {
            if (isId) {
                if (room.id === idOrName) {
                    return true;
                }
            } else if (room.name === idOrName) {
                return true;
            }
        }
        return false;
    }

    public getRoomById(id: number): Room | null {
        return this._roomsById.get(id) || null;
    }

    public getRoomByName(name: string): Room | null {
        return this._roomsByName.get(name) || null;
    }

    public getRoomList(): Array<Room> {
        return Array.from(this._roomsById.values());
    }

    public getRoomCount(): number {
        return this._roomsById.size;
    }

    public getRoomListFromGroup(groupId: string): Array<Room> {
        const result: Array<Room> = [];
        for (const room of this._roomsById.values()) {
            if (room.groupId === groupId) {
                result.push(room);
            }
        }
        return result;
    }

    public removeRoom(room: Room): void {
        this._removeRoom(room.id, room.name);
    }

    public removeRoomById(id: number): void {
        const room = this._roomsById.get(id);
        if (room !== undefined) {
            this._removeRoom(id, room.name);
        }
    }

    public removeRoomByName(name: string): void {
        const room = this._roomsByName.get(name);
        if (room !== undefined) {
            this._removeRoom(room.id, name);
        }
    }

    public getJoinedRooms(): Array<Room> {
        const result: Array<Room> = [];
        for (const room of this._roomsById.values()) {
            if (room.isJoined) {
                result.push(room);
            }
        }
        return result;
    }

    public getUserRooms(user: User): Array<Room> {
        const result: Array<Room> = [];
        for (const room of this._roomsById.values()) {
            if (room.containsUser(user)) {
                result.push(room);
            }
        }
        return result;
    }

    public removeUser(user: User): void {
        for (const room of this._roomsById.values()) {
            if (room.containsUser(user)) {
                room.removeUser(user);
            }
        }
    }

    private _removeRoom(id: number, name: string): void {
        this._roomsById.delete(id);
        this._roomsByName.delete(name);
    }
}
