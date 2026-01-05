import Bitmap from 'openfl/display/Bitmap';
import BitmapData from 'openfl/display/BitmapData';
import DisplayObjectContainer from 'openfl/display/DisplayObjectContainer';
import Loader from 'openfl/display/Loader';
import Event from 'openfl/events/Event';
import IOErrorEvent from 'openfl/events/IOErrorEvent';
import TimerEvent from 'openfl/events/TimerEvent';
import URLRequest from 'openfl/net/URLRequest';
import LoaderContext from 'openfl/system/LoaderContext';
import Timer from 'openfl/utils/Timer';

/**
 * Loadable - Helper class for image loading management
 */
class Loadable {
    public key: string = "";
    public callbacks: any[][] = [];
    public shouldPrepend: boolean = true;
    public priority: number = 4;
    public loadState: number = 0;
    public tries: number = 0;
    public tryLimit: number = 3;
    public loader: Loader = new Loader();
}

/**
 * ImageCache - Image caching and loading system
 * Converted from ActionScript to TypeScript
 */
export class ImageCache {
    public static load: Loadable[] = [];
    public static groups: { [key: string]: any } = {};

    public static readonly UNLOADED: number = 0;
    public static readonly LOADING: number = 1;
    public static readonly LOADED: number = 2;
    public static readonly GAVE_UP: number = 3;

    private static instance: ImageCache | null = null;
    private static allowInstantiation: boolean = false;
    public static prependImagePath: string = "";

    public queue: Loadable[] = [];
    public cache: { [key: string]: Loadable } = {};
    private concurrentLoadLimit: number = 20;
    private loadTick: Timer;

    constructor() {
        if (ImageCache.allowInstantiation) {
            ImageCache.load = [].concat();
            this.queue = [].concat();
            this.cache = {};
            this.loadTick = new Timer(100);
            this.loadTick.addEventListener(TimerEvent.TIMER, this.checkQueue.bind(this));
            this.loadTick.start();
            return;
        }
        throw new Error("nice try, sucka'!");
    }

    private static getInstance(): ImageCache {
        if (!ImageCache.instance) {
            ImageCache.allowInstantiation = true;
            ImageCache.instance = new ImageCache();
            ImageCache.allowInstantiation = false;
        }
        return ImageCache.instance;
    }

    public static GetImageGroupWithCallBack(
        param1: string,
        param2: string[],
        param3: Function | null = null,
        param4: boolean = true,
        param5: number = 4,
        param6: string | null = null
    ): void {
        let _loc7_: any = null;
        let _loc8_: string = "";

        if (!ImageCache.groups[param1]) {
            ImageCache.groups[param1] = {
                urls: {},
                cbfs: [param3]
            };
            for (_loc8_ of param2) {
                ImageCache.groups[param1].urls[_loc8_] = {
                    loaded: false,
                    bmd: null,
                    state: param6
                };
            }
            for (_loc8_ of param2) {
                ImageCache.GetImageWithCallBack(_loc8_, ImageCache.GroupImageLoaded, param4, param5, param1);
            }
        } else {
            ImageCache.groups[param1].cbfs.push(param3);
            ImageCache.GroupImageLoaded(param1);
        }
    }

    public static GroupImageLoaded(param1: string, param2: string | null = null, param3: BitmapData | null = null): void {
        let _loc4_: any = null;
        let _loc5_: string = "";
        let _loc7_: any[][] = [];
        let _loc8_: Function | null = null;

        if (param2) {
            _loc4_ = ImageCache.groups[param1].urls[param2];
            _loc4_.loaded = true;
            _loc4_.bmd = param3;
        }

        let _loc6_: boolean = true;
        for (const key in ImageCache.groups[param1].urls) {
            _loc4_ = ImageCache.groups[param1].urls[key];
            if (!_loc4_.loaded) {
                _loc6_ = false;
            }
        }

        if (_loc6_) {
            _loc7_ = [];
            for (_loc5_ in ImageCache.groups[param1].urls) {
                _loc4_ = ImageCache.groups[param1].urls[_loc5_];
                _loc7_.push([_loc5_, _loc4_.bmd]);
            }
            for (_loc8_ of ImageCache.groups[param1].cbfs) {
                if (_loc8_) {
                    _loc8_(_loc7_, _loc4_.state);
                }
            }
            ImageCache.groups[param1].cbfs = [];
        }
    }

    public static ClearCache(): void {
        ImageCache.getInstance().cache = {};
    }

