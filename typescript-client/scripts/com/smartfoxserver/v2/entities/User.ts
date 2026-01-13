import { IUserManager } from "./managers/IUserManager";
import { Room } from "./Room";
import { UserVariable } from "./variables/UserVariable";

/**
 * User - Interface for user entities.
 */
export interface User {
    readonly id: number;
    readonly name: string;
    readonly playerId: number;
    readonly isPlayer: boolean;
    readonly isSpectator: boolean;
    readonly isItMe: boolean;
    privilegeId: number;
    userManager: IUserManager;
    properties: any;

    getPlayerId(room: Room): number;
    setPlayerId(id: number, room: Room): void;
    removePlayerId(room: Room): void;
    isGuest(): boolean;
    isStandardUser(): boolean;
    isModerator(): boolean;
    isAdmin(): boolean;
    isPlayerInRoom(room: Room): boolean;
    isSpectatorInRoom(room: Room): boolean;
    isJoinedInRoom(room: Room): boolean;
    getVariables(): Array<UserVariable>;
    getVariable(name: string): UserVariable | null;
    setVariable(variable: UserVariable): void;
    setVariables(variables: Array<UserVariable>): void;
    containsVariable(name: string): boolean;
}
