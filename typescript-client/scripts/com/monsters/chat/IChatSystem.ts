import { Channel } from "./Channel";
import { IAuthenticationSystem } from "./IAuthenticationSystem";

/**
 * Interface for chat systems.
 */
export interface IChatSystem {
    login(auth: IAuthenticationSystem): void;
    join(channel: Channel, password?: string | null, silent?: boolean): void;
    leave(channel: Channel, silent?: boolean): void;
    say(channel: Channel, message: string): void;
    list(filter?: string | null): void;
    members(channel: Channel): void;
    ignore(userId: string, reason: string): void;
    unignore(userId: string): void;
    error(code: string, message: string): void;
}
