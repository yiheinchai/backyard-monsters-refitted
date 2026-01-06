import { Bitmap } from 'openfl/display/Bitmap';
import { BitmapData } from 'openfl/display/BitmapData';
import { DisplayObject } from 'openfl/display/DisplayObject';
import { DisplayObjectContainer } from 'openfl/display/DisplayObjectContainer';
import { MovieClip } from 'openfl/display/MovieClip';
import { TimerEvent } from 'openfl/events/TimerEvent';
import { Point } from 'openfl/geom/Point';
import { Rectangle } from 'openfl/geom/Rectangle';
import { Timer } from 'openfl/utils/Timer';
import { TweenLite } from 'gs/TweenLite';
import { Sine, Bounce } from 'gs/easing';
import { BYMConfig } from './com/monsters/configs/BYMConfig';
import { ImageCache } from './com/monsters/display/ImageCache';
import { PATHING } from './com/monsters/pathing/PATHING';
import { RasterData } from './com/monsters/rendering/RasterData';
import { WORKER_CLIP } from './WORKER_CLIP';
import { workerMessage } from './workerMessage';
import { BFOUNDATION } from './BFOUNDATION';
import { BASE } from './BASE';
import { GLOBAL } from './GLOBAL';
import { MAP } from './MAP';
import { SPRITES } from './SPRITES';

export class WORKER extends WORKER_CLIP {
    public _behaviour: string;
    public _middle: number;
    public _speed: number;
    public _targetRotation: number;
    public _targetPosition: Point;
    public _targetTask: BFOUNDATION;
    public _hasPath: boolean;
    public _frameNumber: number;
    public _scale: number;
    public _targetBuilding: BFOUNDATION;
    public _id: number;
    public _size: number;
    public _container: DisplayObjectContainer;
    public _graphic: BitmapData;
    public _lastRotation: number = 400;
    public _messageMC: MovieClip;
    private frameCount: number;
    public showTimer: Timer;
    public hideTimer: Timer;
    public yd: number;
    public xd: number;
    public _mc: MovieClip;
    public _waypoints: any[];
    private _waypointIndex: number;
    private _hasGraphic: boolean;
    private configObject: any;
    private _pathID: number = 0;
    private _jumping: boolean = false;
    private _jumpingUp: boolean = false;
    private _graphicMC: DisplayObject;
    protected _rasterData: RasterData;
    protected _rasterPt: Point;

    constructor(param1: any, param2: Point, param3: number) {
        super();
        this._mc = this;
        this._middle = 5;
        this.showTimer = new Timer(500);
        this.showTimer.addEventListener("timer", this.sayShow.bind(this));
        this.hideTimer = new Timer(2000);
        this.hideTimer.addEventListener("timer", this.sayHide.bind(this));
        this._waypoints = [];
        this._rasterPt = new Point();
        this._id = GLOBAL.NextCreepID();
        this._container = param1;
        this._targetPosition = param2;
        this.x = this._targetPosition.x;
        this.y = this._targetPosition.y;
        this._targetRotation = param3;
        this._speed = 0;
        this._size = 10;
        this._frameNumber = Math.floor(Math.random() * 200);
        if (!BASE.isInfernoMainYardOrOutpost) {
            this._graphic = new BitmapData(52, 50, true, 16777215);
        } else {
            this._graphic = new BitmapData(64, 55, true, 16777215);
        }
        SPRITES.SetupSprite("worker");
        this._graphicMC = BYMConfig.instance.RENDERER_ON ? new Bitmap(this._graphic) : this.addChild(new Bitmap(this._graphic));
        this._graphicMC.x = -26;
        this._graphicMC.y = -36;
        if (BYMConfig.instance.RENDERER_ON) {
            this._rasterData = this._rasterData || new RasterData(this._graphic, this._rasterPt, Number.MAX_VALUE);
        }
        this._hasGraphic = false;
        ImageCache.GetImageWithCallBack("monsters/worker.png", this.onAssetLoaded.bind(this));
        this.mouseEnabled = false;
        this.mouseChildren = false;
    }

    private onAssetLoaded(param1: string, param2: BitmapData): void {
        this._hasGraphic = true;
        this.Update(true);
    }

    protected updateRasterData(): void {
        if (!BYMConfig.instance.RENDERER_ON) {
            return;
        }
        const _loc1_ = MAP.instance.offset;
        if (this._graphicMC && this._rasterData) {
            let _loc2_ = this.height * 0.5;
            if (this._middle) {
                _loc2_ = this._middle;
            }
            this._rasterPt.x = this.x + this._graphicMC.x - _loc1_.x;
            this._rasterPt.y = this.y + this._graphicMC.y - _loc1_.y;
            this._rasterData.depth = Math.max(MAP.DEPTH_SHADOW + 1, (this.y - _loc1_.y + _loc2_) * 1000 + this.x - _loc1_.x);
        }
    }

    public Clear(): void {
        if (this._rasterData) {
            this._rasterData.clear();
        }
        this._rasterData = null;
        this._rasterPt = null;
    }

    public Tick(): void {
        ++this._frameNumber;
        const _loc1_ = Math.random() * 600;
        if (_loc1_ < 5 && !this._targetTask && this._speed == 0) {
            this.Wander();
        }
        this.Move();
        if (this._hasGraphic) {
            this.Update();
        }
        this.updateRasterData();
    }

    public Wander(): void {
    }

    public setWaypoints(param1: any[], param2: BFOUNDATION = null, param3: number = 0): void {
        if (this._pathID == param3) {
            this._hasPath = true;
            this._waypoints = param1;
        }
    }

