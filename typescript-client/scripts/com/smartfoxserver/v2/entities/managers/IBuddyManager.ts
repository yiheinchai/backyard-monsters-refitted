import { Buddy } from "../Buddy";
import { BuddyVariable } from "../variables/BuddyVariable";

/**
 * IBuddyManager - Interface for buddy list management.
 */
export interface IBuddyManager {
    readonly isInited: boolean;
    readonly offlineBuddies: Array<Buddy>;
    readonly onlineBuddies: Array<Buddy>;
    readonly buddyList: Array<Buddy>;
    readonly buddyStates: Array<string>;
    readonly myVariables: Array<BuddyVariable>;
    readonly myOnlineState: boolean;
    readonly myNickName: string;
    readonly myState: string;

    setInited(): void;
    addBuddy(buddy: Buddy): void;
    removeBuddyById(id: number): Buddy | null;
    removeBuddyByName(name: string): Buddy | null;
    containsBuddy(name: string): boolean;
    getBuddyById(id: number): Buddy | null;
    getBuddyByName(name: string): Buddy | null;
    getBuddyByNickName(nickName: string): Buddy | null;
    getMyVariable(name: string): BuddyVariable | null;
    setMyVariable(variable: BuddyVariable): void;
    setMyVariables(variables: Array<BuddyVariable>): void;
    setMyOnlineState(online: boolean): void;
    setMyNickName(nickName: string): void;
    setMyState(state: string): void;
    setBuddyStates(states: Array<string>): void;
    clearAll(): void;
}
