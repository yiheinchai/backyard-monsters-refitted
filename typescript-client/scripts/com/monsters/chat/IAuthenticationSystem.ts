import { UserRecord } from "./UserRecord";

/**
 * Interface for authentication systems in chat.
 */
export interface IAuthenticationSystem {
    authenticate(): boolean;
    readonly User: UserRecord;
}
