import BitmapData from 'openfl/display/BitmapData';
import Event from 'openfl/events/Event';
import Rectangle from 'openfl/geom/Rectangle';
import { ImageCache } from './com/monsters/display/ImageCache';
import { ICoreBuilding } from './com/monsters/interfaces/ICoreBuilding';
import { BFOUNDATION } from './BFOUNDATION';
import { BASE } from './BASE';

// Internal class ColorData
class ColorData {
    public lightAnimation: string;

    constructor(param1: string) {
        this.lightAnimation = "buildings/outpostdefender/" + param1;
    }
}

export class OutpostDefender extends BFOUNDATION implements ICoreBuilding {
    public static readonly k_TYPE: number = 140;
    private static colorData: ColorData[];

    constructor() {
        super();
        OutpostDefender.colorData = [
            new ColorData("self.light.png"),
            new ColorData("enemy.light.png"),
            new ColorData("ally.light.png"),
            new ColorData("neutral.light.png")
        ];
        this._animRandomStart = false;
        this._footprint = [new Rectangle(0, 0, 130, 130)];
        this._gridCost = [[new Rectangle(0, 0, 130, 130), 10], [new Rectangle(10, 10, 110, 110), 200]];
        this._type = OutpostDefender.k_TYPE;
        this.SetProps();
        this.animContainer.visible = false;
    }

    public setLightFromRelationship(param1: number): void {
        ImageCache.GetImageWithCallBack(OutpostDefender.colorData[param1].lightAnimation, this.loadedLightAnimationImage.bind(this));
    }

    private loadedLightAnimationImage(param1: string, param2: BitmapData): void {
        this._animBMD = param2;
        this.animContainer.visible = true;
    }

    public override TickFast(param1: Event = null): void {
        if (this._animLoaded && !this.animContainer.visible) {
            this.setLightFromRelationship(BASE.loadObject["relationship"]);
        }
        super.TickFast(param1);
        this.AnimFrame();
    }
}
