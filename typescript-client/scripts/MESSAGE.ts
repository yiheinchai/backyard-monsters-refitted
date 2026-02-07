import MouseEvent from 'openfl/events/MouseEvent';
import TextFieldAutoSize from 'openfl/text/TextFieldAutoSize';
import { POPUPSETTINGS } from './POPUPSETTINGS';
import { TweenLite, Elastic } from './gs/TweenLite';
import { MESSAGE_CLIP } from './MESSAGE_CLIP';

// Lazy imports to break circular dependency chains
function getConsole(): any { return require("./com/monsters/debug/Console").Console; }
function getGLOBAL(): any { return require("./GLOBAL").GLOBAL; }
function getSOUNDS(): any { return require("./SOUNDS").SOUNDS; }


/**
 * MESSAGE - Dialog Message System
 * Handles displaying dialog messages with action buttons
 */
export class MESSAGE extends MESSAGE_CLIP {
    public _mc: MESSAGE | null = null;
    public _action: Function | null = null;
    public _action2: Function | null = null;
    public _args: any[] | null = null;
    public _args2: any[] | null = null;

    constructor() {
        super();
    }

    public Show(message: string | null = null, button1Text: string | null = null, action1: Function | null = null, 
                args1: any[] | null = null, button2Text: string | null = null, action2: Function | null = null, 
                args2: any[] | null = null, flags: number = 1, closeable: boolean = true): MESSAGE {
        this._action = action1;
        this._action2 = action2;
        this._args = args1;
        this._args2 = args2;
        this.tMessage.autoSize = TextFieldAutoSize.CENTER;
        this.tMessage.htmlText = message || "";
        this.mcBG.height = this.tMessage.height + 45;
        if (button1Text) {
            this.bAction.Setup(button1Text);
            this.bAction.addEventListener(MouseEvent.CLICK, this.Action.bind(this));
            this.mcBG.height += 30;
        } else {
            this.bAction.visible = false;
        }
        if (button2Text) {
            this.bAction2.Setup(button2Text);
            this.bAction2.addEventListener(MouseEvent.CLICK, this.Action2.bind(this));
            this.mcBG.height += 30;
        } else {
            this.bAction2.visible = false;
        }
        this.mcBG.y = 0 - Math.floor(this.mcBG.height * 0.5);
        this.mcBG.Setup(closeable);
        this.tMessage.y = this.mcBG.y + 20;
        this.bAction.y = this.mcBG.y + this.mcBG.height - 45;
        this.bAction2.y = this.mcBG.y + this.mcBG.height - 45;
        getGLOBAL().BlockerAdd(getGLOBAL()._layerTop);
        this._mc = getGLOBAL()._layerTop.addChild(this) as MESSAGE;
        this.Center();
        this.ScaleUp();
        return this;
    }

    public Action(event: MouseEvent): void {
        this.Hide();
        if (this._action) {
            try {
                if (!this._args) {
                    this._action();
                } else if (this._args.length === 1) {
                    this._action(this._args[0]);
                } else if (this._args.length === 2) {
                    this._action(this._args[0], this._args[1]);
                } else if (this._args.length === 3) {
                    this._action(this._args[0], this._args[1], this._args[2]);
                } else if (this._args.length === 4) {
                    this._action(this._args[0], this._args[1], this._args[2], this._args[3]);
                } else {
                    console.log("ERROR: MESSAGE.Action only handles up to 4 parameters!");
                }
            } catch (error: any) {
                getConsole().warning(error + "MESSAGE.Action (invalid action and/or arguments)", true);
            }
        }
    }

    public Action2(event: MouseEvent): void {
        this.Hide();
        if (this._action2) {
            if (!this._args2) {
                this._action2();
            } else if (this._args2.length === 1) {
                this._action2(this._args2[0]);
            } else if (this._args2.length === 2) {
                this._action2(this._args2[0], this._args2[1]);
            } else if (this._args2.length === 3) {
                this._action2(this._args2[0], this._args2[1], this._args2[2]);
            }
        }
    }

    public Hide(event: MouseEvent | null = null): void {
        getGLOBAL().BlockerRemove();
        getSOUNDS().Play("close");
        if (this._mc && this._mc.parent) {
            getGLOBAL()._layerTop.removeChild(this._mc);
        }
        this._mc = null;
    }

    public Resize(): void {
        if (getGLOBAL()._SCREENCENTER) {
            this.x = getGLOBAL()._SCREENCENTER.x;
            this.y = getGLOBAL()._SCREENCENTER.y;
        } else {
            this.x = getGLOBAL()._SCREENINIT.width / 2;
            this.y = getGLOBAL()._SCREENINIT.height / 2;
        }
    }

    public Center(): void {
        POPUPSETTINGS.AlignToCenter(this);
    }

    public ScaleUp(): void {
        POPUPSETTINGS.ScaleUp(this);
    }
}
