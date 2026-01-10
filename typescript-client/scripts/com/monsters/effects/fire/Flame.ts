import Bitmap from "openfl/display/Bitmap";
import BitmapData from "openfl/display/BitmapData";
import BlendMode from "openfl/display/BlendMode";
import DisplayObject from "openfl/display/DisplayObject";
import Sprite from "openfl/display/Sprite";
import ColorMatrixFilter from "openfl/filters/ColorMatrixFilter";
import ConvolutionFilter from "openfl/filters/ConvolutionFilter";
import ColorTransform from "openfl/geom/ColorTransform";
import Matrix from "openfl/geom/Matrix";
import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { Particle } from "./Particle";

/**
 * Flame - procedural fire effect using bitmap manipulation.
 */
export class Flame extends Sprite {
    private _emitter: DisplayObject;
    private _width: number;
    private _height: number;
    private _mc: DisplayObject;
    private _clearBmd: BitmapData;
    private _greyBmd: BitmapData;
    private _greyFilter: ColorMatrixFilter;
    private _spreadFilter: ConvolutionFilter;
    private _spread: number = 3;
    public phase: number = 0;
    private _cooling: number = 0;
    private _coolingBmd1: BitmapData;
    private _coolingBmd2: BitmapData;
    private _coolingOffset: Array<Point>;
    private _coolingFilter: ColorMatrixFilter | null = null;
    private _coolingOffset1: Point;
    private _coolingOffset2: Point;
    private _coolingTmpBmd1: BitmapData;
    private _coolingTmpBmd2: BitmapData;
    private _enhance: number = 0;
    private _enhanceTransform: ColorTransform | null = null;
    private _palette: Array<number>;
    private _paletteAlpha: Array<number>;
    private _fire: BitmapData;
    private _zeros: Array<number>;
    private _point: Point;
    private _rect: Rectangle;
    private _particleCount: number;
    private _particleFirst: Particle | null = null;
    private _sparkLife: number;
    private _sparkThreshold: number;

