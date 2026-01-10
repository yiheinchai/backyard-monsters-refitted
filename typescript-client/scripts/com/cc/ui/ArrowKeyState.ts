import KeyboardEvent from "openfl/events/KeyboardEvent";
import Keyboard from "openfl/ui/Keyboard";

/**
 * ArrowKeyState - Tracks arrow key press states.
 */
export class ArrowKeyState {
    private static _leftPressed: boolean = false;
    private static _rightPressed: boolean = false;
    private static _lastX: number = 0;
    private static _upPressed: boolean = false;
    private static _downPressed: boolean = false;
    private static _lastY: number = 0;
    private static readonly MINIMUM_LOG_DURATION: number = 500;
    private static _startPress: number = 0;
    private static _logged: boolean = false;

    constructor() { }

    public static Reset(): void {
        ArrowKeyState._leftPressed = ArrowKeyState._rightPressed = ArrowKeyState._upPressed = ArrowKeyState._downPressed = false;
        ArrowKeyState._lastX = ArrowKeyState._lastY = 0;
    }

    public static KeyDown(e: KeyboardEvent): void {
        let keyPressed = true;
        switch (e.keyCode) {
            case Keyboard.LEFT:
                ArrowKeyState._leftPressed = true;
                ArrowKeyState._lastX = 1;
                break;
            case Keyboard.RIGHT:
                ArrowKeyState._rightPressed = true;
                ArrowKeyState._lastX = -1;
                break;
            case Keyboard.UP:
                ArrowKeyState._upPressed = true;
                ArrowKeyState._lastY = 1;
                break;
            case Keyboard.DOWN:
                ArrowKeyState._downPressed = true;
                ArrowKeyState._lastY = -1;
                break;
            default:
                keyPressed = false;
        }
        if (!ArrowKeyState._logged && keyPressed && !ArrowKeyState._startPress) {
            ArrowKeyState._startPress = Date.now();
        }
    }

    public static KeyUp(e: KeyboardEvent): void {
        let keyPressed = true;
        switch (e.keyCode) {
            case Keyboard.LEFT:
                ArrowKeyState._leftPressed = false;
                break;
            case Keyboard.RIGHT:
                ArrowKeyState._rightPressed = false;
                break;
            case Keyboard.UP:
                ArrowKeyState._upPressed = false;
                break;
            case Keyboard.DOWN:
                ArrowKeyState._downPressed = false;
                break;
            case Keyboard.CONTROL:
                ArrowKeyState._upPressed = ArrowKeyState._downPressed = ArrowKeyState._leftPressed = ArrowKeyState._rightPressed = false;
                break;
            default:
                keyPressed = false;
        }
        if (!ArrowKeyState._logged && keyPressed && ArrowKeyState._startPress) {
            if (Date.now() - ArrowKeyState._startPress >= ArrowKeyState.MINIMUM_LOG_DURATION) {
                ArrowKeyState._logged = true;
            }
            ArrowKeyState._startPress = 0;
        }
    }

    public static get ArrowKeyPressed(): boolean {
        return ArrowKeyState._upPressed || ArrowKeyState._downPressed || ArrowKeyState._leftPressed || ArrowKeyState._rightPressed;
    }

    public static get xDir(): number {
        let result = 0;
        if (ArrowKeyState._leftPressed && ArrowKeyState._rightPressed) {
            result = ArrowKeyState._lastX;
        } else if (ArrowKeyState._leftPressed) {
            result = 1;
        } else if (ArrowKeyState._rightPressed) {
            result = -1;
        }
        return result;
    }

    public static get yDir(): number {
        let result = 0;
        if (ArrowKeyState._upPressed && ArrowKeyState._downPressed) {
            result = ArrowKeyState._lastY;
        } else if (ArrowKeyState._upPressed) {
            result = 1;
        } else if (ArrowKeyState._downPressed) {
            result = -1;
        }
        return result;
    }
}
