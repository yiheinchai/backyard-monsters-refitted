import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import DisplayObject from "openfl/display/DisplayObject";
import MovieClip from "openfl/display/MovieClip";
import Event from "openfl/events/Event";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";
import { TweenLite, Sine } from "gs/TweenLite";

import { BYMConfig } from "../configs/BYMConfig";
import { RasterData } from "../rendering/RasterData";
import { ResourceBomb } from "./ResourceBomb";
import { ResourceBombs } from "./ResourceBombs";

// Lazy imports to break circular dependency chains
function getGLOBAL(): any { return require("../../../GLOBAL").GLOBAL; }
function getMAP(): any { return require("../../../MAP").MAP; }



/**
 * ResourceBombParticle - individual particle for resource bomb effects.
 */
export class ResourceBombParticle {
    public static readonly k_TYPE_TWIGS: number = 1;
    public static readonly k_TYPE_PEBBLE: number = 2;
    public static readonly k_TYPE_PUTTY: number = 3;

    private mc: DisplayObject | null = null;
    private container: MovieClip | null = null;
    private bmd_frame: BitmapData | null = null;
    private mctop: MovieClip;
    private mcbottom: MovieClip;
    private animframe: number = 0;
    private variation: number = 0;
    private m_position: Point;
    private m_bomb: ResourceBomb;
    private m_id: string;
    private m_resourceId: number;
    private m_rasterData: RasterData | null = null;
    private m_rasterPt: Point | null = null;
    private m_cleared: boolean = false;

    constructor(top: MovieClip, bottom: MovieClip, position: Point, bomb: ResourceBomb, id: string, delay: number, resourceId: number) {
        this.mctop = top;
        this.mcbottom = bottom;
        this.m_position = position;
        this.m_bomb = bomb;
        this.m_id = id;
        this.m_resourceId = resourceId;
        this.m_cleared = false;
        const offset = new Point();
        switch (this.m_resourceId) {
            case ResourceBombParticle.k_TYPE_TWIGS:
                this.variation = Math.floor(Math.random() * 5);
                this.bmd_frame = new BitmapData(24, 30, true, 16777215);
                this.bmd_frame.copyPixels(ResourceBombs.bmd_twigs, new Rectangle(24 * this.variation, 0, 24, 30), new Point(0, 0));
                if (!BYMConfig.instance.RENDERER_ON) {
                    this.mc = this.mctop.addChild(new Bitmap(this.bmd_frame));
                } else {
                    this.mc = new Bitmap(this.bmd_frame);
                }
                offset.x = -12;
                offset.y = -15;
                break;
            case ResourceBombParticle.k_TYPE_PEBBLE:
                this.variation = Math.floor(Math.random() * 18);
                this.bmd_frame = new BitmapData(27, 17, true, 16777215);
                this.bmd_frame.copyPixels(ResourceBombs.bmd_pebble, new Rectangle(27 * this.variation, 0, 27, 17), new Point(0, 0));
                if (!BYMConfig.instance.RENDERER_ON) {
                    this.mc = this.mctop.addChild(new Bitmap(this.bmd_frame));
                } else {
                    this.mc = new Bitmap(this.bmd_frame);
                }
                offset.x = -40;
                offset.y = -42;
                break;
            case ResourceBombParticle.k_TYPE_PUTTY:
                this.bmd_frame = new BitmapData(81, 52, true, 16777215);
                this.bmd_frame.copyPixels(ResourceBombs.bmd_putty, new Rectangle(0, 0, 81, 52), new Point(0, 0));
                if (!BYMConfig.instance.RENDERER_ON) {
                    this.mc = this.mctop.addChild(new Bitmap(this.bmd_frame));
                } else {
                    this.mc = new Bitmap(this.bmd_frame);
                }
                offset.x = -40;
                offset.y = -26;
        }
        this.mc!.x = position.x + 100 + offset.x;
        this.mc!.y = position.y - getGLOBAL().StageHeight + offset.y;
        if (!BYMConfig.instance.RENDERER_ON) {
            this.mc!.cacheAsBitmap = true;
        } else {
            this.m_rasterPt = new Point(this.mc!.x - getMAP().instance.offset.x + this.mctop.x, this.mc!.y - getMAP().instance.offset.y + this.mctop.y);
            this.m_rasterData = new RasterData(this.bmd_frame!, this.m_rasterPt, Number.MAX_VALUE);
            this.m_rasterData.visible = false;
        }
        this.mc!.visible = false;
        if (!BYMConfig.instance.RENDERER_ON) {
            if (resourceId === ResourceBombParticle.k_TYPE_PUTTY) {
                TweenLite.to(this.mc, 0.3 + Math.random() * 0.5, {
                    "delay": 1,
                    "x": position.x,
                    "y": position.y,
                    "onStart": this.Add.bind(this),
                    "onComplete": this.Hit.bind(this),
                    "ease": Sine.easeIn
                });
            } else {
                TweenLite.to(this.mc, 0.3 + Math.random() * 0.5, {
                    "delay": 1 + Math.random() * (delay * 2),
                    "x": position.x,
                    "y": position.y,
                    "onStart": this.Add.bind(this),
                    "onComplete": this.Hit.bind(this),
                    "ease": Sine.easeIn
                });
            }
        } else if (resourceId === ResourceBombParticle.k_TYPE_PUTTY) {
            TweenLite.to(this.m_rasterPt, 0.3 + Math.random() * 0.5, {
                "delay": 1,
                "x": position.x - getMAP().instance.offset.x + this.mctop.x,
                "y": position.y - getMAP().instance.offset.y + this.mctop.y,
                "onStart": this.Add.bind(this),
                "onComplete": this.Hit.bind(this),
                "ease": Sine.easeIn
            });
        } else {
            TweenLite.to(this.m_rasterPt, 0.3 + Math.random() * 0.5, {
                "delay": 1 + Math.random() * (delay * 2),
                "x": position.x - getMAP().instance.offset.x + this.mctop.x,
                "y": position.y - getMAP().instance.offset.y + this.mctop.y,
                "onStart": this.Add.bind(this),
                "onComplete": this.Hit.bind(this),
                "ease": Sine.easeIn
            });
        }
    }

