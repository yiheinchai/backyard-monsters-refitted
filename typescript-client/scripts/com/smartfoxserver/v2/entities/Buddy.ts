import { BuddyVariable } from "./variables/BuddyVariable";

/**
 * Buddy - Interface for buddy entities.
 */
export interface Buddy {
    readonly id: number;
    readonly name: string;
    readonly isBlocked: boolean;
    readonly isOnline: boolean;
    readonly isTemp: boolean;
    readonly state: string;
    readonly nickName: string;
    readonly variables: Array<BuddyVariable>;
    getVariable(name: string): BuddyVariable | null;
    containsVariable(name: string): boolean;
    getOfflineVariables(): Array<BuddyVariable>;
    getOnlineVariables(): Array<BuddyVariable>;
    setVariable(variable: BuddyVariable): void;
    setVariables(variables: Array<BuddyVariable>): void;
    setId(id: number): void;
    setBlocked(blocked: boolean): void;
    removeVariable(name: string): void;
    clearVolatileVariables(): void;
}
