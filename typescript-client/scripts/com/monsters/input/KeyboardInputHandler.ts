import { KeyboardEvent } from "openfl/events/KeyboardEvent";

// Forward declarations
declare class screenshot {
    static Show(): void;
}

/**
 * Singleton lock for singleton pattern
 */
class SingletonLock {}

/**
 * Keyboard input handler - handles keyboard input for special actions.
 */
export class KeyboardInputHandler {
    protected static s_Instance: KeyboardInputHandler | null = null;
    private static keyunlock: number = 0;

    constructor(lock: SingletonLock) {}

    protected static get singletonLock(): SingletonLock {
        return new SingletonLock();
    }

    public static get instance(): KeyboardInputHandler {
        KeyboardInputHandler.s_Instance ||= new KeyboardInputHandler(KeyboardInputHandler.singletonLock);
        return KeyboardInputHandler.s_Instance;
    }

    public OnKeyDown(e: KeyboardEvent): void {
        if (e.shiftKey) {
            // Secret key combination: Shift+Up, Shift+Down, Shift+Left, Shift+Right
            if (KeyboardInputHandler.keyunlock === 0 && e.keyCode === 38) {
                // Up arrow
                KeyboardInputHandler.keyunlock = 1;
            } else if (KeyboardInputHandler.keyunlock === 1 && e.keyCode === 40) {
                // Down arrow
                KeyboardInputHandler.keyunlock = 2;
            } else if (KeyboardInputHandler.keyunlock === 2 && e.keyCode === 37) {
                // Left arrow
                KeyboardInputHandler.keyunlock = 3;
            } else if (KeyboardInputHandler.keyunlock === 3 && e.keyCode === 39) {
                // Right arrow - show screenshot tool
                screenshot.Show();
            } else {
                KeyboardInputHandler.keyunlock = 0;
            }
        }
    }
}
