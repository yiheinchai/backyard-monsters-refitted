import DisplayObject from 'openfl/display/DisplayObject';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import { TweenLite } from './gs/TweenLite';
import { Expo, Bounce } from './gs/easing';
import { TUTORIALARROWMC_CLIP } from './TUTORIALARROWMC_CLIP';
import { GLOBAL } from './GLOBAL';
import { MAP } from './MAP';
import { TUTORIAL } from './TUTORIAL';

export class TUTORIALARROWMC extends TUTORIALARROWMC_CLIP {
    private offsetX: number;
    private offsetY: number;
    private dragging: boolean = false;
    private wobbleCountdown: number = 0;
    public posX: number;
    public posY: number;
    public Resize: Function;
    public ResizeParams: any[];

    constructor(posx: number = 0, posy: number = 0) {
        super();
        this.posX = posx;
        this.posY = posy;
        if (GLOBAL._local) {
            this.addEventListener(MouseEvent.MOUSE_DOWN, this.DragStart.bind(this));
            MAP.stage.addEventListener(MouseEvent.MOUSE_UP, this.DragStop.bind(this));
        } else {
            this.mouseEnabled = false;
            this.mouseChildren = false;
            this.mcArrow.mouseEnabled = false;
            this.mcArrow.mouseChildren = false;
        }
        this.addEventListener(Event.ENTER_FRAME, this.Wobble.bind(this));
        this.ResizeParams = [];
        this.Resize = (): void => {
            const _loc2_ = GLOBAL._ROOT.stage.stageWidth;
            const _loc3_ = new Point();
            if (this.ResizeParams) {
                if (this.ResizeParams[0] == "percent" && this.ResizeParams[1] && this.ResizeParams[1] instanceof Point) {
                    this.x = GLOBAL._SCREEN.x + this.posX * (GLOBAL._SCREEN.width / GLOBAL._SCREENINIT.width);
                    this.y = GLOBAL._SCREEN.y + this.posY * (GLOBAL._SCREEN.height / GLOBAL._SCREENINIT.height);
                } else if (this.ResizeParams[0] == "mc" && this.ResizeParams[1] && this.ResizeParams[1] instanceof DisplayObject) {
                    let _loc4_ = this.ResizeParams[1].x;
                    let _loc5_ = this.ResizeParams[1].y;
                    let _loc6_: any = this.ResizeParams[1].parent;
                    while (_loc6_ && _loc6_.parent) {
                        _loc4_ += _loc6_.x;
                        _loc5_ += _loc6_.y;
                        if (_loc6_.parent == GLOBAL._ROOT.stage) {
                            break;
                        }
                        _loc6_ = _loc6_.parent;
                    }
                    if (this.ResizeParams[2]) {
                        _loc4_ += this.ResizeParams[2].x;
                        _loc5_ += this.ResizeParams[2].y;
                    }
                    this.x = _loc4_;
                    this.y = _loc5_;
                }
            } else {
                this.x = GLOBAL._SCREEN.x + this.posX * (GLOBAL._SCREEN.width / GLOBAL._SCREENINIT.width);
                this.y = GLOBAL._SCREEN.y + this.posY * (GLOBAL._SCREEN.height / GLOBAL._SCREENINIT.height);
            }
            this.Rotate();
        };
    }

    public DragStart(param1: MouseEvent): void {
        this.dragging = true;
        this.offsetX = GLOBAL._ROOT.mouseX - this.x;
        this.offsetY = GLOBAL._ROOT.mouseY - this.y;
        this.addEventListener(Event.ENTER_FRAME, this.Move.bind(this));
    }

    public DragStop(param1: MouseEvent): void {
        this.removeEventListener(Event.ENTER_FRAME, this.Move.bind(this));
        if (this.dragging) {
            // logging removed
        }
        this.dragging = false;
    }

    public Move(param1: Event = null): void {
        this.x = GLOBAL._ROOT.mouseX - this.offsetX;
        this.y = GLOBAL._ROOT.mouseY - this.offsetY;
        this.Rotate();
    }

    public Rotate(): void {
        if (this.ResizeParams && this.ResizeParams[3] && typeof this.ResizeParams[3] === 'number') {
            this.mcArrow.rotation = this.ResizeParams[3];
            if (this.mcArrow.rotation >= 0) {
                this.mcArrow.mcArrow.gotoAndStop(1);
            } else {
                this.mcArrow.mcArrow.gotoAndStop(2);
            }
        } else {
            if (this.y < GLOBAL._ROOT.stage.stageHeight / 2) {
                this.mcArrow.rotation = this.x / (6 / GLOBAL._SCREENINIT.width * GLOBAL._ROOT.stage.stageWidth) + 130;
            } else {
                this.mcArrow.rotation = (0 - this.x) / (6 / GLOBAL._SCREENINIT.width * GLOBAL._ROOT.stage.stageWidth) + 45;
            }
            if (this.x < GLOBAL._ROOT.stage.stageWidth / 2) {
                this.mcArrow.mcArrow.gotoAndStop(1);
            } else {
                this.mcArrow.mcArrow.gotoAndStop(2);
            }
        }
    }

    public Wobble(param1: Event): void {
        if (this.wobbleCountdown == 0) {
            this.wobbleCountdown = 80;
            this.mcArrow.mcArrow.y = -60;
            TweenLite.to(this.mcArrow.mcArrow, 0.6, {
                "y": -70,
                "ease": Expo.easeInOut,
                "onComplete": this.WobbleB.bind(this)
            });
        }
        --this.wobbleCountdown;
    }

    public WobbleB(): void {
        TweenLite.to(this.mcArrow.mcArrow, 0.6, {
            "y": -60,
            "ease": Bounce.easeOut
        });
    }

    public SetPos(param1: number, param2: number): void {
        this.posX = param1;
        this.posY = param2;
    }
}
