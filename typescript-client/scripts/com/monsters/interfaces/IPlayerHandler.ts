import { Player } from "../player/Player";
import { IHandler } from "./IHandler";

/**
 * Interface for player-specific handlers.
 */
export interface IPlayerHandler extends IHandler {
    set player(player: Player);
}
