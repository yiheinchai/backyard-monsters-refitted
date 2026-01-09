import { IRoomManager } from "./managers/IRoomManager";
import { User } from "./User";
import { RoomVariable } from "./variables/RoomVariable";

/**
 * Room - Interface for room entities.
 */
export interface Room {
    readonly id: number;
    name: string;
    readonly groupId: string;
    isJoined: boolean;
    isGame: boolean;
    isHidden: boolean;
    isPasswordProtected: boolean;
    isManaged: boolean;
    userCount: number;
    maxUsers: number;
    spectatorCount: number;
    maxSpectators: number;
    readonly capacity: number;
    readonly userList: Array<User>;
    readonly playerList: Array<User>;
    readonly spectatorList: Array<User>;
    properties: any;
    roomManager: IRoomManager;

    addUser(user: User): void;
    removeUser(user: User): void;
    containsUser(user: User): boolean;
    getUserByName(name: string): User | null;
    getUserById(id: number): User | null;
    getVariable(name: string): RoomVariable | null;
    getVariables(): Array<RoomVariable>;
    setVariable(variable: RoomVariable): void;
    setVariables(variables: Array<RoomVariable>): void;
    containsVariable(name: string): boolean;
    setPasswordProtected(value: boolean): void;
}
