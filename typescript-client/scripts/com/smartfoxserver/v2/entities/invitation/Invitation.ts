import { User } from "../User";
import { ISFSObject } from "../data/ISFSObject";

/**
 * Invitation - Interface for game invitations.
 */
export interface Invitation {
    id: number;
    readonly inviter: User;
    readonly invitee: User;
    readonly secondsForAnswer: number;
    readonly params: ISFSObject;
}
