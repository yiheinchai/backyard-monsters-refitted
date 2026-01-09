import { UserVariable } from "./UserVariable";

/**
 * BuddyVariable - Interface for buddy variables, extends UserVariable.
 */
export interface BuddyVariable extends UserVariable {
    readonly isOffline: boolean;
}
