import { UserVariable } from "./UserVariable";

/**
 * RoomVariable - Interface for room variables, extends UserVariable.
 */
export interface RoomVariable extends UserVariable {
    isPrivate: boolean;
    isPersistent: boolean;
}