    public static GetImageWithCallBack(
        param1: string,
        param2: Function | null = null,
        param3: boolean = true,
        param4: number = 4,
        param5: string = "",
        param6: any[] | null = null
    ): void {
        let _loc9_: Loadable | null = null;
        let _loc10_: Loadable | null = null;
        let _loc7_: boolean = false;

        if (ImageCache.getInstance().cache[param1]) {
            if (param2 !== null) {
                ImageCache.getInstance().cache[param1].callbacks.push([param2, param5, param6]);
            }
            ImageCache.getInstance().executeAndRemoveCallbacksOnLoadable(ImageCache.getInstance().cache[param1]);
            _loc7_ = true;
        }

        let _loc8_: boolean = false;
        for (_loc9_ of ImageCache.getInstance().queue) {
            if (_loc9_.key === param1) {
                if (param2 !== null) {
                    _loc9_.callbacks.push([param2, param5, param6]);
                }
                _loc8_ = true;
                break;
            }
        }

        if (!_loc7_ && !_loc8_) {
            _loc10_ = new Loadable();
            if (param2 !== null) {
                _loc10_.callbacks.push([param2, param5, param6]);
            }
            _loc10_.shouldPrepend = param3;
            _loc10_.key = param1;
            _loc10_.priority = param4;
            _loc10_.loadState = ImageCache.UNLOADED;
            ImageCache.getInstance().queue.push(_loc10_);
            ImageCache.getInstance().queue.sort((a, b) => a.priority - b.priority);
        }
    }

    public static loadImageAndAddChild(param1: string, param2: DisplayObjectContainer): void {
        ImageCache.GetImageWithCallBack(param1, ImageCache.onImageLoad, true, 4, "", [param2]);
    }

    private static onImageLoad(param1: string, param2: BitmapData, param3: any[]): void {
        (param3[0] as DisplayObjectContainer).addChild(new Bitmap(param2));
    }

    private checkQueue(param1: TimerEvent | null = null): void {
        let _loc2_: number = 0;
        while (ImageCache.load.length < this.concurrentLoadLimit && this.queue.length !== 0) {
            _loc2_++;
            this.initLoadable(this.queue.shift()!);
        }
    }

    private initLoadable(queue: Loadable): void {
        const l: Loadable = queue;
        l.loadState = ImageCache.LOADING;
        const req_str: string = l.shouldPrepend ? ImageCache.prependImagePath + l.key : l.key;
        l.loader.load(new URLRequest(req_str), new LoaderContext(true));
        
        l.loader.contentLoaderInfo.addEventListener(Event.COMPLETE, (param1: Event) => {
            this.onAssetComplete(l);
        });
        l.loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, (param1: IOErrorEvent) => {
            this.onError(l);
        });
        l.loader.contentLoaderInfo.addEventListener(IOErrorEvent.NETWORK_ERROR, (param1: IOErrorEvent) => {
            this.onError(l);
        });
        ImageCache.load.push(l);
    }

    private onError(queue: Loadable): void {
        let _loc2_: number = 0;
        while (_loc2_ < ImageCache.load.length) {
            if (queue === ImageCache.load[_loc2_]) {
                ++queue.tries;
                if (queue.tries < queue.tryLimit) {
                    this.queue.push(ImageCache.load.splice(_loc2_, 1)[0]);
                } else {
                    queue.loadState = ImageCache.GAVE_UP;
                    ImageCache.load.splice(_loc2_, 1);
                    console.log("ImageCache.onError Failed" + queue);
                }
                return;
            }
            _loc2_++;
        }
    }

    private onAssetComplete(param1: Loadable): void {
        param1.loadState = ImageCache.LOADED;
        let _loc2_: number = 0;
        while (_loc2_ < ImageCache.load.length) {
            if (param1 === ImageCache.load[_loc2_]) {
                ImageCache.load.splice(_loc2_, 1);
            }
            _loc2_++;
        }
        this.cache[param1.key] = param1;
        this.executeAndRemoveCallbacksOnLoadable(param1);
    }

    private executeAndRemoveCallbacksOnLoadable(param1: Loadable): void {
        let _loc3_: any[] | null = null;
        let _loc4_: Bitmap | null = null;
        let _loc5_: Function | null = null;
        let _loc6_: string = "";
        let _loc7_: any[] | null = null;

        const _loc2_: any[][] = param1.callbacks.concat();
        param1.callbacks = [].concat();

        for (_loc3_ of _loc2_) {
            _loc4_ = param1.loader.content as Bitmap;
            _loc5_ = _loc3_[0];
            _loc6_ = String(_loc3_[1]);
            _loc7_ = _loc3_[2];

            if (_loc6_) {
                if (_loc7_) {
                    _loc5_!(_loc6_, param1.key, _loc4_.bitmapData, _loc7_);
                } else {
                    _loc5_!(_loc6_, param1.key, _loc4_.bitmapData);
                }
            } else if (_loc7_) {
                _loc5_!(param1.key, _loc4_.bitmapData, _loc7_);
            } else {
                _loc5_!(param1.key, _loc4_.bitmapData);
            }
        }
    }
}