    protected Add(): void {
        if (!BYMConfig.instance.RENDERER_ON) {
            this.mc!.visible = true;
        } else {
            this.m_rasterData!.visible = true;
        }
    }

    protected Hit(): void {
        if (this.m_cleared) {
            return;
        }
        if (!BYMConfig.instance.RENDERER_ON) {
            this.mctop.removeChild(this.mc!);
        }
        this.animframe = 0;
        const offset = new Point(0, 0);
        this.m_bomb.Damage(this.m_position);
        switch (this.m_resourceId) {
            case ResourceBombParticle.k_TYPE_TWIGS:
                this.bmd_frame!.copyPixels(ResourceBombs.bmd_twigs, new Rectangle(24 * this.variation, 30, 24, 30), new Point(0, 0));
                if (!BYMConfig.instance.RENDERER_ON) {
                    this.mc = this.mcbottom.addChild(new Bitmap(this.bmd_frame!));
                } else {
                    this.m_rasterData!.data = this.bmd_frame!;
                }
                offset.x = -12;
                offset.y = -15;
                this.m_bomb.RemoveParticle(this.m_id);
                break;
            case ResourceBombParticle.k_TYPE_PEBBLE:
                this.variation = Math.floor(Math.random() * 4);
                this.bmd_frame = new BitmapData(80, 85, true, 16777215);
                this.bmd_frame.copyPixels(ResourceBombs.bmd_pebblehit, new Rectangle(0, 85 * this.variation, 80, 85), new Point(0, 0));
                if (!BYMConfig.instance.RENDERER_ON) {
                    this.mc = this.mcbottom.addChild(new Bitmap(this.bmd_frame));
                } else {
                    this.m_rasterData!.data = this.bmd_frame;
                }
                offset.x = -40;
                offset.y = -50;
                this.mc!.addEventListener(Event.ENTER_FRAME, this.Anim.bind(this));
                break;
            default:
                this.variation = Math.floor(Math.random() * 4);
                this.bmd_frame = new BitmapData(81, 52, true, 16777215);
                this.bmd_frame.copyPixels(ResourceBombs.bmd_putty, new Rectangle(0, 81 * this.variation, 81, 52), new Point(0, 0));
                if (!BYMConfig.instance.RENDERER_ON) {
                    this.mc = this.mcbottom.addChild(new Bitmap(this.bmd_frame));
                } else {
                    this.m_rasterData!.data = this.bmd_frame;
                }
                offset.x = -40;
                offset.y = -26;
                this.mc!.addEventListener(Event.ENTER_FRAME, this.Anim.bind(this));
        }
        if (!this.m_cleared) {
            this.mc!.x = this.m_position.x + offset.x;
            this.mc!.y = this.m_position.y + offset.y;
            if (BYMConfig.instance.RENDERER_ON) {
                this.m_rasterPt!.x = this.mc!.x - getMAP().instance.offset.x - this.mctop.x;
                this.m_rasterPt!.y = this.mc!.y - getMAP().instance.offset.y - this.mctop.y;
            }
        }
    }

    protected Anim(event: Event): void {
        if (this.m_cleared) {
            return;
        }
        if (this.m_resourceId === 2) {
            if (this.animframe === 20) {
                this.mc!.removeEventListener(Event.ENTER_FRAME, this.Anim.bind(this));
                this.m_bomb.RemoveParticle(this.m_id);
            } else {
                const rect = new Rectangle(80 * this.animframe, 85 * this.variation, 80, 85);
                this.bmd_frame!.copyPixels(ResourceBombs.bmd_pebblehit, rect, new Point(0, 0));
                if (BYMConfig.instance.RENDERER_ON) {
                    this.m_rasterData!.data = this.bmd_frame!;
                }
                ++this.animframe;
            }
        } else if (this.animframe === 14) {
            this.mc!.removeEventListener(Event.ENTER_FRAME, this.Anim.bind(this));
            this.m_bomb.RemoveParticle(this.m_id);
        } else {
            const rect = new Rectangle(81 * this.animframe, 81 * this.variation, 81, 52);
            this.bmd_frame!.copyPixels(ResourceBombs.bmd_putty, rect, new Point(0, 0));
            if (BYMConfig.instance.RENDERER_ON) {
                this.m_rasterData!.data = this.bmd_frame!;
            }
            ++this.animframe;
        }
    }

    public clear(): void {
        if (this.m_cleared) {
            return;
        }
        if (BYMConfig.instance.RENDERER_ON) {
            if (this.m_resourceId !== ResourceBombParticle.k_TYPE_TWIGS) {
                getMAP().effectsBMD.copyPixels(this.bmd_frame!, this.bmd_frame!.rect, this.m_rasterPt!);
            }
            if (this.m_rasterData) {
                this.m_rasterData.clear();
            }
            this.m_rasterData = null;
            this.m_rasterPt = null;
        }
        if (this.bmd_frame) {
            this.bmd_frame.dispose();
        }
        this.mc = null;
        this.container = null;
        this.bmd_frame = null;
        (this as any).mctop = null;
        (this as any).mcbottom = null;
        (this as any).m_position = null;
        (this as any).m_bomb = null;
        this.m_cleared = true;
    }
}
