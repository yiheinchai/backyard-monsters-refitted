import MovieClip from 'openfl/display/MovieClip';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { TUTORIALPOPUPMC_CLIP } from './TUTORIALPOPUPMC_CLIP';
import { TUTORIAL } from './TUTORIAL';
import { GLOBAL } from './GLOBAL';
import { GAME } from './GAME';
import { UI2 } from './UI2';
import { Button } from './Button';
import { Button_CLIP } from './Button_CLIP';
import { buttonFullscreen_CLIP } from './buttonFullscreen_CLIP';

export class TUTORIALPOPUPMC extends TUTORIALPOPUPMC_CLIP {
    public posX: number;
    public posY: number;
    private offsetX: number;
    private offsetY: number;
    private mcButton2: Button;
    private m_fullScreenButton: MovieClip;
    private m_origButtonWidth: number;

    constructor(param1: number = 0, param2: number = 0) {
        super();
        this.mcButton.addEventListener(MouseEvent.CLICK, TUTORIAL.Advance);
        this.mcButton.Highlight = true;
        this.mcBlocker.mouseEnabled = true;
        this.mcText.autoSize = "left";
        this.posX = param1;
        this.posY = param2;
        this.m_origButtonWidth = this.mcButton.width;
        if (GLOBAL._local && GLOBAL._aiDesignMode) {
            this.addEventListener(MouseEvent.MOUSE_DOWN, this.DragStart.bind(this));
            this.addEventListener(MouseEvent.MOUSE_UP, this.DragStop.bind(this));
        }
    }

    public showTwoButtons(param1: string, param2: string, param3: Function): void {
        this.mcArrow.visible = false;
        this.mcButton.width /= 2.4;
        this.mcButton.Highlight = false;
        this.mcButton.SetupKey(param1);
        this.mcButton2 = this.addChild(new Button_CLIP()) as Button;
        this.mcButton2.width = this.mcButton.width;
        this.mcButton2.x = this.mcButton.x + this.mcButton.width + 30;
        this.mcButton2.y = this.mcButton.y;
        this.mcButton2.addEventListener(MouseEvent.CLICK, param3 as any);
        this.mcButton2.Highlight = true;
        this.mcButton2.SetupKey(param2);
    }

    public Say(param1: string, param2: boolean, param3: boolean): void {
        this.mcArrow.visible = true;
        this.mcText.htmlText = param1;
        if (TUTORIAL._stage < 200) {
            this.mcButton.SetupKey("tut_next_btn");
        } else {
            this.mcButton.SetupKey("tut_finish_btn");
        }
        if (param2) {
            this.mcBlocker.visible = true;
        } else {
            this.mcBlocker.visible = false;
        }
        this.mcArrow.visible = false;
        if (param3) {
            if (TUTORIAL._stage <= 5) {
                this.mcArrow.visible = true;
            }
            this.mcButton.width = this.m_origButtonWidth;
            this.mcButton.visible = true;
            this.mcBubble.height = this.mcText.height + 55;
        } else {
            this.mcButton.visible = false;
            this.mcBubble.height = this.mcText.height + 15;
        }
        if (this.mcButton2) {
            this.mcButton2.visible = false;
        }
        this.removeFullScreenButton();
        this.mcText.y = 0 - this.mcBubble.height + 10;
    }

    public DragStart(param1: MouseEvent): void {
        this.offsetX = GLOBAL._ROOT.mouseX - this.x;
        this.offsetY = GLOBAL._ROOT.mouseY - this.y;
        this.addEventListener(Event.ENTER_FRAME, this.Move.bind(this));
    }

    public DragStop(param1: MouseEvent): void {
        this.removeEventListener(Event.ENTER_FRAME, this.Move.bind(this));
    }

    public Move(param1: Event = null): void {
        this.x = GLOBAL._ROOT.mouseX - this.offsetX;
        this.y = GLOBAL._ROOT.mouseY - this.offsetY;
    }

    public SetPos(param1: number, param2: number): void {
        this.posX = param1;
        this.posY = param2;
    }

    public addFullScreenButton(param1: Function): void {
        this.m_fullScreenButton = GAME._instance.stage.addChild(new buttonFullscreen_CLIP()) as MovieClip;
        this.m_fullScreenButton.x = UI2._top.localToGlobal(new Point(UI2._top.mcSound.x, UI2._top.mcSound.y)).x - 31;
        this.m_fullScreenButton.y = UI2._top.y;
        this.m_fullScreenButton.addEventListener(MouseEvent.CLICK, param1 as any);
    }

    public removeFullScreenButton(): void {
        if (this.m_fullScreenButton) {
            this.m_fullScreenButton.parent.removeChild(this.m_fullScreenButton);
            this.m_fullScreenButton = null;
        }
    }

    public Resize(): void {
        this.x = GLOBAL.isFullScreen ? (GLOBAL._SCREENINIT.right - this.mcBubble.width) / 2 + this.posX : GLOBAL._SCREEN.x + this.posX;
        this.y = GLOBAL._SCREENINIT.y - GLOBAL._SCREEN.y + this.posY;
        this.mcBlocker.width = GLOBAL._SCREEN.width;
        this.mcBlocker.height = GLOBAL._SCREEN.height;
        this.mcBlocker.x = GLOBAL.isFullScreen ? -((this.mcBlocker.width - this.mcBubble.width) * 0.5 + this.posX) : -this.posX;
        this.mcBlocker.y = GLOBAL.isFullScreen ? -(this.mcBlocker.height * 0.5 - this.mcBubble.height * 1.5 + this.posY) : -this.posY;
        if (this.m_fullScreenButton) {
            this.m_fullScreenButton.x = UI2._top.localToGlobal(new Point(UI2._top.mcSound.x, UI2._top.mcSound.y)).x - 31;
            this.m_fullScreenButton.y = UI2._top.y;
        }
    }
}