    constructor(emitter: DisplayObject, w: number, h: number) {
        super();
        this._emitter = emitter;
        this._width = w;
        this._height = h;
        this._point = new Point(0, 0);
        this._rect = new Rectangle(0, 0, this._width, this._height);
        this._clearBmd = new BitmapData(this._width, this._height, false, 0);
        this._greyBmd = new BitmapData(this._width, this._height, false, 0);
        this._greyFilter = new ColorMatrixFilter([0.198912, 0.586611, 0.114478, 0, 0, 0.298912, 0.586611, 0.114478, 0, 0, 0.298912, 0.586611, 0.114478, 0, 0, 0, 0, 0, 1, 0]);
        this._spread = 3;
        this._spreadFilter = new ConvolutionFilter(this._spread, this._spread, [0, 1, 0, 1, 1, 1, 0, 1, 0], 5);
        this._coolingBmd1 = new BitmapData(this._width, this._height, false, 0);
        this._coolingBmd2 = new BitmapData(this._width, this._height, false, 0);
        this._coolingOffset = [new Point(0, 0), new Point(0, 0)];
        this.cooling = 0.1;
        const noiseParams1 = 0.1;
        const noiseParams2 = 1;
        const noiseParams3 = 2;
        const noiseParams4 = 1;
        this._coolingBmd1.perlinNoise(this._width * noiseParams1, this._height * noiseParams2, 2, Math.random() * 1000, true, false, 0, true);
        this._coolingBmd2.perlinNoise(this._width * noiseParams3, this._height * noiseParams4, 2, Math.random() * 1000, true, false, 0, true);
        this._coolingTmpBmd1 = this._coolingBmd1.clone();
        this._coolingTmpBmd2 = this._coolingBmd2.clone();
        this._coolingOffset1 = new Point();
        this._coolingOffset2 = new Point();
        this._palette = [0, 0, 41877504, 61472768, 97268480, 114567680, 148840448, 165878784, 199765504, 233514752, 267268864, 284110848, 317798656, 334640640, 368259328, 385038848, 418657536, 435502336, 469055744, 502676992, 536295936, 553074688, 586628096, 603472384, 637025792, 653804288, 704200192, 720978688, 754533888, 771310592, 804865536, 821708032, 855262976, 872039936, 922371840, 939149824, 972703744, 989481728, 1023101952, 1039878912, 1073433856, 1106988544, 1140542464, 1157320448, 1190875136, 1207652096, 1241206784, 1274761728, 1291538432, 1325093376, 1341936640, 1375491328, 1409046016, 1442599936, 1459377664, 1492932352, 1509709312, 1543264000, 1560041728, 1610373888, 1627150848, 1660705536, 1677483264, 1711037696, 1727814656, 1761370112, 1778147072, 1828478464, 1828479232, 1878876160, 1895588352, 1929142784, 1945920512, 1979474944, 1996318208, 2029872128, 2063426560, 2096981248, 2113758208, 2147312640, 2164090368, 2197644288, 2214421760, 2247975936, 2281530368, 2315084800, 2331862016, 2365416448, 2382193920, 2415748096, 2432525568, 2466080000, 2499634176, 2533188608, 2549966080, 2583520256, 2600297728, 2633852160, 2667406336, 2684183808, 2717738240, 2751292416, 2768069888, 2801624320, 2835178496, 2851955968, 2885510400, 2902287616, 2935842048, 2969396480, 3002950656, 3019728128, 3053282560, 3070059776, 3103614208, 3120391168, 3154011392, 3187500288, 3221054720, 3237897472, 3271386368, 3288163328, 3305006336, 3321718016, 3338494976, 3355337984, 3355337984, 3372049664, 3372049664, 3388826880, 3405669632, 3405669632, 3422381056, 3439224064, 3439224064, 3455935744, 3472712960, 3472712960, 3489490176, 3506267136, 3506267136, 3523044608, 3539821824, 3539821824, 3556599040, 3573376256, 3573376256, 3590153216, 3606996224, 3623707904, 3623708416, 3640551936, 3640552960, 3657265152, 3674043648, 3674044416, 3690887936, 3707600384, 3707600896, 3724444416, 3741222912, 3741223680, 3757935872, 3774713856, 3774714880, 3791558656, 3808270848, 3808272128, 3825049856, 3841893376, 3841894400, 3858672128, 3875384832, 3875385600, 3892163840, 3909007104, 3909008128, 3925785856, 3942498560, 3942499072, 3959277568, 3976055552, 3976056320, 3992899840, 4009677824, 4009678592, 4026457088, 4043235072, 4043235584, 4059948032, 4076726016, 4076727040, 4093505024, 4110283264, 4110284032, 4127127552, 4143905792, 4143906305, 4160683525, 4177460746, 4177460750, 4194237971, 4211015191, 4211015196, 4227792416, 4244569636, 4244569641, 4261346862, 4278124082, 4278124086, 4294967100, 4294967104, 4294967109, 4294967113, 4294967118, 4294967122, 4294967126, 4294967131, 4294967136, 4294967140, 4294967145, 4294967149, 4294967153, 4294967158, 4294967162, 4294967167, 4294967171, 4294967176, 4294967180, 4294967185, 4294967189, 4294967194, 4294967198, 4294967203, 4294967207, 4294967211, 4294967216, 4294967220, 4294967225, 4294967230, 4294967234, 4294967238, 4294967243, 4294967247, 4294967252, 4294967256, 4294967261, 4294967265, 4294967269, 4294967274, 4294967279, 4294967283, 4294967288, 4294967292, 4294967295, 4294967295];
        this._zeros = new Array<number>(256);
        this._paletteAlpha = new Array<number>(256);
        for (let i = 0; i < 256; i++) {
            this._zeros[i] = 0;
            this._paletteAlpha[i] = i;
        }
        this.enhance = 1;
        this._sparkLife = 50;
        this._sparkThreshold = 50;
        this._particleCount = 50;
        let last: Particle | null = null;
        for (let i = 0; i < this._particleCount; i++) {
            const p = new Particle(Math.random() * this._width, Math.random() * this._height);
            if (this._particleFirst === null) {
                last = this._particleFirst = p;
            } else {
                last!.next = p;
                last = p;
            }
        }
        this._fire = new BitmapData(this._width, this._height, true, 0);
        this._mc = this.addChild(new Bitmap(this._fire));
        this._mc.x = -10;
        this._mc.y = -60;
    }

    public get emitter(): DisplayObject {
        return this._emitter;
    }

    public set emitter(value: DisplayObject) {
        this._emitter = value;
    }

    public get cooling(): number {
        return this._cooling;
    }

    public set cooling(value: number) {
        this._cooling = value;
        this._coolingFilter = new ColorMatrixFilter([value, 0, 0, 0, 0, 0, value, 0, 0, 0, 0, 0, value, 0, 0, 0, 0, 0, value, 0]);
    }

    public get enhance(): number {
        return this._enhance;
    }

    public set enhance(value: number) {
        this._enhance = value;
        this._enhanceTransform = new ColorTransform(this._enhance, this._enhance, this._enhance);
    }

    public get palette(): Array<number> {
        return this._palette;
    }

    public set palette(value: Array<number>) {
        this._palette = value;
    }

    public get sparkLife(): number {
        return this._sparkLife;
    }

    public set sparkLife(value: number) {
        this._sparkLife = value;
    }

    public get sparkThreshold(): number {
        return this._sparkThreshold;
    }

    public set sparkThreshold(value: number) {
        this._sparkThreshold = value;
    }

