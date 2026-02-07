import MovieClip from 'openfl/display/MovieClip';
import StageDisplayState from 'openfl/display/StageDisplayState';
import MouseEvent from 'openfl/events/MouseEvent';
import { TweenLite, Elastic } from './gs/TweenLite';

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getKEYS(): any { return require("./KEYS").KEYS; }
function getLOGGER(): any { return require("./LOGGER").LOGGER; }


/**
 * ERRORMESSAGE - Error Display System
 * Handles displaying error messages and oops popups
 */
export class ERRORMESSAGE {
    public _mc: MovieClip | null = null;
    public _blocker: any = null;
    public x: number = 0;
    public y: number = 0;
    public tMessage: any;
    public bg: any;

    constructor() {}

    public Show(message: string, errorType: number = 0): void {
        const Resume = (event: MouseEvent | null = null): void => {
            getGLOBAL().CallJS("reloadPage");
        };

        if (getGLOBAL()._ROOT.stage.displayState === StageDisplayState.FULL_SCREEN) {
            getGLOBAL()._ROOT.stage.displayState = StageDisplayState.NORMAL;
        }

        if (errorType !== getGLOBAL().ERROR_OOPS_ONLY) {
            this._mc = getGLOBAL()._layerTop.addChild(this as any) as MovieClip;
            this.tMessage.autoSize = "left";
            if (message) {
                this.tMessage.htmlText = message;
            } else {
                this.tMessage.htmlText = "No message???";
            }
            this.bg.height = this.tMessage.height + 20;
            getLOGGER().Log("err", "HALT: " + message);
        }

        if (errorType !== getGLOBAL().ERROR_ORANGE_BOX_ONLY) {
            console.log(" *** ERRORMESSAGE SHOWING OOPS " + message);
            getGLOBAL().RefreshScreen();
            try {
                throw new Error(message);
            } catch (e: any) {
                getLOGGER().Log("err", "HALT " + message + " | " + e.stack);
                this._mc = getGLOBAL()._ROOT.addChild(new (GLOBAL as any).popup_error()) as MovieClip;
                (this._mc as any).mcFrame.Setup(false);
                if (getKEYS()._setup) {
                    (this._mc as any).tA.htmlText = "<b>" + getKEYS().Get("pop_oops_title") + "</b>";
                    (this._mc as any).tB.htmlText = getKEYS().Get("pop_oops_body");
                    (this._mc as any).tB.htmlText = getKEYS().Get(message);
                }
                this._blocker = (this._mc as any).blocker;
                this._blocker.x = getGLOBAL()._SCREENCENTER.x - 1400;
                this._blocker.y = getGLOBAL()._SCREENCENTER.y - 1400;
                this._blocker.width = 2800;
                this._blocker.height = 2800;
                (this._mc as any).bAction.Setup("Reload");
                (this._mc as any).bAction.addEventListener(MouseEvent.CLICK, Resume);
            }
        }

        if (this._mc) {
            this._mc.x -= 50;
            TweenLite.to(this._mc, 0.5, {
                x: this._mc.x + 50,
                ease: Elastic.easeOut
            });
        }
        getLOGGER().Log("err", "OOPS");
        getGLOBAL()._halt = true;
    }

    public Resize(): void {
        getGLOBAL().RefreshScreen();
        this.x = getGLOBAL()._SCREEN.x;
        this.y = getGLOBAL()._SCREEN.y;
        if (this._blocker) {
            this._blocker.width = getGLOBAL()._SCREEN.width;
            this._blocker.height = getGLOBAL()._SCREEN.height;
        }
    }
}
