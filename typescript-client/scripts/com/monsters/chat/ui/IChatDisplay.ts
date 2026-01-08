import { IEventDispatcher } from "openfl/events/IEventDispatcher";

/**
 * Interface for chat display components.
 */
export interface IChatDisplay extends IEventDispatcher {
    clearChat(): void;
    init(): void;
    push(message: string, sender?: string | null, userId?: string | null, userImage?: string | null, isSystem?: boolean): void;
    update(): void;
    readonly inputText: string;
    clearInputText(): void;
}