    public Update(param1: boolean = false): void {
        if (param1 || this._lastRotation != Math.floor(this.mcMarker.rotation / 12)) {
            this._lastRotation = Math.floor(this.mcMarker.rotation / 12);
            SPRITES.GetSprite(this._graphic, "worker", "walking", this.mcMarker.rotation, this._frameNumber);
        }
    }

    public Target(param1: Point, param2: BFOUNDATION = null): void {
        if (!GLOBAL._catchup) {
            let _loc3_ = new Rectangle(param1.x, param1.y, 10, 10);
            if (param2) {
                _loc3_ = new Rectangle(param2._mc.x, param2._mc.y, param2._footprint[0].width, param2._footprint[0].height);
            }
            this._hasPath = false;
            PATHING.GetPath(new Point(this.x, this.y), _loc3_, this.setWaypoints.bind(this), true, param2);
        } else {
            this._waypoints = [new Point(this.x, this.y)];
        }
    }

    public Move(): void {
        let newSpeed: number;
        let Distance: number;
        if (this._waypoints.length > 0) {
            this._targetPosition = this._waypoints[0];
            if (!this._jumping) {
                const building = PATHING.GetBuildingFromISO(this._targetPosition);
                if (building) {
                    if (building.health > 0) {
                        TweenLite.to(this._graphicMC, 0.4, {
                            "y": this._graphicMC.y - 40,
                            "ease": Sine.easeOut,
                            "overwrite": false,
                            "onComplete": (): void => {
                                this._jumpingUp = false;
                            }
                        });
                        TweenLite.to(this._graphicMC, 0.4, {
                            "y": this._graphicMC.y,
                            "ease": Bounce.easeOut,
                            "overwrite": false,
                            "delay": 0.4,
                            "onComplete": (): void => {
                                this._jumping = false;
                            }
                        });
                        this._jumping = true;
                        this._jumpingUp = true;
                        if (this._messageMC) {
                            this.sayHide(null);
                        }
                    }
                }
            }
        }
        if (this._hasPath) {
            Distance = Point.distance(this._targetPosition, new Point(this.x, this.y));
            if (Distance < 20) {
                if (this._waypoints.length > 0) {
                    this._targetPosition = this._waypoints[0];
                    this._waypoints.splice(0, 1);
                }
                if (this._waypoints.length == 0) {
                    if (this._speed > 0) {
                        this._speed -= 0.1;
                    } else {
                        this._speed = 0;
                    }
                    if (this._targetTask && !this._targetTask._hasWorker) {
                        this._targetTask.HasWorker();
                    }
                }
            } else if (!this._targetTask) {
                if (this._speed < 1) {
                    this._speed += 0.05;
                } else {
                    this._speed -= 0.05;
                }
            } else if (this._speed < 2) {
                this._speed += 0.05;
            } else {
                this._speed -= 0.05;
            }
        }
        newSpeed = this._speed;
        if (this._jumping) {
            if (this._jumpingUp) {
                newSpeed *= 3;
            } else {
                newSpeed *= 2;
            }
        }
        this.y += Math.sin(this.mcMarker.rotation * 0.0174532925) * newSpeed;
        this.x += Math.cos(this.mcMarker.rotation * 0.0174532925) * newSpeed;
        this.yd = this._targetPosition.y - this.y;
        this.xd = this._targetPosition.x - this.x;
        this._targetRotation = Math.atan2(this.yd, this.xd) * 57.2957795 - 90;
        const difference = this.mcMarker.rotation - this._targetRotation;
        if (difference > 180) {
            this._targetRotation += 360;
        } else if (difference < -180) {
            this._targetRotation -= 360;
        }
        this._targetRotation += 90;
        let r: number;
        if (!this._targetTask) {
            r = (this._targetRotation - this.mcMarker.rotation) / 5;
        } else {
            r = (this._targetRotation - this.mcMarker.rotation) / 3;
        }
        if (r != 0) {
            this.mcMarker.rotation += r;
        }
        if (this._messageMC) {
            this._messageMC.x = this.x - 5;
            this._messageMC.y = this.y - 15;
        }
    }

    public Say(param1: string, param2: number = 2000): void {
        this.hideTimer.stop();
        this.hideTimer.delay = param2;
        if (this._messageMC) {
            MAP._PROJECTILES.removeChild(this._messageMC);
        }
        this._messageMC = MAP._PROJECTILES.addChild(new workerMessage()) as MovieClip;
        this._messageMC.visible = false;
        this._messageMC.txt.autoSize = "left";
        this._messageMC.txt.htmlText = param1;
        if (param1.length < 5) {
            this._messageMC.txt.width = 40;
            this._messageMC.mcBG.width = 50;
        } else if (param1.length < 12) {
            this._messageMC.txt.width = 70;
            this._messageMC.mcBG.width = 80;
        } else {
            this._messageMC.txt.width = 90;
            this._messageMC.mcBG.width = 100;
        }
        this._messageMC.mcBG.height = this._messageMC.txt.height + 17;
        this._messageMC.txt.y = 0 - this._messageMC.mcBG.height + 5;
        this.showTimer.start();
    }

    private sayShow(param1: TimerEvent = null): void {
        if (this._messageMC) {
            this._messageMC.visible = true;
            this.hideTimer.start();
        }
        this.showTimer.stop();
    }

    private sayHide(param1: TimerEvent): void {
        TweenLite.to(this._messageMC, 0.5, {
            "alpha": 0,
            "onComplete": this.sayHideB.bind(this)
        });
        this.hideTimer.stop();
    }

    private sayHideB(): void {
        if (this._messageMC && this._messageMC.parent) {
            this._messageMC.parent.removeChild(this._messageMC);
            this._messageMC = null;
        }
    }
}
