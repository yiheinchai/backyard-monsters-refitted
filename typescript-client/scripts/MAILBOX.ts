import { MailBox } from './com/monsters/mailbox/MailBox';
import MouseEvent from 'openfl/events/MouseEvent';
import { SOUNDS } from './SOUNDS';
import { GLOBAL } from './GLOBAL';
// import { Loader } from 'openfl/display/Loader'; // Not used in stub logic heavily

export class MAILBOX {
    public static _loader: any;
    public static _open: boolean = false;
    private static loaded: boolean = false;
    public static _handleTruceRequests: boolean = true;
    public static _threadidToOpen: number = -1;
    public static _mc: MailBox | null = null;

    constructor() {
    }

    public static Setup(): void {
        MAILBOX._mc = null;
    }

    public static Show(): void {
        SOUNDS.Play("click1");
        MAILBOX._mc = new MailBox();
        GLOBAL.BlockerAdd();
        if (GLOBAL._layerWindows) {
            (GLOBAL._layerWindows as any).addChild(MAILBOX._mc);
        }
        MAILBOX._mc.Setup();
    }

    public static Tick(): void {
        // GLOBAL.Timestamp() stub??
        // if (MAILBOX._mc && GLOBAL.Timestamp() % 15 == 0) {
        if (MAILBOX._mc) {
             MAILBOX._mc.Tick();
        }
    }

    public static Hide(param1: MouseEvent = null): void {
        try {
            SOUNDS.Play("close");
            GLOBAL.BlockerRemove();
            if (MAILBOX._mc && GLOBAL._layerWindows) {
                (GLOBAL._layerWindows as any).removeChild(MAILBOX._mc);
            }
            MAILBOX._mc = null;
        } catch (e) {
        }
    }

    public static ShowWithThreadId(param1: number): void {
        MAILBOX._threadidToOpen = param1;
        MAILBOX.Show();
    }
}