    public Tick(): void {
        const emitterRect = this._emitter.getRect(this._emitter);
        let particle: Particle | null = this._particleFirst;
        const matrix = new Matrix();
        matrix.translate(10, 60);
        this._greyBmd.lock();
        this._fire.lock();
        this._coolingTmpBmd1.lock();
        this._coolingTmpBmd2.lock();
        this._coolingBmd1.lock();
        this._coolingBmd2.lock();
        this._greyBmd.draw(this._emitter, matrix, this._enhanceTransform);
        this._greyBmd.applyFilter(this._greyBmd, this._rect, this._point, this._greyFilter);
        this._greyBmd.applyFilter(this._greyBmd, this._rect, this._point, this._spreadFilter);
        this._scrollBitmapData(this._coolingBmd1, this._coolingTmpBmd1, this._coolingOffset1.x, this._coolingOffset1.y);
        this._scrollBitmapData(this._coolingBmd2, this._coolingTmpBmd2, this._coolingOffset2.x, this._coolingOffset2.y);
        this._coolingOffset1.x -= 0;
        this._coolingOffset1.y -= 10;
        this._coolingOffset2.x += 2;
        this._coolingOffset2.y -= 5;
        this._coolingTmpBmd2.draw(this._coolingTmpBmd1, matrix, null, BlendMode.ADD);
        this._coolingTmpBmd2.applyFilter(this._coolingTmpBmd2, this._rect, this._point, this._coolingFilter!);
        this._greyBmd.draw(this._coolingTmpBmd2, null, null, BlendMode.SUBTRACT);
        this._greyBmd.scroll(0, -this._spread);
        do {
            const grey = this._greyBmd.getPixel(particle!.x, particle!.y) & 255;
            particle!.vx = Math.sin(particle!.clock);
            particle!.vy = -grey * 0.05 - 1;
            particle!.clock += 0.01;
            particle!.x += particle!.vx;
            particle!.y += particle!.vy;
            if (grey > this._sparkThreshold) {
                particle!.life = this._sparkLife;
            } else {
                --particle!.life;
            }
            if (particle!.x > emitterRect.x + emitterRect.width) {
                particle!.x -= emitterRect.width;
                particle!.life = 0;
            }
            if (particle!.x < emitterRect.x) {
                particle!.x += emitterRect.width;
                particle!.life = 0;
            }
            if (particle!.y < 0) {
                particle!.y += emitterRect.y + emitterRect.height;
                particle!.life = 0;
            }
            if (particle!.life > 0) {
                let brightness = particle!.life / this._sparkLife * 255;
                brightness = brightness > grey ? brightness : grey;
                this._greyBmd.setPixel(particle!.x + 10, particle!.y + 30, brightness << 16 | brightness << 8 | brightness);
            }
        } while (particle = particle!.next);
        this._fire.paletteMap(this._greyBmd, this._rect, this._point, this._zeros, this._zeros, this._palette, this._zeros);
        this._coolingBmd1.unlock();
        this._coolingBmd2.unlock();
        this._coolingTmpBmd1.unlock();
        this._coolingTmpBmd2.unlock();
        this._greyBmd.unlock();
        this._fire.unlock();
    }

    public Clear(): void {
        this._clearBmd.dispose();
        this._greyBmd.dispose();
        this._coolingBmd1.dispose();
        this._coolingBmd2.dispose();
        this._coolingTmpBmd1.dispose();
        this._coolingTmpBmd2.dispose();
        this._fire.dispose();
        this.removeChild(this._mc);
    }

    private _scrollBitmapData(src: BitmapData, dst: BitmapData, dx: number, dy: number): void {
        dx %= this._width;
        dy %= this._height;
        if (dx !== 0) {
            if (dx > 0) {
                dst.copyPixels(src, new Rectangle(0, 0, this._width - dx, this._height), new Point(dx, 0));
                dst.copyPixels(src, new Rectangle(this._width - dx, 0, dx, this._height), this._point);
            } else {
                dst.copyPixels(src, new Rectangle(-dx, 0, this._width + dx, this._height), this._point);
                dst.copyPixels(src, new Rectangle(0, 0, -dx, this._height), new Point(this._width + dx, 0));
            }
        }
        if (dy !== 0) {
            let srcCopy = src;
            if (dx !== 0) {
                srcCopy = dst.clone();
            }
            if (dy > 0) {
                dst.copyPixels(srcCopy, new Rectangle(0, 0, this._width, this._height - dy), new Point(0, dy));
                dst.copyPixels(srcCopy, new Rectangle(0, this._height - dy, this._width, dy), this._point);
            } else {
                dst.copyPixels(srcCopy, new Rectangle(0, -dy, this._width, this._height + dy), this._point);
                dst.copyPixels(srcCopy, new Rectangle(0, 0, this._width, -dy), new Point(0, this._height + dy));
            }
        }
    }
}
